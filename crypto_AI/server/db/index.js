import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },   
  keepAlive: true,                      
  connectionTimeoutMillis: 10000,       
  idleTimeoutMillis: 30000             
});

export default pool;