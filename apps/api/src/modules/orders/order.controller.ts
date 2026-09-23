import { Request, Response } from 'express';
import { orderService } from './order.service';
import { sendSuccess } from '../../shared/http/response';

export class OrderController {
  async createOrder(req: Request, res: Response) {
    const order = await orderService.createOrder(req.body);
    return sendSuccess(res, order, 201);
  }

  async getOrderById(req: Request, res: Response) {
    const order = await orderService.getOrderById(req.params.id);
    return sendSuccess(res, order);
  }

  async getOrderByNumber(req: Request, res: Response) {
    const order = await orderService.getOrderByNumber(req.params.orderNumber);
    return sendSuccess(res, order);
  }

  async getOrders(req: Request, res: Response) {
    const result = await orderService.getOrders(req.query);
    return sendSuccess(res, result.data, 200, result.pagination);
  }

  async updateOrderStatus(req: Request, res: Response) {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    return sendSuccess(res, order);
  }
}

export const orderController = new OrderController();
