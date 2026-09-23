import { UserModel, IUserDocument } from './auth.model';
import { UserRole } from '@customry/contracts';

export class AuthRepository {
  async findByEmail(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id);
  }

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
    phone?: string;
  }): Promise<IUserDocument> {
    return UserModel.create({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      role: data.role || 'CUSTOMER',
      phone: data.phone,
    });
  }

  async updateRefreshToken(id: string, refreshTokenHash: string | null): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { refreshTokenHash });
  }
}

export const authRepository = new AuthRepository();
