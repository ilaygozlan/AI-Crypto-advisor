import { Router } from 'express';
import { getOrCreateTodayInsight } from '../services/insightService.js';
import { pgPool } from '../memeDB/memeDB.js';

const router = Router();

router.get('/today', async (req, res) => {
  try {
    const user_id = req.query.user_id || req.headers['user_id'];
    if (!user_id) return res.status(400).json({ error: 'missing user_id' });

    const insight = await getOrCreateTodayInsight(String(user_id));
    
    // Get voting data for this insight
    const { rows: voteRows } = await pgPool.query(`
      SELECT 
        COUNT(CASE WHEN reaction = 'like' THEN 1 END) as up_votes,
        COUNT(CASE WHEN reaction = 'dislike' THEN 1 END) as down_votes,
        (SELECT reaction FROM user_reactions 
         WHERE user_id = $1 AND content_type = 'ai_insight' AND external_id = $2) as user_vote
      FROM user_reactions 
      WHERE content_type = 'ai_insight' AND external_id = $2
    `, [user_id, insight.id]);

    const voteData = voteRows[0] || { up_votes: 0, down_votes: 0, user_vote: null };
    
    // Add voting data to insight
    const insightWithVotes = {
      ...insight,
      votes: {
        up: parseInt(voteData.up_votes) || 0,
        down: parseInt(voteData.down_votes) || 0
      },
      userVote: voteData.user_vote === 'like' ? 'up' : voteData.user_vote === 'dislike' ? 'down' : undefined
    };

    return res.json(insightWithVotes);
  } catch (e) {
    console.error('insights/today error:', e);
    return res.status(500).json({ error: e.message || 'Internal Error' });
  }
});

export default router;
