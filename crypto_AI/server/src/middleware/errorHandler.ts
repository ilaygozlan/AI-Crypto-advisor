import { Request, Response, NextFunction } from 'express'
import { logger } from '../lib/logger.js'

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = error.statusCode || 500
  const message = error.message || 'Internal Server Error'
  
  // Log error details
  logger.error('Request error', {
    error: message,
    statusCode,
    stack: error.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  })
  
  // Don't leak error details in production
  const response = {
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  }
  
  res.status(statusCode).json(response)
}

/**
 * Create an operational error
 */
export function createError(message: string, statusCode: number = 500): AppError {
  const error = new Error(message) as AppError
  error.statusCode = statusCode
  error.isOperational = true
  return error
}
