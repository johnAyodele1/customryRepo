import { Request, Response } from 'express';
import { customerService } from './customer.service';
import { sendSuccess } from '../../shared/http/response';

export class CustomerController {
  async getCustomers(req: Request, res: Response) {
    const result = await customerService.getCustomers(req.query as any);
    return sendSuccess(res, result.data, 200, result.pagination);
  }
}

export const customerController = new CustomerController();
