// server/routes/memes.js
import { Router } from 'express';
import { pgPool } from '../memeDB/memeDB.js';
import { fetchMemes } from '../services/memes.service.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/refresh', async (_req, res) => {
  try {
    const result = await fetchMemes();
    res.json({ ok: true, ...result });
  } catch (e) {
    console.error('[POST /api/memes/refresh]', e);
    res.status(500).json({ error: 'refresh_failed' });
  }
});

// Main API endpoint for fetching memes with pagination and filtering
router.get('/', requireAuth, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 24, 100); // Max 100 items
    const sub = req.query.sub;
    const cursor = req.query.cursor ? new Date(String(req.query.cursor)) : null;

    // --- Param helper to avoid index mistakes ---
    const params = [];
    const addParam = (val) => {
      params.push(val);
      return `$${params.length}`;
    };

    // --- Build WHERE conditions (always qualify with alias m) ---
    const whereConditions = ['m.source_url IS NOT NULL', 'm.is_nsfw = false'];

    if (sub && sub !== 'all') {
      whereConditions.push(`m.subreddit = ${addParam(sub)}`);
    }

    if (cursor && !isNaN(cursor.getTime())) {
      // Cast to timestamptz to match created_utc type
      whereConditions.push(`m.created_utc < ${addParam(cursor.toISOString())}::timestamptz`);
    }

    // --- Optional user join (only if we have a user id) ---
    const userId = req.user?.id || process.env.DEV_USER_ID || null;
    
    console.log(`[GET /api/memes] User ID: ${userId}, req.user:`, req.user);
    
    // Debug: Check if user has any reactions in the database
    if (userId) {
      const { rows: reactionRows } = await pgPool.query(
        `SELECT external_id, reaction, content_type FROM user_reactions WHERE user_id = $1 AND content_type = 'meme' LIMIT 5`,
        [userId]
      );
      console.log(`[GET /api/memes] User has ${reactionRows.length} reactions in database:`, reactionRows);
    }

    // Build SELECT field for user reaction dynamically
    let joinUserSQL = '';
    let selectUserReactionSQL = 'NULL AS user_reaction'; // default when no user
    if (userId) {
      const userIdParam = addParam(userId);
      joinUserSQL = `
        LEFT JOIN user_reactions ur
          ON ur.user_id = ${userIdParam}
         AND ur.content_type = 'meme'
         AND ur.external_id = m.id
      `;
      selectUserReactionSQL = 'ur.reaction AS user_reaction';
    }

    // Add LIMIT as the last parameter
    const limitParam = addParam(limit);

    const query = `
      SELECT
        m.id,
        m.subreddit,
        m.title,
        m.score,
        m.num_comments,
        m.permalink,
        m.source_url,
        m.created_utc,
        ${selectUserReactionSQL}
      FROM memes AS m
      ${joinUserSQL}
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY m.created_utc DESC
      LIMIT ${limitParam}
    `;

    // Debug: Log the SQL query and parameters
    console.log(`[GET /api/memes] SQL Query:`, query);
    console.log(`[GET /api/memes] SQL Parameters:`, params);

    const { rows } = await pgPool.query(query, params);

    // Debug: Log raw database rows
    console.log(`[GET /api/memes] Raw database rows (${rows.length} total):`);
    rows.slice(0, 3).forEach((row, index) => {
      console.log(`  Row ${index + 1}:`, {
        id: row.id,
        title: row.title,
        subreddit: row.subreddit,
        user_reaction: row.user_reaction,
        user_reaction_type: typeof row.user_reaction
      });
    });

    // Transform to match expected API contract
    const memes = rows.map((row) => ({
      id: row.id,
      subreddit: row.subreddit,
      title: row.title,
      score: row.score,
      num_comments: row.num_comments,
      permalink: row.permalink,
      source_url: row.source_url,
      created_utc: row.created_utc instanceof Date
        ? row.created_utc.toISOString()
        : new Date(row.created_utc).toISOString(),
      user_reaction: row.user_reaction ?? null, // 'like' | 'dislike' | null
    }));

    // Debug: Log transformed memes array
    console.log(`[GET /api/memes] Transformed memes array (${memes.length} total):`);
    memes.slice(0, 3).forEach((meme, index) => {
      console.log(`  Meme ${index + 1}:`, {
        id: meme.id,
        title: meme.title,
        subreddit: meme.subreddit,
        user_reaction: meme.user_reaction,
        user_reaction_type: typeof meme.user_reaction
      });
    });

    // Debug: Log reactions for first few memes
    const reactionsWithData = memes.filter(m => m.user_reaction).slice(0, 3);
    if (reactionsWithData.length > 0) {
      console.log(`[GET /api/memes] Found ${reactionsWithData.length} memes with reactions:`, 
        reactionsWithData.map(m => ({ id: m.id, title: m.title, reaction: m.user_reaction }))
      );
    } else {
      console.log(`[GET /api/memes] No user reactions found for ${memes.length} memes`);
    }

    // Debug: Log final response
    console.log(`[GET /api/memes] Sending ${memes.length} memes to frontend`);
    console.log(`[GET /api/memes] Complete memes array:`, JSON.stringify(memes, null, 2));

    res.json(memes);
  } catch (error) {
    console.error('[GET /api/memes]', error);
    res.status(500).json({ error: 'Failed to fetch memes' });
  }
});

router.get('/preview', async (_req, res) => {
  try {
    const { rows } = await pgPool.query(`
      SELECT title, source_url, subreddit, permalink
      FROM memes
      WHERE source_url IS NOT NULL
      ORDER BY (score * 0.7) + (EXTRACT(EPOCH FROM (NOW() - created_utc)) / 3600 * -0.3) DESC
      LIMIT 30
    `);

    const html = rows
      .map(
        (m) => `
        <a href="${m.permalink}" target="_blank" style="text-decoration:none;color:#111">
          <div style="display:inline-block;margin:10px;border:1px solid #eee;padding:8px;width:310px">
            <img src="${m.source_url}"
                 onerror="this.src='https://www.redditstatic.com/desktop2x/img/renderTimingPixel.png';"
                 style="width:300px;height:300px;object-fit:cover;display:block;background:#fafafa" />
            <div style="font:14px/1.4 sans-serif;margin-top:6px">
              <b>${m.title}</b><br/>r/${m.subreddit}
            </div>
          </div>
        </a>
      `
      )
      .join('');

    res.send(`
      <html>
        <body style="margin:20px;display:flex;flex-wrap:wrap;justify-content:center;">${html}</body>
      </html>
    `);
  } catch (e) {
    console.error('[GET /api/memes/preview]', e);
    res.status(500).send('Preview failed');
  }
});

export default router;
