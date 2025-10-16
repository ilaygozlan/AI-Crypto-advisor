import jwt from 'jsonwebtoken';
import { env } from '../utils/env';
import { generateRefreshToken, hashRefreshToken } from '../utils/crypto';

export interface TokenPayload {
  sub: string;
  email: string;
}

export class TokenService {
  signAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_TTL,
    });
  }

  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
  }

  generateRefreshToken(): { token: string; hash: string; expiresAt: Date } {
    const { token, hash } = generateRefreshToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    return { token, hash, expiresAt };
  }

  hashRefreshToken(token: string): string {
    return hashRefreshToken(token);
  }
}
