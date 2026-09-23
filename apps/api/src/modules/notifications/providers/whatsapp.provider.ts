import { INotificationProvider, OrderNotificationPayload } from './notification.provider.interface';
import { logger } from '../../../config/logger';

export class WhatsAppNotificationProvider implements INotificationProvider {
  async sendOrderConfirmation(payload: OrderNotificationPayload): Promise<boolean> {
    logger.info(`[WHATSAPP NOTIFICATION] Message sent to ${payload.customerPhone}: Order ${payload.orderNumber} received.`);
    return true;
  }

  async sendOrderStatusUpdate(payload: OrderNotificationPayload): Promise<boolean> {
    logger.info(`[WHATSAPP NOTIFICATION] Message sent to ${payload.customerPhone}: Order ${payload.orderNumber} updated to ${payload.status}.`);
    return true;
  }
}
