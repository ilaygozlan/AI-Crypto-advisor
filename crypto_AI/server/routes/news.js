// server/routes/news.js
import { Router } from 'express';
import { getNews, refreshDaily } from '../services/news.service.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// Manual refresh endpoint (admin/debug)
router.post('/refresh', async (_req, res) => {
  try {
    const result = await refreshDaily();
    res.json({ ok: true, ...result });
  } catch (e) {
    console.error('[POST /api/news/refresh]', e);
    res.status(500).json({ error: 'refresh_failed' });
  }
});

// Main API endpoint for fetching news with filtering and pagination
// server/routes/news.js
router.get('/', requireAuth, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 24, 100);
    const cursor = req.query.cursor ? new Date(String(req.query.cursor)) : null;
    const currencies = req.query.currencies
      ? String(req.query.currencies).split(',').map(c => c.trim().toUpperCase())
      : null; 

    console.log(`[GET /api/news] params:`, {
      limit,
      cursor: cursor?.toISOString(),
      currencies
    });

   
    const newsItems = await getNews({
      limit,
      cursor,
      currencies
    });

    res.set('Cache-Control', 'public, max-age=30');

    const transformed = newsItems.map(item => ({
      id: item.source_id,
      title: item.title,
      url: item.url,
      published_at: item.published_at instanceof Date
        ? item.published_at.toISOString()
        : new Date(item.published_at).toISOString(),
      currencies: item.currencies || [],
      is_important: item.is_important || false,
      source: item.source || 'cryptopanic',
      raw: item.raw || null
    }));

    res.json(transformed);
  } catch (error) {
    console.error('[GET /api/news]', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Health check endpoint
router.get('/health', async (_req, res) => {
  try {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'news'
    });
  } catch (error) {
    console.error('[GET /api/news/health]', error);
    res.status(500).json({ error: 'Health check failed' });
  }
});

export default router;
