import { Router } from 'express';
import { orderController } from './order.controller';
import { asyncHandler } from '../../shared/middleware/asyncHandler';
import { requireAuth, requireAdmin } from '../auth/auth.middleware';
import { validateRequest } from '../../shared/middleware/validate';
import {
  CreateOrderSchema,
  UpdateOrderStatusSchema,
  OrderQuerySchema,
} from '@customry/contracts';

const router = Router();

router.post(
  '/',
  validateRequest({ body: CreateOrderSchema }),
  asyncHandler(orderController.createOrder.bind(orderController))
);

router.get(
  '/track/:orderNumber',
  asyncHandler(orderController.getOrderByNumber.bind(orderController))
);

router.get(
  '/',
  requireAuth,
  requireAdmin,
  validateRequest({ query: OrderQuerySchema }),
  asyncHandler(orderController.getOrders.bind(orderController))
);

router.get(
  '/:id',
  requireAuth,
  requireAdmin,
  asyncHandler(orderController.getOrderById.bind(orderController))
);

router.patch(
  '/:id/status',
  requireAuth,
  requireAdmin,
  validateRequest({ body: UpdateOrderStatusSchema }),
  asyncHandler(orderController.updateOrderStatus.bind(orderController))
);

export const orderRoutes = router;
