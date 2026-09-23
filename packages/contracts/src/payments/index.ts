import { z } from 'zod';

export const PaymentProviderEnum = z.enum(['PAYSTACK', 'FLUTTERWAVE', 'BANK_TRANSFER']);
export type PaymentProviderType = z.infer<typeof PaymentProviderEnum>;

export const CreatePaymentIntentSchema = z.object({
  orderId: z.string().min(1),
  provider: PaymentProviderEnum.default('PAYSTACK'),
});

export type CreatePaymentIntentInput = z.infer<typeof CreatePaymentIntentSchema>;

export const PaymentIntentResponseSchema = z.object({
  paymentReference: z.string(),
  authorizationUrl: z.string().optional(),
  provider: PaymentProviderEnum,
  amount: z.number(),
  currency: z.string(),
});

export type PaymentIntentResponse = z.infer<typeof PaymentIntentResponseSchema>;

export const WebhookEventSchema = z.object({
  event: z.string(),
  data: z.record(z.unknown()),
});

export type WebhookEventPayload = z.infer<typeof WebhookEventSchema>;

export const VerifyPaymentSchema = z.object({
  reference: z.string().min(1),
  provider: PaymentProviderEnum.default('PAYSTACK'),
});

export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;
