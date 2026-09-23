import { INotificationProvider, OrderNotificationPayload } from './notification.provider.interface';
import { logger } from '../../../config/logger';

export class EmailNotificationProvider implements INotificationProvider {
  async sendOrderConfirmation(payload: OrderNotificationPayload): Promise<boolean> {
    logger.info(`[EMAIL NOTIFICATION] Order ${payload.orderNumber} created for ${payload.customerName}. Total: ₦${payload.total}`);
    return true;
  }

  async sendOrderStatusUpdate(payload: OrderNotificationPayload): Promise<boolean> {
    logger.info(`[EMAIL NOTIFICATION] Order ${payload.orderNumber} status updated to ${payload.status}`);
    return true;
  }
}
