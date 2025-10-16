import express from 'express';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

// GET /me  →  basic info from token
router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

// GET /me/data  →  full user onboarding/form data
router.get('/me/data', requireAuth, async (req, res) => {
  try {
    console.log('GET /me/data userId=', req.user?.id);

    const { rows } = await pool.query(
      `SELECT
         id,
         user_id AS "userId",
         investor_type AS "investorType",
         selected_assets AS "selectedAssets",
         selected_content_types AS "selectedContentTypes",
         completed_at AS "completedAt"
       FROM user_data
       WHERE user_id = $1`,
      [req.user.id]
    );

    // Even if no rows, return [] with 200
    return res.json({ data: rows ?? [] });
  } catch (error) {
    console.error('Error fetching user data:', {
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
      stack: error?.stack
    });
    res.status(500).json({ error: 'failed_to_get_user_data' });
  }
});

export default router;