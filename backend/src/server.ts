import express from 'express';
import cors from 'cors';
import passport from 'passport';
import path from 'path';
import pool from './db';
import config from './config';
import { authenticateJWT, authenticateGoogle, authenticateFacebook, authorizeRoles } from './middleware/auth';
import { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  generateRefreshToken,
  verifyRefreshToken,
  generatePasswordResetToken,
  sanitizeUser,
  isStrongPassword
} from './utils/authUtils';
import { sendPasswordResetEmail, sendVerificationEmail } from './utils/emailUtils';
import { upload } from './utils/uploadUtils';
import './middleware/auth'; // Import to initialize passport strategies

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: config.frontend.url,
  credentials: true,
}));
app.use(express.json());
app.use(passport.initialize());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Create tables if they don't exist
const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        bio TEXT,
        profile_picture VARCHAR(255),
        google_id VARCHAR(255),
        facebook_id VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        refresh_token TEXT,
        password_reset_token VARCHAR(255),
        password_reset_expires TIMESTAMP,
        is_email_verified BOOLEAN DEFAULT false,
        failed_login_attempts INTEGER DEFAULT 0,
        lock_until TIMESTAMP,
        last_login TIMESTAMP,
        last_password_change TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Rate limiting middleware
const requestCounts = new Map();
const rateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = req.ip;
  const now = Date.now();
  const windowStart = now - 60000; // 1 minute window
  
  const requestTimes = requestCounts.get(ip) || [];
  const recentRequests: number[] = requestTimes.filter((time: number) => time > windowStart);
  
  if (recentRequests.length >= config.security.maxRequestsPerMinute) {
    return res.status(429).json({ message: 'Too many requests. Please try again later.' });
  }
  
  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);
  
  next();
};

// Initialize database on startup
initializeDatabase();

// Helper function to update timestamp
app.use(async (req, res, next) => {
  if (req.method === 'PUT' || req.method === 'POST') {
    const routeEndsWithId = req.path.match(/\/[0-9]+$/);
    if (routeEndsWithId) {
      await pool.query('UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', 
        [parseInt(routeEndsWithId[0].substring(1))]);
    }
  }
  next();
});

// Auth Routes
// Register new user
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
       res.status(400).json({ message: 'User with this email already exists' });
       return;
    }
    
    // Validate password strength
    if (!isStrongPassword(password)) {
      res.status(400).json({ 
        message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character' 
      });
      return;
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Generate verification token
    const verificationToken = generatePasswordResetToken();
    
    // Create new user
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *', 
      [name, email, hashedPassword, 'user']
    );
    
    const user = result.rows[0];
    
    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Store refresh token in database
    await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id]);
    
    // Send verification email
    await sendVerificationEmail(email, verificationToken, name);
    
    // Return user data and tokens
    res.status(201).json({
      user: sanitizeUser(user),
      token,
      refreshToken
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login route with account locking
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    
    const user = result.rows[0];
    
    // Check if account is locked
    if (user.lock_until && new Date(user.lock_until) > new Date()) {
      const lockTimeRemaining = Math.ceil((new Date(user.lock_until).getTime() - new Date().getTime()) / 60000);
      res.status(403).json({ 
        message: `Account is locked. Try again in ${lockTimeRemaining} minutes.` 
      });
      return;
    }
    
    // Check if password is correct
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      // Increment failed login attempts
      const failedAttempts = user.failed_login_attempts + 1;
      let lockUntil = null;
      
      // Lock account after certain number of failed attempts
      if (failedAttempts >= config.security.maxLoginAttempts) {
        lockUntil = new Date(Date.now() + config.security.lockTime);
      }
      
      await pool.query(
        'UPDATE users SET failed_login_attempts = $1, lock_until = $2 WHERE id = $3',
        [failedAttempts, lockUntil, user.id]
      );
      
      res.status(401).json({ 
        message: 'Invalid credentials',
        attemptsLeft: config.security.maxLoginAttempts - failedAttempts
      });
      return;
    }
    
    // Reset failed login attempts on successful login
    await pool.query(
      'UPDATE users SET failed_login_attempts = 0, lock_until = NULL, last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );
    
    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Store refresh token in database
    await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id]);
    
    // Return user data and tokens
    res.status(200).json({
      user: sanitizeUser(user),
      token,
      refreshToken
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Refresh token
app.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    res.status(401).json({ message: 'Refresh token is required' });
    return;
  }
  
  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      res.status(401).json({ message: 'Invalid refresh token' });
      return;
    }
    
    // Find user by ID and check if refresh token matches
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND refresh_token = $2',
      [decoded.id, refreshToken]
    );
    
    if (result.rows.length === 0) {
      res.status(401).json({ message: 'Invalid refresh token' });
      return;
    }
    
    const user = result.rows[0];
    
    // Generate new access token
    const newAccessToken = generateToken(user);
    
    res.status(200).json({
      token: newAccessToken
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ message: 'Error refreshing token' });
  }
});

