import { Schema, model, Document } from 'mongoose';
import { OrderStatus, PaymentStatus } from '@customry/contracts';

export interface IOrderItemSnapshot {
  productId: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  selectedOptions?: Record<string, string>;
  customization: Record<string, string>;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface ICustomerInfo {
  fullName: string;
  phone: string;
  email?: string;
  deliveryAddress: string;
}

export interface IOrderDocument extends Document {
  orderNumber: string;
  customer: ICustomerInfo;
  items: IOrderItemSnapshot[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  paymentReference?: string;
  orderNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const customerInfoSchema = new Schema<ICustomerInfo>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  deliveryAddress: { type: String, required: true },
});

const orderItemSnapshotSchema = new Schema<IOrderItemSnapshot>({
  productId: { type: String, required: true },
  variantId: { type: String },
  productName: { type: String, required: true },
  variantName: { type: String },
  selectedOptions: { type: Map, of: String },
  customization: { type: Map, of: String, default: {} },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  imageUrl: { type: String },
});

const orderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: { type: customerInfoSchema, required: true },
    items: [orderItemSnapshotSchema],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: 'NGN' },
    status: {
      type: String,
      enum: [
        'PENDING_PAYMENT',
        'PAYMENT_PROCESSING',
        'PAID',
        'CONFIRMED',
        'PROCESSING',
        'READY_FOR_DELIVERY',
        'COMPLETED',
        'CANCELLED',
        'PAYMENT_FAILED',
      ],
      default: 'PENDING_PAYMENT',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['UNPAID', 'PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'UNPAID',
      index: true,
    },
    paymentMethod: { type: String, required: true },
    paymentReference: { type: String, index: true },
    orderNotes: { type: String },
  },
  { timestamps: true }
);

export const OrderModel = model<IOrderDocument>('Order', orderSchema);
