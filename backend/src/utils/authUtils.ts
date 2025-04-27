import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import config from '../config';
import { User } from '../models/User';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateAccessToken = async (user: User): Promise<string> => {
  if (!config.jwt.secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  const secret = new TextEncoder().encode(config.jwt.secret);
  return new SignJWT({ id: user.id, email: user.email, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(config.jwt.expiresIn || '15m')
    .sign(secret);
};

export const generateRefreshToken = async (user: User): Promise<string> => {
  if (!config.jwt.refreshSecret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }
  const secret = new TextEncoder().encode(config.jwt.refreshSecret);
  return new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(config.jwt.refreshExpiresIn || '7d')
    .sign(secret);
};

export const verifyRefreshToken = async (token: string): Promise<{ id: number }> => {
  if (!config.jwt.refreshSecret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }
  const secret = new TextEncoder().encode(config.jwt.refreshSecret);
  const { payload } = await jwtVerify(token, secret);
  return { id: payload.id as number };
};

export const generatePasswordResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const isStrongPassword = (password: string): boolean => {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

export const sanitizeUser = (user: User): Partial<User> => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    bio: user.bio,
    profile_picture: user.profile_picture,
    is_email_verified: user.is_email_verified,
    last_login: user.last_login,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};