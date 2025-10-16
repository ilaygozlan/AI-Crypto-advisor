import { env } from '../utils/env';

export const config = {
  cors: {
    origin: env.FRONTEND_URL,
    credentials: true,
  },
  server: {
    port: env.PORT,
    host: '0.0.0.0',
  },
  database: {
    url: env.DATABASE_URL,
    ssl:
      env.DATABASE_URL.includes('sslmode=require') ||
      env.NODE_ENV === 'production',
  },
  logging: {
    level: env.LOG_LEVEL,
  },
};
