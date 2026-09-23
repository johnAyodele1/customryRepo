import { z } from 'zod';

export const DashboardStatsSchema = z.object({
  totalOrders: z.number().int().nonnegative(),
  pendingOrders: z.number().int().nonnegative(),
  confirmedOrders: z.number().int().nonnegative(),
  processingOrders: z.number().int().nonnegative(),
  completedOrders: z.number().int().nonnegative(),
  cancelledOrders: z.number().int().nonnegative(),
  totalRevenue: z.number().nonnegative(),
  totalProducts: z.number().int().nonnegative(),
  lowStockProducts: z.number().int().nonnegative(),
  recentOrders: z.array(z.record(z.unknown())),
  recentCustomers: z.array(z.record(z.unknown())),
});

export type DashboardStats = z.infer<typeof DashboardStatsSchema>;

export const AdjustInventorySchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  quantityDelta: z.number().int(),
  reason: z.string().min(1, 'Reason for inventory adjustment is required'),
});

export type AdjustInventoryInput = z.infer<typeof AdjustInventorySchema>;

export const AuditLogSchema = z.object({
  id: z.string(),
  actorId: z.string(),
  actorName: z.string(),
  action: z.string(),
  resource: z.string(),
  resourceId: z.string(),
  before: z.record(z.unknown()).optional(),
  after: z.record(z.unknown()).optional(),
  timestamp: z.string().or(z.date()),
});

export type AuditLog = z.infer<typeof AuditLogSchema>;
