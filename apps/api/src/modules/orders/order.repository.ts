import { OrderModel, IOrderDocument } from './order.model';
import { OrderQueryInput, OrderStatus, PaymentStatus } from '@customry/contracts';

export class OrderRepository {
  async findById(id: string): Promise<IOrderDocument | null> {
    return OrderModel.findById(id);
  }

  async findByOrderNumber(orderNumber: string): Promise<IOrderDocument | null> {
    return OrderModel.findOne({ orderNumber });
  }

  async findByPaymentReference(paymentReference: string): Promise<IOrderDocument | null> {
    return OrderModel.findOne({ paymentReference });
  }

  async findMany(query: OrderQueryInput) {
    const { page, limit, status, paymentStatus, search, dateFrom, dateTo } = query;
    const filter: Record<string, unknown> = {};

    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.fullName': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
      ];
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) (filter.createdAt as any).$gte = new Date(dateFrom);
      if (dateTo) (filter.createdAt as any).$lte = new Date(dateTo);
    }

    const total = await OrderModel.countDocuments(filter);
    const data = await OrderModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async create(data: Partial<IOrderDocument>): Promise<IOrderDocument> {
    return OrderModel.create(data);
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    paymentStatus?: PaymentStatus,
    paymentReference?: string
  ): Promise<IOrderDocument | null> {
    const update: Record<string, unknown> = { status };
    if (paymentStatus) update.paymentStatus = paymentStatus;
    if (paymentReference) update.paymentReference = paymentReference;

    return OrderModel.findByIdAndUpdate(id, update, { new: true });
  }
}

export const orderRepository = new OrderRepository();
