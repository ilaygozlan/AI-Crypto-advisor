import bcrypt from 'bcrypt';
import { pool } from '../DB.js';
import { newId } from '../utils/crypto.js';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12);

export async function createUser({ email, password, firstName, lastName }) {
  const id = newId();
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const { rows } = await pool.query(
    `INSERT INTO users (id, email, password_hash, first_name, last_name)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, first_name AS "firstName", last_name AS "lastName", created_at AS "createdAt"`,
    [id, email.toLowerCase(), passwordHash, firstName || null, lastName || null]
  );
  return rows[0];
}

export async function findUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT id, email, password_hash, first_name AS "firstName", last_name AS "lastName"
     FROM users WHERE email = $1`,
    [email.toLowerCase()]
  );
  return rows[0] || null;
}

export async function verifyPassword(plain, passwordHash) {
  return bcrypt.compare(plain, passwordHash);
}
