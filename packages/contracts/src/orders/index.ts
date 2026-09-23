import { z } from 'zod';

export const OrderStatusSchema = z.enum([
  'PENDING_PAYMENT',
  'PAYMENT_PROCESSING',
  'PAID',
  'CONFIRMED',
  'PROCESSING',
  'READY_FOR_DELIVERY',
  'COMPLETED',
  'CANCELLED',
  'PAYMENT_FAILED',
]);

export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const PaymentStatusSchema = z.enum([
  'UNPAID',
  'PENDING',
  'PAID',
  'FAILED',
  'REFUNDED',
]);

export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

export const CustomerInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(5, 'Valid WhatsApp or phone number is required'),
  email: z.string().email().optional().or(z.literal('')),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
});

export type CustomerInfo = z.infer<typeof CustomerInfoSchema>;

export const OrderItemSnapshotSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  productName: z.string(),
  variantName: z.string().optional(),
  selectedOptions: z.record(z.string()).optional(),
  customization: z.record(z.string()).default({}),
  unitPrice: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  totalPrice: z.number().nonnegative(),
  imageUrl: z.string().optional(),
});

export type OrderItemSnapshot = z.infer<typeof OrderItemSnapshotSchema>;

export const CreateOrderSchema = z.object({
  customer: CustomerInfoSchema,
  items: z.array(
    z.object({
      productId: z.string().min(1),
      variantId: z.string().optional(),
      quantity: z.number().int().min(1),
      customization: z.record(z.string()).default({}),
    })
  ).min(1, 'Order must contain at least one item'),
  paymentMethod: z.enum(['PAYSTACK', 'FLUTTERWAVE', 'BANK_TRANSFER']).default('PAYSTACK'),
  orderNotes: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

export const OrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  customer: CustomerInfoSchema,
  items: z.array(OrderItemSnapshotSchema),
  subtotal: z.number().nonnegative(),
  deliveryFee: z.number().nonnegative().default(0),
  discount: z.number().nonnegative().default(0),
  total: z.number().nonnegative(),
  currency: z.string().default('NGN'),
  status: OrderStatusSchema,
  paymentStatus: PaymentStatusSchema,
  paymentMethod: z.string(),
  paymentReference: z.string().optional(),
  orderNotes: z.string().optional(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export type Order = z.infer<typeof OrderSchema>;

export const UpdateOrderStatusSchema = z.object({
  status: OrderStatusSchema,
  note: z.string().optional(),
});

export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;

export const OrderQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: OrderStatusSchema.optional(),
  paymentStatus: PaymentStatusSchema.optional(),
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export type OrderQueryInput = z.infer<typeof OrderQuerySchema>;
