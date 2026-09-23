import { Router } from 'express';
import { customerController } from './customer.controller';
import { asyncHandler } from '../../shared/middleware/asyncHandler';
import { requireAuth, requireAdmin } from '../auth/auth.middleware';

const router = Router();

router.get(
  '/',
  requireAuth,
  requireAdmin,
  asyncHandler(customerController.getCustomers.bind(customerController))
);

export const customerRoutes = router;
