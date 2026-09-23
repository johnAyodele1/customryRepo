import { Schema, model, Document } from 'mongoose';
import { CategoryCode } from '@customry/contracts';

export interface ICategoryDocument extends Document {
  code: CategoryCode;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategoryDocument>(
  {
    code: {
      type: String,
      enum: [
        'JEWELRY_ACCESSORIES',
        'JOURNALS_BOOKS',
        'WATER_BOTTLES',
        'GIFT_BOXES',
        'WRISTWATCHES',
      ],
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    imageUrl: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CategoryModel = model<ICategoryDocument>('Category', categorySchema);
