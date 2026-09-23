import { OrderModel } from '../orders/order.model';

export class CustomerService {
  async getCustomers(query: { page?: number; limit?: number; search?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;

    const pipeline: any[] = [
      {
        $group: {
          _id: '$customer.phone',
          fullName: { $first: '$customer.fullName' },
          phone: { $first: '$customer.phone' },
          email: { $first: '$customer.email' },
          deliveryAddress: { $last: '$customer.deliveryAddress' },
          totalOrders: { $sum: 1 },
          totalSpent: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'PAID'] }, '$total', 0],
            },
          },
          lastOrderAt: { $max: '$createdAt' },
        },
      },
      { $sort: { lastOrderAt: -1 } },
    ];

    if (query.search) {
      pipeline.push({
        $match: {
          $or: [
            { fullName: { $regex: query.search, $options: 'i' } },
            { phone: { $regex: query.search, $options: 'i' } },
            { email: { $regex: query.search, $options: 'i' } },
          ],
        },
      });
    }

    const allCustomers = await OrderModel.aggregate(pipeline);
    const total = allCustomers.length;
    const paginated = allCustomers.slice((page - 1) * limit, page * limit);

    return {
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}

export const customerService = new CustomerService();
