import { z } from 'zod';

export const UserRoleSchema = z.enum(['ADMIN', 'STAFF', 'CUSTOMER']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  phone: z.string().optional(),
  role: UserRoleSchema.default('CUSTOMER'),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, { message: 'Refresh token is required' }),
});

export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;

export const AuthUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: UserRoleSchema,
  phone: z.string().optional(),
});

export type AuthUser = z.infer<typeof AuthUserSchema>;

export const AuthResponseSchema = z.object({
  user: AuthUserSchema,
  accessToken: z.string(),
  refreshToken: z.string().optional(),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
