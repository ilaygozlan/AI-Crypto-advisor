import { pool } from '../utils/db';

export interface OnboardingAnswer {
  id: string;
  user_id: string;
  answers: Record<string, any>;
  created_at: Date;
}

export interface CreateOnboardingData {
  user_id: string;
  answers: Record<string, any>;
}

export class OnboardingRepository {
  async create(data: CreateOnboardingData): Promise<OnboardingAnswer> {
    const result = await pool.query(
      `INSERT INTO onboarding_answers (user_id, answers)
       VALUES ($1, $2)
       RETURNING *`,
      [data.user_id, JSON.stringify(data.answers)]
    );
    return result.rows[0];
  }

  async findByUserId(userId: string): Promise<OnboardingAnswer | null> {
    const result = await pool.query(
      'SELECT * FROM onboarding_answers WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    return result.rows[0] || null;
  }

  async updateByUserId(userId: string, answers: Record<string, any>): Promise<OnboardingAnswer> {
    const result = await pool.query(
      `UPDATE onboarding_answers 
       SET answers = $1, created_at = now()
       WHERE user_id = $2
       RETURNING *`,
      [JSON.stringify(answers), userId]
    );
    return result.rows[0];
  }
}
