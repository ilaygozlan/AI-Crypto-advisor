import { Router } from 'express';
import { pgPool } from '../memeDB/memeDB.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// Save like/dislike or cancel
router.post('/', requireAuth, async (req, res) => {
  try {
    const { contentType, externalId, reaction, content } = req.body || {};
    const userId = req.user.id;

    console.log(`[POST /api/reactions] Received request:`, {
      userId,
      contentType,
      externalId,
      reaction,
      hasContent: !!content
    });

    if (!contentType || !externalId || !['like','dislike','none'].includes(reaction)) {
      console.log(`[POST /api/reactions] Bad request - missing or invalid parameters`);
      return res.status(400).json({ error: 'bad_request' });
    }

    if (reaction === 'none') {
      console.log(`[POST /api/reactions] Deleting reaction for user ${userId}, content ${contentType}, external ${externalId}`);
      const result = await pgPool.query(
        `DELETE FROM user_reactions WHERE user_id=$1 AND content_type=$2 AND external_id=$3`,
        [userId, contentType, externalId]
      );
      console.log(`[POST /api/reactions] Deleted ${result.rowCount} reactions`);
      return res.json({ ok: true, reaction: null });
    }

    console.log(`[POST /api/reactions] Upserting reaction for user ${userId}, content ${contentType}, external ${externalId}, reaction ${reaction}`);
    const result = await pgPool.query(`
      INSERT INTO user_reactions (user_id, content_type, external_id, reaction, content)
      VALUES ($1,$2,$3,$4,$5)
      ON CONFLICT (user_id, content_type, external_id) DO UPDATE
        SET reaction = EXCLUDED.reaction,
            content  = COALESCE(EXCLUDED.content, user_reactions.content),
            updated_at = NOW()
    `, [userId, contentType, externalId, reaction, content || {}]);
    
    console.log(`[POST /api/reactions] Upserted reaction successfully`);
    res.json({ ok: true, reaction });
  } catch (e) {
    console.error('[POST /api/reactions]', e);
    res.status(500).json({ error: 'internal_error' });
  }
});

// Return all items the user liked/disliked
router.get('/my', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const contentType = req.query.contentType;
    if (!contentType) return res.status(400).json({ error: 'missing contentType' });

    const { rows } = await pgPool.query(
      `SELECT external_id, reaction, content, created_at
       FROM user_reactions
       WHERE user_id=$1 AND content_type=$2
       ORDER BY created_at DESC`,
      [userId, contentType]
    );

    res.json({ items: rows });
  } catch (e) {
    console.error('[GET /api/reactions/my]', e);
    res.status(500).json({ error: 'internal_error' });
  }
});

export default router;
