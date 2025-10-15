import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../lib/jwt.js'
import { createError } from './errorHandler.js'

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
    email: string
  }
}

/**
 * Authentication middleware
 * Verifies JWT access token from Authorization header
 */
export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  try {
    const decoded = verifyToken(token, 'access')
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    }
    next()
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}
