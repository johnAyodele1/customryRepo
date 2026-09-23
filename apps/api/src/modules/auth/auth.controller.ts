import { Response } from 'express';
import { authService } from './auth.service';
import { sendSuccess } from '../../shared/http/response';
import { AuthenticatedRequest } from './auth.middleware';

export class AuthController {
  async register(req: AuthenticatedRequest, res: Response) {
    const result = await authService.register(req.body);
    return sendSuccess(res, result, 201);
  }

  async login(req: AuthenticatedRequest, res: Response) {
    const result = await authService.login(req.body);
    return sendSuccess(res, result, 200);
  }

  async refreshToken(req: AuthenticatedRequest, res: Response) {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    return sendSuccess(res, result, 200);
  }

  async getCurrentUser(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.userId;
    const user = await authService.getCurrentUser(userId);
    return sendSuccess(res, user, 200);
  }
}

export const authController = new AuthController();
