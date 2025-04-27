
import dotenv from 'dotenv';
dotenv.config();

export default {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-default-jwt-secret-change-this',
    expiresIn: '15m', // Short-lived access token
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret-change-this',
    refreshExpiresIn: '7d', // Refresh token lasts longer
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
  },
  facebook: {
    clientID: process.env.FACEBOOK_APP_ID || '',
    clientSecret: process.env.FACEBOOK_APP_SECRET || '',
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3000/auth/facebook/callback',
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:8080',
  },
  email: {
    from: process.env.EMAIL_FROM || 'noreply@signscribe.com',
    service: process.env.EMAIL_SERVICE || '',
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
  security: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 minutes in milliseconds
  }
};
