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
import reactionsRouter from './routes/reactions.js';
import dashboardRouter from './routes/dashboard.js';

const app = express();

// middlewares
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL ||
    'https://crypto-ai-advisore.s3.us-east-1.amazonaws.com'
  ],
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

// Reactions API
app.use('/api/reactions', reactionsRouter);

// Dashboard API
app.use('/dashboard', dashboardRouter);

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



