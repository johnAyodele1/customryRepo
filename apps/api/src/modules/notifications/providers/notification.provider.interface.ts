export interface OrderNotificationPayload {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  total: number;
  status: string;
  itemsSummary: string;
}

export interface INotificationProvider {
  sendOrderConfirmation(payload: OrderNotificationPayload): Promise<boolean>;
  sendOrderStatusUpdate(payload: OrderNotificationPayload): Promise<boolean>;
}
