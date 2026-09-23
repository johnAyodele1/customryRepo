import { Router } from 'express';
import { productController } from './product.controller';
import { asyncHandler } from '../../shared/middleware/asyncHandler';
import { requireAuth, requireAdmin } from '../auth/auth.middleware';
import { validateRequest } from '../../shared/middleware/validate';
import {
  CreateProductSchema,
  UpdateProductSchema,
  ProductQuerySchema,
} from '@customry/contracts';

const router = Router();

router.get(
  '/',
  validateRequest({ query: ProductQuerySchema }),
  asyncHandler(productController.getProducts.bind(productController))
);

router.get(
  '/slug/:slug',
  asyncHandler(productController.getProductBySlug.bind(productController))
);

router.get(
  '/:id',
  asyncHandler(productController.getProductById.bind(productController))
);

router.post(
  '/',
  requireAuth,
  requireAdmin,
  validateRequest({ body: CreateProductSchema }),
  asyncHandler(productController.createProduct.bind(productController))
);

router.patch(
  '/:id',
  requireAuth,
  requireAdmin,
  validateRequest({ body: UpdateProductSchema }),
  asyncHandler(productController.updateProduct.bind(productController))
);

router.post(
  '/:id/publish',
  requireAuth,
  requireAdmin,
  asyncHandler(productController.publishProduct.bind(productController))
);

router.post(
  '/:id/archive',
  requireAuth,
  requireAdmin,
  asyncHandler(productController.archiveProduct.bind(productController))
);

export const productRoutes = router;
