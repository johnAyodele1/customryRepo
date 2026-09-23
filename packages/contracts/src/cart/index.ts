import { z } from 'zod';

export const CustomizationValueSchema = z.record(z.string(), z.string());
export type CustomizationValues = z.infer<typeof CustomizationValueSchema>;

export const CartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  selectedOptions: z.record(z.string(), z.string()).optional(),
  customization: CustomizationValueSchema.default({}),
  quantity: z.number().int().min(1),
});

export type CartItem = z.infer<typeof CartItemSchema>;

export const AddToCartSchema = CartItemSchema;
export type AddToCartInput = z.infer<typeof AddToCartSchema>;

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(1),
  customization: CustomizationValueSchema.optional(),
});

export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>;
