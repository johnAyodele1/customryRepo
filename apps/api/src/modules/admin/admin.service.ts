import { OrderModel } from '../orders/order.model';
import { ProductModel } from '../products/product.model';
import { DashboardStats } from '@customry/contracts';

export class AdminService {
  async getDashboardStats(): Promise<DashboardStats> {
    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      completedOrders,
      cancelledOrders,
      totalProducts,
      lowStockProducts,
      recentOrders,
      revenueResult,
    ] = await Promise.all([
      OrderModel.countDocuments(),
      OrderModel.countDocuments({ status: 'PENDING_PAYMENT' }),
      OrderModel.countDocuments({ status: 'CONFIRMED' }),
      OrderModel.countDocuments({ status: 'PROCESSING' }),
      OrderModel.countDocuments({ status: 'COMPLETED' }),
      OrderModel.countDocuments({ status: 'CANCELLED' }),
      ProductModel.countDocuments({ status: { $ne: 'ARCHIVED' } }),
      ProductModel.countDocuments({ stock: { $lte: 5 }, status: { $ne: 'ARCHIVED' } }),
      OrderModel.find().sort({ createdAt: -1 }).limit(5).lean(),
      OrderModel.aggregate([
        { $match: { paymentStatus: 'PAID' } },
        { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
      ]),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    const recentCustomers = recentOrders.map((o: any) => ({
      name: o.customer.fullName,
      phone: o.customer.phone,
      email: o.customer.email,
      orderNumber: o.orderNumber,
      total: o.total,
      createdAt: o.createdAt,
    }));

    return {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      totalProducts,
      lowStockProducts,
      recentOrders: recentOrders as any,
      recentCustomers: recentCustomers as any,
    };
  }
}

export const adminService = new AdminService();
