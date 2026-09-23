import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().optional().default(''),
  JWT_ACCESS_SECRET: z.string().default('customry_access_secret_key_change_in_production_123!'),
  JWT_REFRESH_SECRET: z.string().default('customry_refresh_secret_key_change_in_production_456!'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  PAYMENT_PROVIDER: z.enum(['PAYSTACK', 'FLUTTERWAVE', 'BANK_TRANSFER']).default('PAYSTACK'),
  PAYSTACK_SECRET_KEY: z.string().default('sk_test_mock_paystack_secret_key'),
  FLUTTERWAVE_SECRET_KEY: z.string().default('FLWSECK_TEST_mock_flutterwave_secret_key'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
});

export const env = EnvSchema.parse(process.env);
