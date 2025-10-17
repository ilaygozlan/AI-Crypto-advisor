import { Router } from 'express';
import { getOrCreateTodayInsight } from '../services/insightService.js';
import { pgPool } from '../memeDB/memeDB.js';

const router = Router();

router.get('/today', async (req, res) => {
  try {
    const user_id = req.query.user_id || req.headers['user_id'];
    if (!user_id) return res.status(400).json({ error: 'missing user_id' });

    const insight = await getOrCreateTodayInsight(String(user_id));
    
    // Get user reaction for this insight (similar to memes)
    const { rows: reactionRows } = await pgPool.query(`
      SELECT reaction FROM user_reactions 
      WHERE user_id = $1 AND content_type = 'ai_insight' AND external_id = $2
    `, [user_id, insight.id]);

    const userReaction = reactionRows[0]?.reaction || null;
    
    // Add user reaction to insight
    const insightWithReaction = {
      ...insight,
      user_reaction: userReaction
    };

    return res.json(insightWithReaction);
  } catch (e) {
    console.error('insights/today error:', e);
    return res.status(500).json({ error: e.message || 'Internal Error' });
  }
});

export default router;
