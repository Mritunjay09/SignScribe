import express from 'express';
import cors from 'cors';
import path from 'path';
import pool from './db';
import config from './config';
import { authenticateJWT, authorizeRoles } from './middleware/auth';
import { User } from './models/User';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generatePasswordResetToken,
  sanitizeUser,
  isStrongPassword,
  verifyEmailFormat,
} from './utils/authUtils';
import { sendPasswordResetEmail, sendVerificationEmail } from './utils/emailUtils';
import { upload } from './utils/uploadUtils';
import { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(
  cors({
    origin: config.frontend.url,
    credentials: true,
  })
);
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Initialize database
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
    process.exit(1); // Exit on DB failure
  }
};
initializeDatabase();

// Rate-limiting middleware
const requestCounts = new Map<string, number[]>();
const RATE_LIMIT = config.security.maxRequestsPerMinute || 100;
const WINDOW_MS = 60 * 1000; // 1 minute

const rateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const ip = req.ip as string;
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const requestTimes = requestCounts.get(ip) || [];
  const recentRequests = requestTimes.filter((time) => time > windowStart);

  if (recentRequests.length >= RATE_LIMIT) {
    res.status(429).json({ message: 'Too many requests. Please try again later.' });
    return;
  }

  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);

  // Cleanup old IPs (run periodically)
  if (requestCounts.size > 1000) {
    for (const [key, times] of requestCounts) {
      if (times.every((time) => now - time > WINDOW_MS)) {
        requestCounts.delete(key);
      }
    }
  }

  next();
};

// Apply rate-limiter to specific routes
const authRateLimiter = rateLimiter; // Can customize for auth routes

// Interface for request with user
declare global {
  namespace Express {
    interface Request {
      user?: User;  // This augments the existing Request type
    }
  }
}

// Update timestamp middleware
app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'PUT' || req.method === 'POST') {
    const match = req.path.match(/\/[0-9]+$/);
    if (match) {
      const id = parseInt(match[0].substring(1));
      try {
        await pool.query('UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);
      } catch (error) {
        console.error('Error updating timestamp:', error);
        return next(error);
      }
    }
  }
  next();
});

// Auth Routes
app.post('/signup', authRateLimiter, async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
       res.status(400).json({ message: 'User with this email already exists' });
       return;
    }

    if (!isStrongPassword(password)) {
      res.status(400).json({
        message:
          'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
      });
      return;
    }
    if (!verifyEmailFormat(email)) {
      res.status(400).json({
        message:
          'Email Format is invaild',
      });
      return;
    }

    const hashedPassword = await hashPassword(password);
    //const verificationToken = generatePasswordResetToken();

    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, 'user']
    );
    const user = result.rows[0];

    const token = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id]);

    //await sendVerificationEmail(email, verificationToken, name);

    res.status(201).json({
      user: sanitizeUser(user),
      token,
      refreshToken,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/login', authRateLimiter, async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
       res.status(401).json({ message: 'Invalid credentials' });
       return;
    }

    const user = result.rows[0];

    if (user.lock_until && new Date(user.lock_until) > new Date()) {
      const lockTimeRemaining = Math.ceil(
        (new Date(user.lock_until).getTime() - new Date().getTime()) / 60000
      );
      res.status(403).json({
        message: `Account is locked. Try again in ${lockTimeRemaining} minutes.`,
      });
      return;
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      const failedAttempts = user.failed_login_attempts + 1;
      let lockUntil = null;

      if (failedAttempts >= config.security.maxLoginAttempts) {
        lockUntil = new Date(Date.now() + config.security.lockTime);
      }

      await pool.query(
        'UPDATE users SET failed_login_attempts = $1, lock_until = $2 WHERE id = $3',
        [failedAttempts, lockUntil, user.id]
      );

      res.status(401).json({
        message: 'Invalid credentials',
        attemptsLeft: config.security.maxLoginAttempts - failedAttempts,
      });
      return;
    }

    await pool.query(
      'UPDATE users SET failed_login_attempts = 0, lock_until = NULL, last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    const token = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id]);

    res.status(200).json({
      user: sanitizeUser(user),
      token,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/refresh-token', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
     res.status(401).json({ message: 'Refresh token is required' });
     return;
  }

  try {
    const decoded = await verifyRefreshToken(refreshToken);
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND refresh_token = $2',
      [decoded.id, refreshToken]
    );

    if (result.rows.length === 0) {
       res.status(401).json({ message: 'Invalid refresh token' });
       return;
    }

    const user = result.rows[0];
    const newAccessToken = await generateAccessToken(user);

    res.status(200).json({ token: newAccessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

app.post('/logout', authenticateJWT, async (req: Request, res: Response) => {
  const user = req.user as User;

  try {
    await pool.query('UPDATE users SET refresh_token = NULL WHERE id = $1', [user.id]);
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/forgot-password', authRateLimiter, async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
       res.status(200).json({ message: 'Password reset link sent if email exists.' });
       return;
    }

    const user = result.rows[0];
    const resetToken = generatePasswordResetToken();
    const resetExpires = new Date(Date.now() + 3600000);

    await pool.query(
      'UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3',
      [resetToken, resetExpires, user.id]
    );

    await sendPasswordResetEmail(user.email, resetToken, user.name);

    res.status(200).json({ message: 'Password reset link sent if email exists.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/reset-password/:token', authRateLimiter, async (req: Request, res: Response) => {
  const { password } = req.body;

  try {
    const { token } = req.params; // Extract token from route parameters
    const result = await pool.query(
      'SELECT * FROM users WHERE password_reset_token = $1 AND password_reset_expires > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      res.status(400).json({ message: 'Invalid or expired reset token' });
      return;
    }

    const user = result.rows[0];

    if (!isStrongPassword(password)) {
       res.status(400).json({
        message:
          'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
      });
      return;
    }

    const hashedPassword = await hashPassword(password);

    await pool.query(
      'UPDATE users SET password = $1, password_reset_token = NULL, password_reset_expires = NULL, last_password_change = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, user.id]
    );

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Protected Routes
app.get('/profile', authenticateJWT, async (req: Request, res: Response) => {
  const user = req.user as User;
  try {
    res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put(
  '/profile',
  authenticateJWT,
  upload.single('profilePicture'),
  async (req: Request, res: Response) => {
    const user = req.user as User;
    const { name, bio } = req.body;

    try {
      let profilePicture = user.profile_picture || '';
      if (req.file) {
        profilePicture = `/uploads/${req.file.filename}`;
      }

      const result = await pool.query(
        'UPDATE users SET name = $1, bio = $2, profile_picture = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
        [name || user.name, bio || user.bio, profilePicture, user.id]
      );

      res.status(200).json({ user: sanitizeUser(result.rows[0]) });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/admin/users', authenticateJWT, authorizeRoles(['admin']), async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    const sanitizedUsers = result.rows.map((user) => sanitizeUser(user));
    res.status(200).json({ users: sanitizedUsers });
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.put(
  '/admin/users/:id/role',
  authenticateJWT,
  authorizeRoles(['admin']),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

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
      console.error('Update user role error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});