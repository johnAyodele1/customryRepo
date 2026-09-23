import { Router } from 'express';
import { cartController } from './cart.controller';
import { asyncHandler } from '../../shared/middleware/asyncHandler';

const router = Router();

router.post('/validate', asyncHandler(cartController.validateCart.bind(cartController)));

export const cartRoutes = router;
