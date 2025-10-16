import pino from 'pino';
import { env } from './env';

const isDevelopment = env.NODE_ENV === 'development';

export const logger = pino(
  isDevelopment
    ? {
        level: env.LOG_LEVEL,
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      }
    : {
        level: env.LOG_LEVEL,
      }
);
