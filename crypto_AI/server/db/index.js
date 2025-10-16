import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },   // <<< חשוב עבור Render
  keepAlive: true,                      // עוזר למנוע ניתוקים
  connectionTimeoutMillis: 10000,       // אופציונלי
  idleTimeoutMillis: 30000              // אופציונלי
});

export default pool;