import { Router } from 'express';
import { adminController } from './admin.controller';
import { asyncHandler } from '../../shared/middleware/asyncHandler';
import { requireAuth, requireAdmin } from '../auth/auth.middleware';

const router = Router();

router.get(
  '/dashboard',
  requireAuth,
  requireAdmin,
  asyncHandler(adminController.getDashboardStats.bind(adminController))
);

export const adminRoutes = router;
