import { PaystackPaymentProvider } from './providers/paystack.provider';
import { FlutterwavePaymentProvider } from './providers/flutterwave.provider';
import { BankTransferPaymentProvider } from './providers/bank-transfer.provider';
import { IPaymentProvider } from './providers/payment.provider.interface';
import { orderService } from '../orders/order.service';
import { orderRepository } from '../orders/order.repository';
import { NotFoundError, ValidationError } from '../../shared/errors';
import { PaymentProviderType } from '@customry/contracts';

export class PaymentService {
  private providers: Record<PaymentProviderType, IPaymentProvider> = {
    PAYSTACK: new PaystackPaymentProvider(),
    FLUTTERWAVE: new FlutterwavePaymentProvider(),
    BANK_TRANSFER: new BankTransferPaymentProvider(),
  };

  private processedEvents = new Set<string>();

  getProvider(providerType: PaymentProviderType): IPaymentProvider {
    const provider = this.providers[providerType];
    if (!provider) {
      throw new ValidationError(`Unsupported payment provider '${providerType}'`);
    }
    return provider;
  }

  async createPaymentIntent(orderId: string, providerType: PaymentProviderType = 'PAYSTACK') {
    const order = await orderService.getOrderById(orderId);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    const provider = this.getProvider(providerType);
    const intent = await provider.createPayment(
      {
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: order.total,
        currency: order.currency,
        customerEmail: order.customer.email,
        customerName: order.customer.fullName,
        customerPhone: order.customer.phone,
      }
    );

    await orderRepository.updateStatus(
      order.id,
      order.status,
      order.paymentStatus,
      intent.paymentReference
    );

    return intent;
  }

  async processWebhook(
    providerType: PaymentProviderType,
    payload: any,
    signature: string
  ) {
    const provider = this.getProvider(providerType);
    const isSignatureValid = provider.verifyWebhookSignature(
      JSON.stringify(payload),
      signature
    );

    if (!isSignatureValid) {
      throw new ValidationError('Invalid webhook signature');
    }

    const eventId = payload.data?.reference || payload.data?.id || JSON.stringify(payload);
    if (this.processedEvents.has(eventId)) {
      return { status: 'ignored_duplicate', message: 'Event already processed' };
    }

    const paymentRef = payload.data?.reference || payload.reference;
    if (!paymentRef) {
      throw new ValidationError('Webhook payload missing payment reference');
    }

    const order = await orderRepository.findByPaymentReference(paymentRef);
    if (!order) {
      throw new NotFoundError(`Order with payment reference '${paymentRef}' not found`);
    }

    if (order.paymentStatus !== 'PAID') {
      await orderService.updateOrderStatus(order.id, 'PAID');
    }

    this.processedEvents.add(eventId);

    return { status: 'processed', orderId: order.id, orderNumber: order.orderNumber };
  }
}

export const paymentService = new PaymentService();
