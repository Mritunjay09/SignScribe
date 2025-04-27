
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import config from '../config';
import pool from '../db';

// JWT strategy for protecting routes
passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt.secret,
  },
  async (jwtPayload, done) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [jwtPayload.id]);
      if (result.rows.length === 0) {
        return done(null, false);
      }
      return done(null, result.rows[0]);
    } catch (error) {
      return done(error, false);
    }
  }
));

// Google OAuth strategy
passport.use(new GoogleStrategy(
  {
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      const existingUser = await pool.query('SELECT * FROM users WHERE googleId = $1 OR email = $2', 
        [profile.id, profile.emails?.[0].value]);
      
      if (existingUser.rows.length > 0) {
        // Update googleId if user exists with same email
        if (!existingUser.rows[0].googleId) {
          await pool.query('UPDATE users SET googleId = $1 WHERE id = $2', 
            [profile.id, existingUser.rows[0].id]);
        }
        return done(null, existingUser.rows[0]);
      }
      
      // Create new user
      const newUser = await pool.query(
        'INSERT INTO users (name, email, googleId, password, profilePicture) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [
          profile.displayName,
          profile.emails?.[0].value || '',
          profile.id,
          'GOOGLE_AUTH', // Placeholder password for Google auth users
          profile.photos?.[0]?.value || null,
        ]
      );
      
      return done(null, newUser.rows[0]);
    } catch (error) {
      return done(error, false);
    }
  }
));

// Facebook OAuth strategy
passport.use(new FacebookStrategy(
  {
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: ['id', 'displayName', 'photos', 'email'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      const existingUser = await pool.query('SELECT * FROM users WHERE facebookId = $1 OR email = $2', 
        [profile.id, profile.emails?.[0].value]);
      
      if (existingUser.rows.length > 0) {
        // Update facebookId if user exists with same email
        if (!existingUser.rows[0].facebookId) {
          await pool.query('UPDATE users SET facebookId = $1 WHERE id = $2', 
            [profile.id, existingUser.rows[0].id]);
        }
        return done(null, existingUser.rows[0]);
      }
      
      // Create new user
      const newUser = await pool.query(
        'INSERT INTO users (name, email, facebookId, password, profilePicture) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [
          profile.displayName,
          profile.emails?.[0].value || '',
          profile.id,
          'FACEBOOK_AUTH', // Placeholder password for Facebook auth users
          profile.photos?.[0]?.value || null,
        ]
      );
      
      return done(null, newUser.rows[0]);
    } catch (error) {
      return done(error, false);
    }
  }
));

// For sessions (if needed)
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return done(null, false);
    }
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

export const authenticateJWT = passport.authenticate('jwt', { session: false });
export const authenticateGoogle = passport.authenticate('google', { scope: ['profile', 'email'] });
export const authenticateFacebook = passport.authenticate('facebook', { scope: ['email'] });
