import crypto from 'crypto';
import {
  IPaymentProvider,
  CreatePaymentParams,
  PaymentIntentResult,
  VerifyPaymentResult,
} from './payment.provider.interface';
import { env } from '../../../config/env';

export class PaystackPaymentProvider implements IPaymentProvider {
  async createPayment(params: CreatePaymentParams): Promise<PaymentIntentResult> {
    const reference = `pst_${Date.now()}_${params.orderNumber}`;
    return {
      paymentReference: reference,
      authorizationUrl: `https://checkout.paystack.com/mock/${reference}`,
      provider: 'PAYSTACK',
      amount: params.amount,
      currency: params.currency,
    };
  }

  async verifyPayment(reference: string): Promise<VerifyPaymentResult> {
    return {
      success: true,
      orderNumber: reference.split('_').pop() || '',
      paymentReference: reference,
      amount: 0,
      status: 'PAID',
    };
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!signature) return false;
    if (env.NODE_ENV === 'test' || env.PAYSTACK_SECRET_KEY.startsWith('sk_test_mock')) {
      return true;
    }
    const hash = crypto
      .createHmac('sha512', env.PAYSTACK_SECRET_KEY)
      .update(payload)
      .digest('hex');
    return hash === signature;
  }
}
