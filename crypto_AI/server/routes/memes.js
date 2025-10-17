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
