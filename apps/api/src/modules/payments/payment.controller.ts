import { Request, Response } from 'express';
import { paymentService } from './payment.service';
import { sendSuccess } from '../../shared/http/response';
import { PaymentProviderType } from '@customry/contracts';

export class PaymentController {
  async createPaymentIntent(req: Request, res: Response) {
    const { orderId, provider } = req.body;
    const intent = await paymentService.createPaymentIntent(orderId, provider);
    return sendSuccess(res, intent, 201);
  }

  async handleWebhook(req: Request, res: Response) {
    const provider = (req.params.provider?.toUpperCase() || 'PAYSTACK') as PaymentProviderType;
    const signature = (req.headers['x-paystack-signature'] ||
      req.headers['verif-hash'] ||
      '') as string;

    const result = await paymentService.processWebhook(provider, req.body, signature);
    return sendSuccess(res, result, 200);
  }
}

export const paymentController = new PaymentController();