// Logout
app.post('/logout', authenticateJWT, async (req, res) => {
  const user = req.user as any;
  
  try {
    // Clear refresh token in database
    await pool.query('UPDATE users SET refresh_token = NULL WHERE id = $1', [user.id]);
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Error during logout' });
  }
});

// Forgot password - send reset email
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  try {
    // Find user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      // For security reasons, don't reveal that the email doesn't exist
      res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
      return;
    }
    
    const user = result.rows[0];
    
    // Generate password reset token
    const resetToken = generatePasswordResetToken();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour
    
    // Store token and expiry in database
    await pool.query(
      'UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3',
      [resetToken, resetExpires, user.id]
    );
    
    // Send password reset email
    await sendPasswordResetEmail(user.email, resetToken, user.name);
    
    res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ message: 'Error requesting password reset' });
  }
});

// Reset password with token
app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  
  try {
    // Find user with the reset token that hasn't expired
    const result = await pool.query(
      'SELECT * FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()',
      [token]
    );
    
    if (result.rows.length === 0) {
      res.status(400).json({ message: 'Password reset token is invalid or has expired' });
      return;
    }
    
    const user = result.rows[0];
    
    // Validate password strength
    if (!isStrongPassword(password)) {
      res.status(400).json({ 
        message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character' 
      });
      return;
    }
    
    // Hash new password
    const hashedPassword = await hashPassword(password);
    
    // Update user password and clear reset token
    await pool.query(
      'UPDATE users SET password = $1, password_reset_token = NULL, password_reset_expires = NULL WHERE id = $2',
      [hashedPassword, user.id]
    );
    
    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

// Google OAuth login route
app.get('/auth/google', authenticateGoogle);

// Google OAuth callback
app.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const user = req.user as any;
  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  
  // Store refresh token in database
  pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id])
    .catch(err => console.error('Error storing refresh token:', err));
  
  res.redirect(`${config.frontend.url}/auth/success?token=${token}&refreshToken=${refreshToken}`);
});

// Facebook OAuth login route
app.get('/auth/facebook', authenticateFacebook);

// Facebook OAuth callback
app.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
  const user = req.user as any;
  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  
  // Store refresh token in database
  pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id])
    .catch(err => console.error('Error storing refresh token:', err));
  
  res.redirect(`${config.frontend.url}/auth/success?token=${token}&refreshToken=${refreshToken}`);
});

// Protected route to get user profile
app.get('/profile', authenticateJWT, async (req, res) => {
  try {
    res.status(200).json({ user: sanitizeUser(req.user) });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Protected route to update user profile
app.put('/profile', authenticateJWT, upload.single('profilePicture'), async (req, res) => {
  const { name, bio } = req.body;
  const user = req.user as any;
  
  try {
    let profilePicture = user.profile_picture;
    
    // If there's a new profile picture
    if (req.file) {
      profilePicture = `/uploads/${req.file.filename}`;
    }
    
    // Update user profile
    const result = await pool.query(
      'UPDATE users SET name = $1, bio = $2, profile_picture = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [name || user.name, bio || user.bio, profilePicture, user.id]
    );
    
    res.status(200).json({ user: sanitizeUser(result.rows[0]) });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Admin-only route example
app.get('/admin/users', authenticateJWT, authorizeRoles(['admin']), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    const sanitizedUsers = result.rows.map(user => sanitizeUser(user));
    
    res.status(200).json({ users: sanitizedUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Change user role (admin only)
app.put('/admin/users/:id/role', authenticateJWT, authorizeRoles(['admin']), async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  
  // Validate role
  const validRoles = ['user', 'admin', 'moderator'];
  if (!validRoles.includes(role)) {
    res.status(400).json({ message: 'Invalid role specified' });
    return;
  }
  
  try {
    const result = await pool.query(
      'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [role, id]
    );
    
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.status(200).json({ user: sanitizeUser(result.rows[0]) });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
