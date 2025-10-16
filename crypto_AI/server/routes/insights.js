import { Router } from 'express';
import { getOrCreateTodayInsight } from '../services/insightService.js';

const router = Router();

router.get('/today', async (req, res) => {
  try {
    const user_id = req.query.user_id || req.headers['user_id'];
    if (!user_id) return res.status(400).json({ error: 'missing user_id' });

    const insight = await getOrCreateTodayInsight(String(user_id));
    return res.json(insight);
  } catch (e) {
    console.error('insights/today error:', e);
    return res.status(500).json({ error: e.message || 'Internal Error' });
  }
});

export default router;
