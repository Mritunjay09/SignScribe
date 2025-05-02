import dotenv from 'dotenv';
dotenv.config();

export default {
    // ... other config
  email: {
    service: process.env.EMAIL_SERVICE || 'Gmail', // Use 'Gmail' for simplicity
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10), // Safer parsing
    secure: (process.env.EMAIL_PORT || '587') === '465', // True for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER || (() => { throw new Error('EMAIL_USER is required'); })(),
      pass: process.env.EMAIL_PASS || (() => { throw new Error('EMAIL_PASS is required'); })(),
    },
    from: `"SignScribe" <${process.env.EMAIL_USER || 'no-reply@signscribe.com'}>`, // Match EMAIL_USER for Gmail
    // Omit tls for Gmail; add conditionally for other providers if needed
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-default-jwt-secret-change-this',
    expiresIn: '15m', // Short-lived access token
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret-change-this',
    refreshExpiresIn: '30d', // Refresh token lasts longer
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
    url: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  security: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 minutes in milliseconds
    passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    maxRequestsPerMinute: 60,
  }
};
