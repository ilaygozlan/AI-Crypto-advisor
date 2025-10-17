import rateLimit from 'express-rate-limit';

// Rate limiter for login - keeps security restrictions
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,                   // max 3 login attempts
  standardHeaders: true,
  legacyHeaders: false,
  // Trust proxy headers for proper IP detection
  trustProxy: true,
  // Use X-Forwarded-For header when available
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
  message: {
    error: 'Too many login attempts, please try again later.',
    retryAfter: '15 minutes'
  }
});

// Rate limiter for signup - more lenient to encourage registration
export const signupLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,  // 5 minutes
  max: 10,                  // max 10 signup attempts
  standardHeaders: true,
  legacyHeaders: false,
  // Trust proxy headers for proper IP detection
  trustProxy: true,
  // Use X-Forwarded-For header when available
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
  message: {
    error: 'Too many signup attempts, please try again later.',
    retryAfter: '5 minutes'
  }
});

// Legacy export for backward compatibility (if needed elsewhere)
export const authLimiter = loginLimiter;