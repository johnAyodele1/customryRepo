import { EmailNotificationProvider } from './providers/email.provider';
import { WhatsAppNotificationProvider } from './providers/whatsapp.provider';
import { OrderNotificationPayload } from './providers/notification.provider.interface';

export class NotificationService {
  private emailProvider = new EmailNotificationProvider();
  private whatsAppProvider = new WhatsAppNotificationProvider();

  async notifyOrderCreated(payload: OrderNotificationPayload): Promise<void> {
    await Promise.allSettled([
      this.emailProvider.sendOrderConfirmation(payload),
      this.whatsAppProvider.sendOrderConfirmation(payload),
    ]);
  }

  async notifyOrderStatusUpdated(payload: OrderNotificationPayload): Promise<void> {
    await Promise.allSettled([
      this.emailProvider.sendOrderStatusUpdate(payload),
      this.whatsAppProvider.sendOrderStatusUpdate(payload),
    ]);
  }
}

export const notificationService = new NotificationService();
