import jwt from 'jsonwebtoken'
import { logger } from './logger.js'
import { env } from '../config/env.js'

const ACCESS_SECRET = env.JWT_ACCESS_SECRET
const REFRESH_SECRET = env.JWT_REFRESH_SECRET
const ACCESS_TTL = env.ACCESS_TOKEN_TTL
const REFRESH_TTL = env.REFRESH_TOKEN_TTL

export interface JWTPayload {
  userId: string
  email: string
  type: 'access' | 'refresh'
}

/**
 * Sign a JWT token with the specified payload
 */
export function signToken(payload: Omit<JWTPayload, 'type'>, type: 'access' | 'refresh'): string {
  const secret = type === 'access' ? ACCESS_SECRET : REFRESH_SECRET
  const expiresIn = type === 'access' ? ACCESS_TTL : REFRESH_TTL
  
  return jwt.sign(
    { ...payload, type },
    secret,
    { expiresIn }
  )
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string, type: 'access' | 'refresh'): JWTPayload {
  const secret = type === 'access' ? ACCESS_SECRET : REFRESH_SECRET
  
  try {
    const decoded = jwt.verify(token, secret) as JWTPayload
    
    if (decoded.type !== type) {
      throw new Error(`Invalid token type: expected ${type}, got ${decoded.type}`)
    }
    
    return decoded
  } catch (error) {
    logger.error('JWT verification failed', { error: error instanceof Error ? error.message : 'Unknown error' })
    throw new Error('Invalid or expired token')
  }
}

/**
 * Generate both access and refresh tokens for a user
 */
export function generateTokenPair(userId: string, email: string) {
  const accessToken = signToken({ userId, email }, 'access')
  const refreshToken = signToken({ userId, email }, 'refresh')
  
  return { accessToken, refreshToken }
}
