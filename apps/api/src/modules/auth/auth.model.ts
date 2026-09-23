import { Schema, model, Document } from 'mongoose';
import { UserRole } from '@customry/contracts';

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string;
  refreshTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['ADMIN', 'STAFF', 'CUSTOMER'],
      default: 'CUSTOMER',
      required: true,
    },
    phone: { type: String, trim: true },
    refreshTokenHash: { type: String },
  },
  { timestamps: true }
);

export const UserModel = model<IUserDocument>('User', userSchema);
