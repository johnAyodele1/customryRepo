import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { authService } from '../auth.service';
import { UserModel } from '../auth.model';

describe('AuthService', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await UserModel.deleteMany({});
  });

  it('should register a new user successfully', async () => {
    const res = await authService.register({
      name: 'Admin User',
      email: 'admin@customry.com',
      password: 'password123',
      role: 'ADMIN',
    });

    expect(res.user.email).toBe('admin@customry.com');
    expect(res.user.role).toBe('ADMIN');
    expect(res.accessToken).toBeDefined();
    expect(res.refreshToken).toBeDefined();
  });

  it('should fail registering duplicate email', async () => {
    await authService.register({
      name: 'Admin User',
      email: 'admin@customry.com',
      password: 'password123',
      role: 'ADMIN',
    });

    await expect(
      authService.register({
        name: 'Admin Duplicate',
        email: 'admin@customry.com',
        password: 'password123',
        role: 'ADMIN',
      })
    ).rejects.toThrow('User with this email already exists');
  });

  it('should login user with correct credentials', async () => {
    await authService.register({
      name: 'Test User',
      email: 'user@customry.com',
      password: 'password123',
      role: 'CUSTOMER',
    });

    const res = await authService.login({
      email: 'user@customry.com',
      password: 'password123',
    });

    expect(res.user.email).toBe('user@customry.com');
    expect(res.accessToken).toBeDefined();
  });

  it('should reject login with wrong password', async () => {
    await authService.register({
      name: 'Test User',
      email: 'user@customry.com',
      password: 'password123',
      role: 'CUSTOMER',
    });

    await expect(
      authService.login({
        email: 'user@customry.com',
        password: 'wrongpassword',
      })
    ).rejects.toThrow('Invalid email or password');
  });
});
