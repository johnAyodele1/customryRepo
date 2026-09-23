import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../../shared/utils/jwt';
import { AuthenticationError, AuthorizationError } from '../../shared/errors';
import { UserRole } from '@customry/contracts';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

export const requireAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError('Authentication required'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch {
    return next(new AuthenticationError('Invalid or expired token'));
  }
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AuthorizationError('Insufficient permissions'));
    }

    next();
  };
};

export const requireAdmin = requireRole('ADMIN', 'STAFF');
