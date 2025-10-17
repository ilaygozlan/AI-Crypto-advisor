import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { initDb } from './DB.js';
import authRoutes from './routes/auth.js';
import meRoutes from './routes/me.js';
import insightsRouter from './routes/insights.js';
import memesRouter from './routes/memes.js';
import { startMemesCron } from './services/memes.service.js';

const app = express();

// middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// basic health
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// routes
app.use('/auth', authRoutes);
app.use('/', meRoutes);

// AI
app.use('/api/insights', insightsRouter);

// Memes API
app.use('/api/memes', memesRouter);

// POST /api/reactions
// body: { contentType, externalId, reaction: 'like'|'dislike'|'none', content: {...} }
router.post('/api/reactions', requireAuth, async (req, res) => {
  try {
    const { contentType, externalId, reaction, content } = req.body || {};
    const userId = req.user.id;

    if (!contentType || !externalId || !['like','dislike','none'].includes(reaction)) {
      return res.status(400).json({ error: 'bad_request' });
    }

    if (reaction === 'none') {
      await pgPool.query(
        `DELETE FROM user_reactions WHERE user_id=$1 AND content_type=$2 AND external_id=$3`,
        [userId, contentType, externalId]
      );
      return res.json({ ok: true, reaction: null });
    }

    // נשמור Snapshot קטן של התוכן (חובה להעביר מהקליינט או מהשרת)
    await pgPool.query(`
      INSERT INTO user_reactions (user_id, content_type, external_id, reaction, content)
      VALUES ($1,$2,$3,$4,$5)
      ON CONFLICT (user_id, content_type, external_id) DO UPDATE
        SET reaction = EXCLUDED.reaction,
            content  = CASE
                         WHEN EXCLUDED.content IS NOT NULL THEN EXCLUDED.content
                         ELSE user_reactions.content
                       END,
            updated_at = NOW()
    `, [userId, contentType, externalId, reaction, content || {}]);

    res.json({ ok: true, reaction });
  } catch (e) {
    console.error('[POST /api/reactions]', e);
    res.status(500).json({ error: 'internal_error' });
  }
});

// GET /api/reactions/my?contentType=meme&reaction=like
router.get('/api/reactions/my', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const contentType = String(req.query.contentType || '');
    const reaction = String(req.query.reaction || 'like'); // ברירת מחדל: like

    if (!contentType) return res.status(400).json({ error: 'missing contentType' });

    const { rows } = await pgPool.query(`
      SELECT external_id, reaction, content, created_at
      FROM user_reactions
      WHERE user_id = $1 AND content_type = $2 AND reaction = $3
      ORDER BY created_at DESC
      LIMIT 200
    `, [userId, contentType, reaction]);

    res.json({ items: rows });
  } catch (e) {
    console.error('[GET /api/reactions/my]', e);
    res.status(500).json({ error: 'internal_error' });
  }
});

// start
const PORT = process.env.PORT || 3000;

(async () => {
  await initDb(); // ensure tables exist

  // start the hourly fetcher
  startMemesCron();

  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
})();



