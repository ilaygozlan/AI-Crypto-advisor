import pool from '../db/index.js';


export async function getLatestUserData(user_id) {
  const query = `
    SELECT user_id, investor_type, selected_assets, selected_content_types, completed_at
    FROM user_data
    WHERE user_id = $1
    ORDER BY completed_at DESC, created_at DESC
    LIMIT 1;
  `;
  const { rows } = await pool.query(query, [user_id]);
  return rows[0] || null;
}