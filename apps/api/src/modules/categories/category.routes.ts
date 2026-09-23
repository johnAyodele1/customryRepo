import { Router } from 'express';
import { categoryController } from './category.controller';
import { asyncHandler } from '../../shared/middleware/asyncHandler';
import { requireAuth, requireAdmin } from '../auth/auth.middleware';
import { validateRequest } from '../../shared/middleware/validate';
import { CreateCategorySchema, UpdateCategorySchema } from '@customry/contracts';

const router = Router();

router.get('/', asyncHandler(categoryController.getAll.bind(categoryController)));
router.get('/:code', asyncHandler(categoryController.getByCode.bind(categoryController)));

router.post(
  '/',
  requireAuth,
  requireAdmin,
  validateRequest({ body: CreateCategorySchema }),
  asyncHandler(categoryController.create.bind(categoryController))
);

router.patch(
  '/:id',
  requireAuth,
  requireAdmin,
  validateRequest({ body: UpdateCategorySchema }),
  asyncHandler(categoryController.update.bind(categoryController))
);

export const categoryRoutes = router;
