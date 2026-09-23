import {
  IPaymentProvider,
  CreatePaymentParams,
  PaymentIntentResult,
  VerifyPaymentResult,
} from './payment.provider.interface';

export class BankTransferPaymentProvider implements IPaymentProvider {
  async createPayment(params: CreatePaymentParams): Promise<PaymentIntentResult> {
    const reference = `bt_${Date.now()}_${params.orderNumber}`;
    return {
      paymentReference: reference,
      authorizationUrl: '',
      provider: 'BANK_TRANSFER',
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

  verifyWebhookSignature(_payload: string, _signature: string): boolean {
    return true;
  }
}
