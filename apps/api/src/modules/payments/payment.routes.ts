import { Router } from 'express';
import { paymentController } from './payment.controller';
import { asyncHandler } from '../../shared/middleware/asyncHandler';
import { validateRequest } from '../../shared/middleware/validate';
import { CreatePaymentIntentSchema } from '@customry/contracts';

const router = Router();

router.post(
  '/intent',
  validateRequest({ body: CreatePaymentIntentSchema }),
  asyncHandler(paymentController.createPaymentIntent.bind(paymentController))
);

router.post(
  '/webhook/:provider?',
  asyncHandler(paymentController.handleWebhook.bind(paymentController))
);

export const paymentRoutes = router;
