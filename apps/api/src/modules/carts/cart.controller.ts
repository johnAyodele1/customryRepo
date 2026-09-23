import { Request, Response } from 'express';
import { cartService } from './cart.service';
import { sendSuccess } from '../../shared/http/response';

export class CartController {
  async validateCart(req: Request, res: Response) {
    const { items } = req.body;
    const result = await cartService.validateAndCalculateCartItems(items);
    return sendSuccess(res, result);
  }
}

export const cartController = new CartController();
