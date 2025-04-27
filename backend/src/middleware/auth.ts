import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from '../config';
import pool from '../db';
import { Request, Response, NextFunction } from 'express';

passport.use(
  new JwtStrategy(
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
  )
);

export const authenticateJWT = passport.authenticate('jwt', { session: false });

export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as any;
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    if (!roles.includes(user.role)) {
      res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      return;
    }
    next();
  };
};