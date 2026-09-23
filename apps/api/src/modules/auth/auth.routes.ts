import { Router } from 'express';
import { authController } from './auth.controller';
import { validateRequest } from '../../shared/middleware/validate';
import { LoginSchema, RegisterSchema, RefreshTokenSchema } from './auth.schemas';
import { asyncHandler } from '../../shared/middleware/asyncHandler';
import { requireAuth } from './auth.middleware';

const router = Router();

router.post(
  '/register',
  validateRequest({ body: RegisterSchema }),
  asyncHandler(authController.register.bind(authController))
);

router.post(
  '/login',
  validateRequest({ body: LoginSchema }),
  asyncHandler(authController.login.bind(authController))
);

router.post(
  '/refresh',
  validateRequest({ body: RefreshTokenSchema }),
  asyncHandler(authController.refreshToken.bind(authController))
);

router.get(
  '/me',
  requireAuth,
  asyncHandler(authController.getCurrentUser.bind(authController))
);

export const authRoutes = router;
