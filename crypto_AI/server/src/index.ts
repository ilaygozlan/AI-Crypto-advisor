import { createServer } from 'http';
import { env } from './utils/env';
import { logger } from './utils/logger';
import { config } from './config';
import { pool } from './utils/db';
import { createApp } from './app';

const app = createApp();
const server = createServer(app);

const startServer = async (): Promise<void> => {
  try {
    // Test database connection
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    logger.info('Database connection established');

    // Start HTTP server
    server.listen(config.server.port, config.server.host, () => {
      logger.info({
        message: 'Server started',
        port: config.server.port,
        host: config.server.host,
        nodeEnv: env.NODE_ENV,
        version: process.env['npm_package_version'] || '1.0.0',
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`Received ${signal}, starting graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      await pool.end();
      logger.info('Database pool closed');
    } catch (error) {
      logger.error('Error closing database pool:', error);
    }

    logger.info('Graceful shutdown completed');
    process.exit(0);
  });

  // Force close after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on('SIGINT', () => {
  void gracefulShutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void gracefulShutdown('SIGTERM');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on(
  'unhandledRejection',
  (reason: unknown, promise: Promise<unknown>) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  }
);

// Start the server
void startServer();
