import { Router } from 'express';
import { pgPool } from '../memeDB/memeDB.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// Dashboard vote endpoint
router.post('/vote', requireAuth, async (req, res) => {
  try {
    const { section, itemId, vote } = req.body || {};
    const userId = req.user.id;

    console.log(`[POST /dashboard/vote] Received request:`, {
      userId,
      section,
      itemId,
      vote
    });

    if (!section || !itemId || !['up', 'down'].includes(vote)) {
      console.log(`[POST /dashboard/vote] Bad request - missing or invalid parameters`);
      return res.status(400).json({ error: 'bad_request' });
    }

    // Map section to content type
    const contentTypeMap = {
      'news': 'news',
      'prices': 'coin',
      'ai': 'ai_insight',
      'meme': 'meme'
    };

    const contentType = contentTypeMap[section];
    if (!contentType) {
      return res.status(400).json({ error: 'invalid_section' });
    }

    // Map vote to reaction
    const reaction = vote === 'up' ? 'like' : 'dislike';

    // Handle the vote using the existing reactions system
    const result = await pgPool.query(`
      INSERT INTO user_reactions (user_id, content_type, external_id, reaction, content)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, content_type, external_id) DO UPDATE
        SET reaction = EXCLUDED.reaction,
            updated_at = NOW()
    `, [userId, contentType, itemId, reaction, {}]);

    // Get updated vote counts
    const { rows: voteRows } = await pgPool.query(`
      SELECT 
        COUNT(CASE WHEN reaction = 'like' THEN 1 END) as up_votes,
        COUNT(CASE WHEN reaction = 'dislike' THEN 1 END) as down_votes
      FROM user_reactions 
      WHERE content_type = $1 AND external_id = $2
    `, [contentType, itemId]);

    const voteData = voteRows[0] || { up_votes: 0, down_votes: 0 };

    console.log(`[POST /dashboard/vote] Vote processed successfully`);
    res.json({ 
      success: true, 
      newVoteCount: {
        up: parseInt(voteData.up_votes) || 0,
        down: parseInt(voteData.down_votes) || 0
      }
    });
  } catch (e) {
    console.error('[POST /dashboard/vote]', e);
    res.status(500).json({ error: 'internal_error' });
  }
});

export default router;
