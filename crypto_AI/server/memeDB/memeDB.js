// DB.js (ESM)
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('Missing DATABASE_URL');

export const pgPool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },  // Render Postgres
  keepAlive: true,
});

export async function initDb() {
  await pgPool.query('select 1');          // sanity
  const initPath = path.join(__dirname, 'db', 'initdb.sql');
  const sql = await fs.readFile(initPath, 'utf8');
  await pgPool.query(sql);                 // idempotent
  console.log('[db] connected & init done');
}
