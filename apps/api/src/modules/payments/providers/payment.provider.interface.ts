export interface CreatePaymentParams {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  customerEmail?: string;
  customerName: string;
  customerPhone: string;
}

export interface PaymentIntentResult {
  paymentReference: string;
  authorizationUrl?: string;
  provider: 'PAYSTACK' | 'FLUTTERWAVE' | 'BANK_TRANSFER';
  amount: number;
  currency: string;
}

export interface VerifyPaymentResult {
  success: boolean;
  orderNumber: string;
  paymentReference: string;
  amount: number;
  status: 'PAID' | 'FAILED' | 'PENDING';
}

export interface IPaymentProvider {
  createPayment(params: CreatePaymentParams): Promise<PaymentIntentResult>;
  verifyPayment(reference: string): Promise<VerifyPaymentResult>;
  verifyWebhookSignature(payload: string, signature: string): boolean;
}
