import { pool } from '../DB.js';

export async function storeRefreshHash({ userId, tokenHash, expiresAt }) {
  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  );
}
export async function findValidRefreshByHash(tokenHash) {
  const { rows } = await pool.query(
    `SELECT id, user_id AS "userId", token_hash AS "tokenHash", expires_at AS "expiresAt", revoked_at AS "revokedAt"
     FROM refresh_tokens
     WHERE token_hash = $1`,
    [tokenHash]
  );
  return rows[0] || null;
}

export async function revokeRefreshByHash(tokenHash) {
  await pool.query(
    `UPDATE refresh_tokens SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL`,
    [tokenHash]
  );
}