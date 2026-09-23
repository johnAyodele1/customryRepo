import { authRepository } from './auth.repository';
import { hashPassword, comparePassword } from '../../shared/utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../shared/utils/jwt';
import { AuthenticationError, ConflictError, NotFoundError } from '../../shared/errors';
import { LoginInput, RegisterInput, AuthResponse, AuthUser } from '@customry/contracts';

export class AuthService {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('User with this email already exists');
    }

    const passwordHash = await hashPassword(input.password);
    const user = await authRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role || 'CUSTOMER',
      phone: input.phone,
    });

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const refreshTokenHash = await hashPassword(refreshToken);
    await authRepository.updateRefreshToken(user.id, refreshTokenHash);

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    return { user: authUser, accessToken, refreshToken };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await authRepository.findByEmail(input.email);
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    const isMatch = await comparePassword(input.password, user.passwordHash);
    if (!isMatch) {
      throw new AuthenticationError('Invalid email or password');
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const refreshTokenHash = await hashPassword(refreshToken);
    await authRepository.updateRefreshToken(user.id, refreshTokenHash);

    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    return { user: authUser, accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await authRepository.findById(payload.userId);

      if (!user || !user.refreshTokenHash) {
        throw new AuthenticationError('Invalid refresh token');
      }

      const isMatch = await comparePassword(refreshToken, user.refreshTokenHash);
      if (!isMatch) {
        throw new AuthenticationError('Invalid refresh token');
      }

      const newPayload = { userId: user.id, email: user.email, role: user.role };
      const newAccessToken = signAccessToken(newPayload);
      const newRefreshToken = signRefreshToken(newPayload);

      const newRefreshTokenHash = await hashPassword(newRefreshToken);
      await authRepository.updateRefreshToken(user.id, newRefreshTokenHash);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch {
      throw new AuthenticationError('Invalid or expired refresh token');
    }
  }

  async getCurrentUser(userId: string): Promise<AuthUser> {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };
  }
}

export const authService = new AuthService();
