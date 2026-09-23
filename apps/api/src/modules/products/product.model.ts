import { Schema, model, Document } from 'mongoose';
import {
  CategoryCode,
  ProductStatus,
  CustomizationType,
} from '@customry/contracts';

export interface IVariantDocument {
  id: string;
  name: string;
  sku: string;
  price?: number;
  stock: number;
  images: string[];
  options: Record<string, string>;
  isActive: boolean;
}

export interface ICustomizationFieldDocument {
  key: string;
  label: string;
  type: CustomizationType;
  required: boolean;
  maxLength?: number;
  options?: string[];
  defaultValue?: string;
}

export interface IProductDocument extends Document {
  name: string;
  slug: string;
  categoryCode: CategoryCode;
  description: string;
  status: ProductStatus;
  basePrice: number;
  currency: string;
  images: string[];
  variants: IVariantDocument[];
  customizationFields: ICustomizationFieldDocument[];
  minQuantity: number;
  maxQuantity: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const variantSchema = new Schema<IVariantDocument>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  price: { type: Number },
  stock: { type: Number, required: true, default: 0, min: 0 },
  images: [{ type: String }],
  options: { type: Map, of: String, default: {} },
  isActive: { type: Boolean, default: true },
});

const customizationFieldSchema = new Schema<ICustomizationFieldDocument>({
  key: { type: String, required: true },
  label: { type: String, required: true },
  type: {
    type: String,
    enum: ['TEXT', 'TEXTAREA', 'SELECT', 'COLOR', 'OPTION', 'NUMBER'],
    required: true,
  },
  required: { type: Boolean, default: false },
  maxLength: { type: Number },
  options: [{ type: String }],
  defaultValue: { type: String },
});

const productSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    categoryCode: {
      type: String,
      enum: [
        'JEWELRY_ACCESSORIES',
        'JOURNALS_BOOKS',
        'WATER_BOTTLES',
        'GIFT_BOXES',
        'WRISTWATCHES',
      ],
      required: true,
      index: true,
    },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
      index: true,
    },
    basePrice: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'NGN' },
    images: [{ type: String }],
    variants: [variantSchema],
    customizationFields: [customizationFieldSchema],
    minQuantity: { type: Number, default: 1, min: 1 },
    maxQuantity: { type: Number, default: 100, min: 1 },
    stock: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export const ProductModel = model<IProductDocument>('Product', productSchema);
