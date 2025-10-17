import { Router } from 'express';
import { pgPool } from '../memeDB/memeDB.js';
import { fetchMemes } from '../services/memes.service.js';

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
router.get('/', async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 24, 100); // Max 100 items
        const sub = req.query.sub;
        const cursor = req.query.cursor ? new Date(String(req.query.cursor)) : null;

        let whereConditions = ['source_url IS NOT NULL', 'is_nsfw = false'];
        let params = [];
        let paramCount = 0;

        // Add subreddit filter
        if (sub && sub !== 'all') {
            paramCount++;
            whereConditions.push(`subreddit = $${paramCount}`);
            params.push(sub);
        }

        // Add cursor pagination
        if (cursor && !isNaN(cursor.getTime())) {
            paramCount++;
            whereConditions.push(`created_utc < $${paramCount}`);
            params.push(cursor.toISOString());
        }

        // Add limit
        paramCount++;
        params.push(limit);

        const userId = req.user?.id || process.env.DEV_USER_ID || null;
        let joinUser = '';
        if (userId) {
            paramCount++;
            params.push(userId);
            joinUser = `
            LEFT JOIN user_reactions ur
            ON ur.user_id = $${paramCount}
            AND ur.content_type = 'meme'
            AND ur.external_id = m.id
            `;
        }

        const query = `
        SELECT m.id, m.subreddit, m.title, m.score, m.num_comments,
        m.permalink, m.source_url, m.created_utc,
        ur.reaction AS user_reaction
        FROM memes m
        ${joinUser}
        WHERE ${whereConditions.join(' AND ')}
        ORDER BY m.created_utc DESC
        LIMIT $${paramCount}
            `;

        const { rows } = await pgPool.query(query, params);

        // Transform to match expected API contract
        const memes = rows.map(row => ({
            id: row.id,
            subreddit: row.subreddit,
            title: row.title,
            score: row.score,
            num_comments: row.num_comments,
            permalink: row.permalink,
            source_url: row.source_url,
            created_utc: row.created_utc.toISOString(),
            user_reaction: row.user_reaction ?? null // 'like' | 'dislike' | null
        }));


        res.json(memes);
    } catch (error) {
        console.error('[GET /api/memes]', error);
        res.status(500).json({ error: 'Failed to fetch memes' });
    }
});

router.get('/preview', async (_req, res) => {
    const { rows } = await pgPool.query(`
    SELECT title, source_url, subreddit, permalink
    FROM memes
    WHERE source_url IS NOT NULL
    ORDER BY (score * 0.7) + (EXTRACT(EPOCH FROM (NOW() - created_utc)) / 3600 * -0.3) DESC
    LIMIT 30
  `);

    const html = rows.map(m => `
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
  `).join('');

    res.send(`
    <html>
      <body style="margin:20px;display:flex;flex-wrap:wrap;justify-content:center;">${html}</body>
    </html>
  `);
});

export default router;
