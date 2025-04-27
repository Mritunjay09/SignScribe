
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import path from 'path';
import pool from './db';
import config from './config';
import { authenticateJWT, authenticateGoogle, authenticateFacebook } from './middleware/auth';
import { hashPassword, comparePassword, generateToken, sanitizeUser } from './utils/authUtils';
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
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
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create new user
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', 
      [name, email, hashedPassword]
    );
    
    // Generate token
    const token = generateToken(result.rows[0]);
    
    // Return user data and token
    res.status(201).json({
      user: sanitizeUser(result.rows[0]),
      token
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Check if password is correct
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Return user data and token
    res.status(200).json({
      user: sanitizeUser(user),
      token
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

// Google OAuth login route
app.get('/auth/google', authenticateGoogle);

// Google OAuth callback
app.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const token = generateToken(req.user as any);
  res.redirect(`${config.frontend.url}/auth/success?token=${token}`);
});

// Facebook OAuth login route
app.get('/auth/facebook', authenticateFacebook);

// Facebook OAuth callback
app.get('/auth/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
  const token = generateToken(req.user as any);
  res.redirect(`${config.frontend.url}/auth/success?token=${token}`);
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

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
