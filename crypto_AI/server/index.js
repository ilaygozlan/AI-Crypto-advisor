import 'dotenv/config';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from parent directory
config({ path: path.join(__dirname, '..', '.env') });
config({ path: path.join(__dirname, '..', 'env.production') });
config({ path: path.join(__dirname, '..', 'env.development') });
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

const allowedOrigins = [
  'http://localhost:5173', // Local development
  'http://crypto-ai-advisore.s3-website-us-east-1.amazonaws.com', // Production S3
  process.env.FRONTEND_URL // Additional custom frontend URL if set
].filter(Boolean); // Remove any undefined values

console.log('🌐 CORS allowed origins:', allowedOrigins);
console.log('🔧 FRONTEND_URL env var:', process.env.FRONTEND_URL);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// basic health
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// CORS test endpoint
app.get('/cors-test', (_req, res) => {
  res.json({ 
    message: 'CORS is working!',
    allowedOrigins: allowedOrigins,
    frontendUrl: process.env.FRONTEND_URL,
    timestamp: new Date().toISOString()
  });
});

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



