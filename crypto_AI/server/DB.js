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
await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.insights (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      date_key DATE NOT NULL,
      provider TEXT,
      model TEXT,
      prompt_tokens INT,
      completion_tokens INT,
      title TEXT,
      tl_dr TEXT,
      content_md TEXT,
      content_json JSONB,
      sources JSONB
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_insights_user_date
    ON public.insights(user_id, date_key DESC);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_insights_generated_at
    ON public.insights(generated_at DESC);
  `);

  await pool.query(`
    DO $$
    BEGIN
      -- Only run if the column isn't already DATE
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'insights'
          AND column_name = 'date_key'
          AND data_type <> 'date'
      ) THEN
        ALTER TABLE public.insights
          ALTER COLUMN date_key TYPE date
          USING (date_key::date);
      END IF;
    END$$;
  `);

  // Add useful indexes
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_insights_user_date
    ON public.insights(user_id, date_key DESC);
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_insights_generated_at
    ON public.insights(generated_at DESC);
  `);

  await pool.query(`
    DELETE FROM insights
    WHERE user_id = 'ed583ad1-0e0d-4a9b-9a6e-6557abbefbec'
      AND date_key = CURRENT_DATE;
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_refresh_user ON refresh_tokens(user_id);`);
}