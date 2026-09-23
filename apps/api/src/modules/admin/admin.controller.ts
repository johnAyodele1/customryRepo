import { Request, Response } from 'express';
import { adminService } from './admin.service';
import { sendSuccess } from '../../shared/http/response';

export class AdminController {
  async getDashboardStats(_req: Request, res: Response) {
    const stats = await adminService.getDashboardStats();
    return sendSuccess(res, stats);
  }
}

export const adminController = new AdminController();
