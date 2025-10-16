import { pool } from '../utils/db';

export interface RefreshToken {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  created_at: Date;
  revoked_at?: Date;
}

export interface CreateRefreshTokenData {
  user_id: string;
  token_hash: string;
  expires_at: Date;
}

export class RefreshTokenRepository {
  async create(data: CreateRefreshTokenData): Promise<RefreshToken> {
    const result = await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.user_id, data.token_hash, data.expires_at]
    );
    return result.rows[0];
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    const result = await pool.query(
      `SELECT * FROM refresh_tokens 
       WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > now()`,
      [tokenHash]
    );
    return result.rows[0] || null;
  }

  async revokeById(id: string): Promise<void> {
    await pool.query(
      'UPDATE refresh_tokens SET revoked_at = now() WHERE id = $1',
      [id]
    );
  }

  async revokeByUserId(userId: string): Promise<void> {
    await pool.query(
      'UPDATE refresh_tokens SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL',
      [userId]
    );
  }

  async revokeByTokenHash(tokenHash: string): Promise<void> {
    await pool.query(
      'UPDATE refresh_tokens SET revoked_at = now() WHERE token_hash = $1',
      [tokenHash]
    );
  }

  async cleanupExpired(): Promise<void> {
    await pool.query(
      'DELETE FROM refresh_tokens WHERE expires_at < now() OR revoked_at IS NOT NULL'
    );
  }
}
