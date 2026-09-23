import { Router } from 'express';
import { inventoryController } from './inventory.controller';
import { asyncHandler } from '../../shared/middleware/asyncHandler';
import { requireAuth, requireAdmin } from '../auth/auth.middleware';
import { validateRequest } from '../../shared/middleware/validate';
import { AdjustInventorySchema } from '@customry/contracts';

const router = Router();

router.post(
  '/adjust',
  requireAuth,
  requireAdmin,
  validateRequest({ body: AdjustInventorySchema }),
  asyncHandler(inventoryController.adjustInventory.bind(inventoryController))
);

export const inventoryRoutes = router;
