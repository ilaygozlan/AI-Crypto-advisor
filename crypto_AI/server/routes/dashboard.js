import { Router } from 'express';
import { pgPool } from '../memeDB/memeDB.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// Dashboard endpoint to fetch user reactions for news items
router.post('/news/reactions', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { newsIds } = req.body;
    
    if (!Array.isArray(newsIds)) {
      return res.status(400).json({ error: 'newsIds must be an array' });
    }

    if (newsIds.length === 0) {
      return res.json({ userReactions: {}, voteCounts: {} });
    }

    // Get user reactions for the specified news items
    const { rows: reactionRows } = await pgPool.query(`
      SELECT external_id, reaction 
      FROM user_reactions 
      WHERE user_id = $1 AND content_type = 'news' AND external_id = ANY($2)
    `, [userId, newsIds]);

    // Get vote counts for all news items
    const { rows: voteRows } = await pgPool.query(`
      SELECT 
        external_id,
        COUNT(CASE WHEN reaction = 'like' THEN 1 END) as up_votes,
        COUNT(CASE WHEN reaction = 'dislike' THEN 1 END) as down_votes
      FROM user_reactions 
      WHERE content_type = 'news' AND external_id = ANY($1)
      GROUP BY external_id
    `, [newsIds]);

    // Create lookup maps
    const userReactions = {};
    reactionRows.forEach(row => {
      userReactions[row.external_id] = row.reaction === 'like' ? 'up' : row.reaction === 'dislike' ? 'down' : null;
    });

    const voteCounts = {};
    voteRows.forEach(row => {
      voteCounts[row.external_id] = {
        up: parseInt(row.up_votes),
        down: parseInt(row.down_votes)
      };
    });

    console.log(`[POST /dashboard/news/reactions] Returning reactions for ${newsIds.length} news items`);
    res.json({ userReactions, voteCounts });
  } catch (error) {
    console.error('Dashboard news reactions error:', error);
    return res.status(500).json({ error: error.message || 'Internal Error' });
  }
});

// Dashboard vote endpoint for news, prices, AI insights, and memes
router.post('/vote', requireAuth, async (req, res) => {
  try {
    const { section, itemId, vote, content } = req.body || {};
    const userId = req.user.id;

    console.log(`[POST /dashboard/vote] Received request:`, {
      userId,
      section,
      itemId,
      vote
    });

    if (!section || !itemId || (vote !== null && !['up', 'down'].includes(vote))) {
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
      console.log(`[POST /dashboard/vote] Invalid section: ${section}`);
      return res.status(400).json({ error: 'invalid_section' });
    }

    // Map vote to reaction
    const reaction = vote === 'up' ? 'like' : vote === 'down' ? 'dislike' : null;

    // Check if user already has a reaction for this item
    const { rows: existingRows } = await pgPool.query(
      `SELECT reaction FROM user_reactions 
       WHERE user_id = $1 AND content_type = $2 AND external_id = $3`,
      [userId, contentType, itemId]
    );

    const existingReaction = existingRows[0]?.reaction;

    // If vote is null, remove reaction; otherwise set new reaction
    const newReaction = reaction;

    if (newReaction === null) {
      // Remove reaction
      console.log(`[POST /dashboard/vote] Removing reaction for user ${userId}, content ${contentType}, external ${itemId}`);
      await pgPool.query(
        `DELETE FROM user_reactions WHERE user_id=$1 AND content_type=$2 AND external_id=$3`,
        [userId, contentType, itemId]
      );
    } else {
      // Upsert reaction
      console.log(`[POST /dashboard/vote] Upserting reaction for user ${userId}, content ${contentType}, external ${itemId}, reaction ${newReaction}`);
      await pgPool.query(`
        INSERT INTO user_reactions (user_id, content_type, external_id, reaction, content)
        VALUES ($1,$2,$3,$4,$5)
        ON CONFLICT (user_id, content_type, external_id) DO UPDATE
          SET reaction = EXCLUDED.reaction,
              updated_at = NOW()
      `, [userId, contentType, itemId, newReaction, content || {}]);
    }

    // Get updated vote counts for this item
    const { rows: voteRows } = await pgPool.query(`
      SELECT 
        COUNT(CASE WHEN reaction = 'like' THEN 1 END) as up_votes,
        COUNT(CASE WHEN reaction = 'dislike' THEN 1 END) as down_votes
      FROM user_reactions 
      WHERE content_type = $1 AND external_id = $2
    `, [contentType, itemId]);

    const voteCounts = voteRows[0] || { up_votes: 0, down_votes: 0 };

    console.log(`[POST /dashboard/vote] Successfully processed vote. New counts:`, voteCounts);
    
    res.json({ 
      success: true, 
      newVoteCount: {
        up: parseInt(voteCounts.up_votes),
        down: parseInt(voteCounts.down_votes)
      }
    });
  } catch (error) {
    console.error('Dashboard vote error:', error);
    return res.status(500).json({ error: error.message || 'Internal Error' });
  }
});

export default router;
