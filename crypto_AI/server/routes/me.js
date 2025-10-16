import express from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { pool } from '../DB.js';

const router = express.Router();

// GET /me  →  basic info from token
router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

// GET /me/data  →  full user onboarding/form data
router.get('/me/data', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         id,
         user_id AS "userId",
         investor_type AS "investorType",
         selected_assets AS "selectedAssets",
         selected_content_types AS "selectedContentTypes",
         completed_at AS "completedAt"
       FROM public.user_data
       WHERE user_id = $1`,
      [req.user.id]
    );

    // Return 200 even if empty
    return res.json({ data: rows ?? [] });
  } catch (error) {
    console.error('Error fetching user data:', {
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
      stack: error?.stack,
    });
    return res.status(500).json({ error: 'failed_to_get_user_data' });
  }
});


router.get('/db/debug', requireAuth, async (req, res) => {
  try {
    const info = await pool.query(`
      SELECT current_user, current_database()
    `);

    const tables = await pool.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema NOT IN ('pg_catalog','information_schema')
      ORDER BY 1,2
    `);

    const cols = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema='public' AND table_name='user_data'
      ORDER BY ordinal_position
    `);

    // try a count to surface permissions
    const count = await pool.query(`SELECT COUNT(*)::int AS n FROM public.user_data`);

    res.json({
      info: info.rows[0],
      tables: tables.rows,
      user_data_columns: cols.rows,
      user_data_count: count.rows[0].n
    });
  } catch (err) {
    res.status(500).json({
      debug_error: {
        message: err?.message,
        code: err?.code,
        detail: err?.detail
      }
    });
  }
});
router.get('/me/data/all', async (req, res) => {
  try {
    const allData = await getAllUserData();
    res.json(allData);
  } catch (err) {
    console.error('Error fetching all user data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;