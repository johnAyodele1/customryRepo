import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from '../config/env';
import { errorHandler } from '../shared/middleware/errorHandler';
import { sendSuccess } from '../shared/http/response';
import { authRoutes } from '../modules/auth/auth.routes';
import { categoryRoutes } from '../modules/categories/category.routes';
import { productRoutes } from '../modules/products/product.routes';
import { inventoryRoutes } from '../modules/inventory/inventory.routes';
import { cartRoutes } from '../modules/carts/cart.routes';
import { orderRoutes } from '../modules/orders/order.routes';
import { paymentRoutes } from '../modules/payments/payment.routes';
import { adminRoutes } from '../modules/admin/admin.routes';
import { customerRoutes } from '../modules/customers/customer.routes';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: [env.FRONTEND_URL, 'http://localhost:3000'],
      credentials: true,
    })
  );
  app.use(express.json());

  app.get('/health', (_req, res) => {
    sendSuccess(res, { status: 'healthy', timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/customers', customerRoutes);

  app.use(errorHandler);

  return app;
};
