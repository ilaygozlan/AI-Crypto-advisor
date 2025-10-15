import { Response } from 'express'
import { isProd, env } from '../config/env.js'

export const refreshCookieName = "refresh_token"

export function refreshCookieOptions(maxAgeMs: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProd,                // true on Railway HTTPS
    maxAge: maxAgeMs,
    path: "/",
  }
}

/**
 * Set refresh token cookie
 */
export function setRefreshTokenCookie(res: Response, token: string) {
  const maxAgeMs = parseTTLToMs(env.REFRESH_TOKEN_TTL)
  const options = refreshCookieOptions(maxAgeMs)
  
  res.cookie(refreshCookieName, token, options)
}

/**
 * Clear refresh token cookie
 */
export function clearRefreshTokenCookie(res: Response) {
  const options = refreshCookieOptions(0)
  res.clearCookie(refreshCookieName, options)
}

/**
 * Parse TTL string to milliseconds
 */
function parseTTLToMs(ttl: string): number {
  const match = ttl.match(/^(\d+)([smhd])$/)
  if (!match) {
    throw new Error(`Invalid TTL format: ${ttl}`)
  }
  
  const value = parseInt(match[1])
  const unit = match[2]
  
  switch (unit) {
    case 's': return value * 1000
    case 'm': return value * 60 * 1000
    case 'h': return value * 60 * 60 * 1000
    case 'd': return value * 24 * 60 * 60 * 1000
    default: throw new Error(`Invalid TTL unit: ${unit}`)
  }
}
