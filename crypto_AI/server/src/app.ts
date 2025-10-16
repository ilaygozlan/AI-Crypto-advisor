import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { router } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

export const createApp = (): express.Application => {
  const app = express();

  // Security middleware
  app.use(helmet());

  // Compression middleware
  app.use(compression());

  // CORS middleware
  app.use(cors(config.cors));

  // Body parsing middleware
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  // Logging middleware (development only)
  if (
    config.logging.level === 'debug' ||
    process.env['NODE_ENV'] === 'development'
  ) {
    app.use(morgan('dev'));
  }

  // Routes
  app.use('/', router);

  // Error handling middleware
  app.use(notFound);
  app.use(errorHandler);

  return app;
};
