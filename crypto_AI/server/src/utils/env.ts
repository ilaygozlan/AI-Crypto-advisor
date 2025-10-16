import 'dotenv/config';          
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.string().trim().transform(val => val as 'development' | 'test' | 'production').default('development'),
  PORT: z.coerce.number().default(8080),
  FRONTEND_URL: z.string().trim().url().default('http://localhost:5173'),
  LOG_LEVEL: z
    .string()
    .trim()
    .transform(val => val as 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace')
    .default('info'),
  DATABASE_URL: z.string().trim().min(1, 'DATABASE_URL is required'),
  JWT_ACCESS_SECRET: z.string().trim().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().trim().min(1, 'JWT_REFRESH_SECRET is required'),
  JWT_ACCESS_TTL: z.string().trim().default('15m'),
  JWT_REFRESH_TTL: z.string().trim().default('7d'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),
});

export const env = EnvSchema.parse(process.env);
export type Env = z.infer<typeof EnvSchema>;
