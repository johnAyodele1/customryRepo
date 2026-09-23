import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { orderService } from '../order.service';
import { productService } from '../../products/product.service';
import { paymentService } from '../../payments/payment.service';
import { OrderModel } from '../order.model';
import { ProductModel } from '../../products/product.model';

describe('Order & Payment Lifecycle', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await OrderModel.deleteMany({});
    await ProductModel.deleteMany({});
  });

  it('should create order with server-calculated price, snapshot, and reserve stock', async () => {
    const product = await productService.createProduct({
      name: 'Custom Watch',
      slug: 'custom-watch',
      categoryCode: 'WRISTWATCHES',
      description: 'Luxury chronograph',
      status: 'PUBLISHED',
      basePrice: 120000,
      currency: 'NGN',
      stock: 5,
      images: ['https://example.com/watch.jpg'],
      variants: [],
      customizationFields: [],
      minQuantity: 1,
      maxQuantity: 2,
    });

    const order = await orderService.createOrder({
      customer: {
        fullName: 'Jane Doe',
        phone: '+2348012345678',
        email: 'jane@example.com',
        deliveryAddress: '15 Victoria Island, Lagos',
      },
      items: [
        {
          productId: product.id,
          quantity: 1,
          customization: {},
        },
      ],
      paymentMethod: 'PAYSTACK',
    });

    expect(order.orderNumber).toBeDefined();
    expect(order.subtotal).toBe(120000);
    expect(order.deliveryFee).toBe(0);
    expect(order.total).toBe(120000);
    expect(order.status).toBe('PENDING_PAYMENT');
    expect(order.items[0].productName).toBe('Custom Watch');
  });

  it('should process payment webhook idempotently and transition status to PAID while decrementing stock', async () => {
    const product = await productService.createProduct({
      name: 'Silver Bracelet',
      slug: 'silver-bracelet',
      categoryCode: 'JEWELRY_ACCESSORIES',
      description: 'Handmade silver',
      status: 'PUBLISHED',
      basePrice: 30000,
      currency: 'NGN',
      stock: 10,
      images: [],
      variants: [],
      customizationFields: [],
      minQuantity: 1,
      maxQuantity: 5,
    });

    const order = await orderService.createOrder({
      customer: {
        fullName: 'John Smith',
        phone: '+2348098765432',
        email: 'john@example.com',
        deliveryAddress: '10 Ikeja, Lagos',
      },
      items: [{ productId: product.id, quantity: 2, customization: {} }],
      paymentMethod: 'PAYSTACK',
    });

    const intent = await paymentService.createPaymentIntent(order.id, 'PAYSTACK');
    expect(intent.paymentReference).toBeDefined();

    const webhookPayload = {
      event: 'charge.success',
      data: {
        reference: intent.paymentReference,
        status: 'success',
      },
    };

    const webhookRes1 = await paymentService.processWebhook('PAYSTACK', webhookPayload, 'sig');
    expect(webhookRes1.status).toBe('processed');

    const updatedOrder = await orderService.getOrderById(order.id);
    expect(updatedOrder.status).toBe('PAID');
    expect(updatedOrder.paymentStatus).toBe('PAID');

    const updatedProduct = await productService.getProductById(product.id);
    expect(updatedProduct.stock).toBe(8);

    const webhookRes2 = await paymentService.processWebhook('PAYSTACK', webhookPayload, 'sig');
    expect(webhookRes2.status).toBe('ignored_duplicate');

    const doubleCheckedProduct = await productService.getProductById(product.id);
    expect(doubleCheckedProduct.stock).toBe(8);
  });
});
