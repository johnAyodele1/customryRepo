import { z } from 'zod';
import { CategoryCodeSchema } from '../categories';

export const CustomizationTypeSchema = z.enum([
  'TEXT',
  'TEXTAREA',
  'SELECT',
  'COLOR',
  'OPTION',
  'NUMBER',
]);

export type CustomizationType = z.infer<typeof CustomizationTypeSchema>;

export const CustomizationFieldSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  type: CustomizationTypeSchema,
  required: z.boolean().default(false),
  maxLength: z.number().int().positive().optional(),
  options: z.array(z.string()).optional(),
  defaultValue: z.string().optional(),
});

export type CustomizationField = z.infer<typeof CustomizationFieldSchema>;

export const VariantSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  sku: z.string().min(1),
  price: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative().default(0),
  images: z.array(z.string()).default([]),
  options: z.record(z.string()).default({}),
  isActive: z.boolean().default(true),
});

export type Variant = z.infer<typeof VariantSchema>;

export const ProductStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);
export type ProductStatus = z.infer<typeof ProductStatusSchema>;

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  categoryCode: CategoryCodeSchema,
  description: z.string().default(''),
  status: ProductStatusSchema.default('DRAFT'),
  basePrice: z.number().nonnegative(),
  currency: z.string().default('NGN'),
  images: z.array(z.string()).default([]),
  variants: z.array(VariantSchema).default([]),
  customizationFields: z.array(CustomizationFieldSchema).default([]),
  minQuantity: z.number().int().min(1).default(1),
  maxQuantity: z.number().int().min(1).default(100),
  stock: z.number().int().nonnegative().default(0),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
});

export type Product = z.infer<typeof ProductSchema>;

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Product slug is required'),
  categoryCode: CategoryCodeSchema,
  description: z.string().default(''),
  status: ProductStatusSchema.default('DRAFT'),
  basePrice: z.number().nonnegative('Base price must be a non-negative number'),
  currency: z.string().default('NGN'),
  images: z.array(z.string()).default([]),
  variants: z.array(VariantSchema.omit({ id: true })).default([]),
  customizationFields: z.array(CustomizationFieldSchema).default([]),
  minQuantity: z.number().int().min(1).default(1),
  maxQuantity: z.number().int().min(1).default(100),
  stock: z.number().int().nonnegative().default(0),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = CreateProductSchema.partial();
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

export const ProductQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  categoryCode: CategoryCodeSchema.optional(),
  status: ProductStatusSchema.optional(),
  stockStatus: z.enum(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK']).optional(),
  sort: z.string().optional(),
});

export type ProductQueryInput = z.infer<typeof ProductQuerySchema>;
