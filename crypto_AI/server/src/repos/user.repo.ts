import { pool } from '../utils/db';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
}

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  async findById(id: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: CreateUserData): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.email, data.password_hash, data.first_name, data.last_name]
    );
    return result.rows[0];
  }

  async update(id: string, data: Partial<CreateUserData>): Promise<User> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.email) {
      fields.push(`email = $${paramCount++}`);
      values.push(data.email);
    }
    if (data.password_hash) {
      fields.push(`password_hash = $${paramCount++}`);
      values.push(data.password_hash);
    }
    if (data.first_name !== undefined) {
      fields.push(`first_name = $${paramCount++}`);
      values.push(data.first_name);
    }
    if (data.last_name !== undefined) {
      fields.push(`last_name = $${paramCount++}`);
      values.push(data.last_name);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push(`updated_at = now()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0];
  }
}
