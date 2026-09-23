import { z } from 'zod';

export const CategoryCodeSchema = z.enum([
  'JEWELRY_ACCESSORIES',
  'JOURNALS_BOOKS',
  'WATER_BOTTLES',
  'GIFT_BOXES',
  'WRISTWATCHES',
]);

export type CategoryCode = z.infer<typeof CategoryCodeSchema>;

export const CategorySchema = z.object({
  id: z.string(),
  code: CategoryCodeSchema,
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
});

export type Category = z.infer<typeof CategorySchema>;

export const CreateCategorySchema = z.object({
  code: CategoryCodeSchema,
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = CreateCategorySchema.partial();
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
