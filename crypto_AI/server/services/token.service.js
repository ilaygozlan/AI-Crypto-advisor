import jwt from 'jsonwebtoken';
import { randomTokenBase64Url, sha256Base64 } from '../utils/crypto.js';

let accessTtl = process.env.JWT_ACCESS_TTL || '15m';
let refreshTtl = process.env.JWT_REFRESH_TTL || '7d';

// Simple ms parser fallback if ms isn't installed
function ttlToMs(ttl) {
  try {
    // dynamic import or inline minimal parser:
    // Very small fallback: "15m" → 15*60*1000; "7d" → 7*24*60*60*1000
    const m = /^(\d+)([smhd])$/.exec(ttl);
    if (!m) return 15 * 60 * 1000;
    const n = Number(m[1]);
    const unit = m[2];
    if (unit === 's') return n * 1000;
    if (unit === 'm') return n * 60 * 1000;
    if (unit === 'h') return n * 60 * 60 * 1000;
    if (unit === 'd') return n * 24 * 60 * 60 * 1000;
    return 15 * 60 * 1000;
  } catch {
    return 15 * 60 * 1000;
  }
}
const accessMs = ttlToMs(accessTtl);
const refreshMs = ttlToMs(refreshTtl);

export function signAccessToken(payload) {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error('JWT_ACCESS_SECRET missing');
  return jwt.sign(payload, secret, { expiresIn: accessTtl });
}

export function verifyAccessToken(token) {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error('JWT_ACCESS_SECRET missing');
  return jwt.verify(token, secret);
}

export function generateRefreshToken() {
  // opaque random token + its hash
  const token = randomTokenBase64Url(64);
  const hash = sha256Base64(token);
  const expiresAt = new Date(Date.now() + refreshMs);
  return { token, hash, expiresAt };
}
