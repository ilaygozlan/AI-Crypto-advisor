import { Response } from 'express'

/**
 * Get cookie options for refresh tokens
 * Secure cookies in production (Railway provides HTTPS)
 */
export function getCookieOptions(isProduction: boolean, maxAgeMs: number) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: isProduction, // Railway is HTTPS so true in production
    maxAge: maxAgeMs,
    path: '/'
  }
}

/**
 * Set refresh token cookie
 */
export function setRefreshTokenCookie(res: Response, token: string, isProduction: boolean) {
  const maxAgeMs = parseTTLToMs(process.env.REFRESH_TOKEN_TTL || '7d')
  const options = getCookieOptions(isProduction, maxAgeMs)
  
  res.cookie('refresh_token', token, options)
}

/**
 * Clear refresh token cookie
 */
export function clearRefreshTokenCookie(res: Response, isProduction: boolean) {
  const options = getCookieOptions(isProduction, 0)
  res.clearCookie('refresh_token', options)
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
