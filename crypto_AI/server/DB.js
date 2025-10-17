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


  await pool.query(`CREATE TABLE IF NOT EXISTS memes (
  id           TEXT PRIMARY KEY,         -- redditId
  subreddit    TEXT NOT NULL,
  title        TEXT NOT NULL,
  score        INTEGER NOT NULL DEFAULT 0,
  num_comments INTEGER NOT NULL DEFAULT 0,
  permalink    TEXT NOT NULL,
  source_url   TEXT NOT NULL,            -- direct image if available
  cdn_url      TEXT,                     -- optional if you later mirror to S3
  is_nsfw      BOOLEAN NOT NULL DEFAULT FALSE,
  flair        TEXT,
  author_name  TEXT,
  created_utc  TIMESTAMPTZ NOT NULL,
  fetched_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_memes_created   ON memes (created_utc DESC);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_memes_subreddit ON memes (subreddit, created_utc DESC);`);

  await pool.query(`DO $$ BEGIN
  CREATE TYPE reaction_value AS ENUM ('like', 'dislike');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;`);

await pool.query(`CREATE TABLE IF NOT EXISTS user_reactions (
  user_id       TEXT         NOT NULL REFERENCES users(id) ON DELETE CASCADE,  -- מזהה המשתמש שלך
  content_type  TEXT         NOT NULL,                -- 'meme' | 'news' | 'coin' | 'ai_daily_news' | ...
  external_id   TEXT         NOT NULL,                -- מזהה הפריט במקור (מם=redditId, חדשות=url-hash וכו')
  reaction      reaction_value NOT NULL,              -- like | dislike
  content       JSONB        NOT NULL,                -- Snapshot מינימלי של התוכן בזמן הפעולה
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, content_type, external_id)    -- ← מונע כפילויות לאותו פריט אצל אותו משתמש
);`);

await pool.query(`CREATE OR REPLACE FUNCTION touch_user_reactions_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END $$;`);

await pool.query(`DROP TRIGGER IF EXISTS trg_touch_user_reactions ON user_reactions;
CREATE TRIGGER trg_touch_user_reactions
BEFORE UPDATE ON user_reactions
FOR EACH ROW EXECUTE FUNCTION touch_user_reactions_updated_at();`);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_user_reactions_user ON user_reactions (user_id, content_type);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_user_reactions_type ON user_reactions (content_type);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_user_reactions_like ON user_reactions (user_id) WHERE reaction = 'like';`);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_refresh_user ON refresh_tokens(user_id);`);
}