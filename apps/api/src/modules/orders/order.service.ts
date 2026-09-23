import { orderRepository } from './order.repository';
import { cartService } from '../carts/cart.service';
import { inventoryService } from '../inventory/inventory.service';
import { notificationService } from '../notifications/notification.service';
import { generateOrderNumber } from '../../shared/utils/orderNumber';
import { CreateOrderInput, OrderStatus, PaymentStatus } from '@customry/contracts';
import { NotFoundError, ValidationError } from '../../shared/errors';

const VALID_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: ['PAYMENT_PROCESSING', 'PAID', 'PAYMENT_FAILED', 'CANCELLED'],
  PAYMENT_PROCESSING: ['PAID', 'PAYMENT_FAILED', 'CANCELLED'],
  PAID: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['READY_FOR_DELIVERY', 'CANCELLED'],
  READY_FOR_DELIVERY: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
  PAYMENT_FAILED: ['PENDING_PAYMENT', 'CANCELLED'],
};

export class OrderService {
  async createOrder(input: CreateOrderInput) {
    const { validatedItems, subtotal } =
      await cartService.validateAndCalculateCartItems(input.items);

    const deliveryFee = subtotal >= 100000 ? 0 : 2500;
    const total = subtotal + deliveryFee;

    await inventoryService.verifyAndReserveStock(input.items);

    const orderNumber = generateOrderNumber();

    const order = await orderRepository.create({
      orderNumber,
      customer: input.customer,
      items: validatedItems,
      subtotal,
      deliveryFee,
      discount: 0,
      total,
      currency: 'NGN',
      status: 'PENDING_PAYMENT',
      paymentStatus: 'UNPAID',
      paymentMethod: input.paymentMethod,
      orderNotes: input.orderNotes,
    });

    const itemsSummary = validatedItems
      .map((i) => `${i.quantity}x ${i.productName}`)
      .join(', ');

    await notificationService.notifyOrderCreated({
      orderNumber: order.orderNumber,
      customerName: order.customer.fullName,
      customerPhone: order.customer.phone,
      customerEmail: order.customer.email,
      total: order.total,
      status: order.status,
      itemsSummary,
    });

    return order;
  }

  async getOrderById(id: string) {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    return order;
  }

  async getOrderByNumber(orderNumber: string) {
    const order = await orderRepository.findByOrderNumber(orderNumber);
    if (!order) {
      throw new NotFoundError('Order not found');
    }
    return order;
  }

  async getOrders(query: any) {
    return orderRepository.findMany(query);
  }

  async updateOrderStatus(id: string, newStatus: OrderStatus) {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    const allowedTransitions = VALID_STATUS_TRANSITIONS[order.status] || [];
    if (!allowedTransitions.includes(newStatus)) {
      throw new ValidationError(
        `Cannot transition order status from '${order.status}' to '${newStatus}'. Allowed transitions: ${allowedTransitions.join(', ') || 'None'}`
      );
    }

    let paymentStatus: PaymentStatus = order.paymentStatus;
    if (newStatus === 'PAID') {
      paymentStatus = 'PAID';
      await inventoryService.decrementStock(order.items);
    } else if (newStatus === 'CANCELLED' && order.status === 'PAID') {
      for (const item of order.items) {
        await inventoryService.adjustInventory({
          productId: item.productId,
          variantId: item.variantId,
          quantityDelta: item.quantity,
          reason: `Order ${order.orderNumber} cancelled`,
        });
      }
    }

    const updatedOrder = await orderRepository.updateStatus(id, newStatus, paymentStatus);

    if (updatedOrder) {
      const itemsSummary = updatedOrder.items
        .map((i) => `${i.quantity}x ${i.productName}`)
        .join(', ');

      await notificationService.notifyOrderStatusUpdated({
        orderNumber: updatedOrder.orderNumber,
        customerName: updatedOrder.customer.fullName,
        customerPhone: updatedOrder.customer.phone,
        customerEmail: updatedOrder.customer.email,
        total: updatedOrder.total,
        status: updatedOrder.status,
        itemsSummary,
      });
    }

    return updatedOrder;
  }
}

export const orderService = new OrderService();
