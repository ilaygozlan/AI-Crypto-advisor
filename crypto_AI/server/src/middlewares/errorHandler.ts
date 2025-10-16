import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';
import { env } from '../utils/env';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError | ZodError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    logger.warn('Validation error:', {
      errors: error.errors,
      path: req.path,
      method: req.method,
    });
  } else if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  } else {
    logger.error('Unhandled error:', {
      error: error.message,
      stack: error.stack,
      path: req.path,
      method: req.method,
    });
  }

  const response: any = {
    error: message,
    statusCode,
  };

  if (env.NODE_ENV === 'development') {
    response.stack = error.stack;
    if (error instanceof ZodError) {
      response.details = error.errors;
    }
  }

  res.status(statusCode).json(response);
};
