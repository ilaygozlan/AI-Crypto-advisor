import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // For Render External URL locally, SSL is usually required:
  ssl: { rejectUnauthorized: false }
});

// create tables once (no extensions required; we use TEXT ids created in app)
export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id           TEXT PRIMARY KEY,
      email        TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name   TEXT,
      last_name    TEXT,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

await pool.query(`
  CREATE TABLE IF NOT EXISTS user_data (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    investor_type TEXT CHECK (
      investor_type IN ('day_trader', 'investor', 'conservative')
    ) NOT NULL,
    selected_assets TEXT[] NOT NULL,
    selected_content_types TEXT[] NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id          BIGSERIAL PRIMARY KEY,
      user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash  TEXT NOT NULL,
      expires_at  TIMESTAMPTZ NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
      revoked_at  TIMESTAMPTZ
    );
  `);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_refresh_user ON refresh_tokens(user_id);`);
}