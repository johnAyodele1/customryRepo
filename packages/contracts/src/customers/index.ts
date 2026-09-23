import { z } from 'zod';

export const CustomerSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  phone: z.string(),
  email: z.string().optional(),
  deliveryAddresses: z.array(z.string()).default([]),
  totalOrders: z.number().int().default(0),
  totalSpent: z.number().default(0),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export type Customer = z.infer<typeof CustomerSchema>;

export const CustomerQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

export type CustomerQueryInput = z.infer<typeof CustomerQuerySchema>;
