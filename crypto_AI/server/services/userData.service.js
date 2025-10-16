import { pool } from '../DB.js';
import { newId } from '../utils/crypto.js';

export async function saveUserData({
  userId,
  investorType,
  selectedAssets,
  selectedContentTypes
}) {
  const id = newId();
  const completedAt = new Date().toISOString();

  const { rows } = await pool.query(
    `INSERT INTO user_data (
      id, user_id, investor_type, selected_assets, selected_content_types, completed_at
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, user_id AS "userId", investor_type AS "investorType",
              selected_assets AS "selectedAssets",
              selected_content_types AS "selectedContentTypes",
              completed_at AS "completedAt"`,
    [id, userId, investorType, selectedAssets, selectedContentTypes, completedAt]
  );

  return rows[0];
}

export async function getUserDataByUserId(userId) {
  const { rows } = await pool.query(
    `SELECT id, user_id AS "userId", investor_type AS "investorType",
            selected_assets AS "selectedAssets",
            selected_content_types AS "selectedContentTypes",
            completed_at AS "completedAt"
     FROM user_data
     WHERE user_id = $1`,
    [userId]
  );
  return rows;
}

export async function getAllUserData() {
  const { rows } = await pool.query(
    `SELECT 
       id,
       user_id AS "userId",
       investor_type AS "investorType",
       selected_assets AS "selectedAssets",
       selected_content_types AS "selectedContentTypes",
       completed_at AS "completedAt"
     FROM user_data
     ORDER BY completed_at DESC`
  );
  return rows;
}