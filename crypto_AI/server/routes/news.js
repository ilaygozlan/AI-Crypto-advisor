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
router.get('/', requireAuth, async (req, res) => {
  try {
    // Parse and validate query parameters
    const limit = Math.min(parseInt(req.query.limit) || 24, 100); // Max 100 items
    const cursor = req.query.cursor ? new Date(String(req.query.cursor)) : null;
    const filter = req.query.filter || 'important';
    const currencies = req.query.currencies ? 
      String(req.query.currencies).split(',').map(c => c.trim().toUpperCase()) : 
      ['BTC', 'MATIC', 'SOL', 'LINK', 'AVAX'];
    const important = req.query.important !== undefined ? 
      req.query.important === 'true' : null;

    console.log(`[GET /api/news] Request params:`, {
      limit,
      cursor: cursor?.toISOString(),
      filter,
      currencies,
      important
    });

    console.log(`[GET /api/news] About to fetch news from service...`);
    
    // Get news from service
    const newsItems = await getNews({
      filter,
      currencies,
      limit,
      cursor,
      important
    });

    console.log(`[GET /api/news] Returning ${newsItems.length} news items`);

    // Set cache headers
    res.set('Cache-Control', 'public, max-age=30');

    // Transform to match expected API contract
    const transformedNews = newsItems.map(item => ({
      id: item.source_id,
      title: item.title,
      url: item.url,
      published_at: item.published_at instanceof Date
        ? item.published_at.toISOString()
        : new Date(item.published_at).toISOString(),
      currencies: item.currencies || [],
      is_important: item.is_important || false,
      source: item.source || 'cryptopanic',
      // Include raw data for debugging/future use
      raw: item.raw || null
    }));

    res.json(transformedNews);
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
