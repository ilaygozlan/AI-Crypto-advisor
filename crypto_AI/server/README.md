# Moveo AI Crypto Advisor - Backend API

A Node.js + Express + TypeScript + Prisma backend for the Moveo AI Crypto Advisor platform.

## Features

- **Authentication**: JWT-based auth with refresh tokens stored in httpOnly cookies
- **Database**: PostgreSQL with Prisma ORM
- **Security**: Helmet, CORS, rate limiting, secure cookies
- **Validation**: Zod schema validation
- **Logging**: Structured logging with Pino
- **Type Safety**: Full TypeScript coverage

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- pnpm (recommended) or npm

### Setup

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Environment setup**:
   ```bash
   cp env.example .env
   # Edit .env with your database URL and secrets
   ```

3. **Database setup**:
   ```bash
   pnpm migrate:dev
   pnpm db:seed  # Optional: seed with sample data
   ```

4. **Start development server**:
   ```bash
   pnpm dev
   ```

The API will be available at `http://localhost:4000`

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Login with email/password
- `POST /auth/refresh` - Refresh access token (uses cookie)
- `POST /auth/logout` - Logout and clear refresh token
- `GET /auth/me` - Get current user profile

### Health
- `GET /healthz` - Health check endpoint

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_ACCESS_SECRET` | Secret for access tokens (64+ chars) | Yes |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens (64+ chars) | Yes |
| `ACCESS_TOKEN_TTL` | Access token expiration (default: 15m) | No |
| `REFRESH_TOKEN_TTL` | Refresh token expiration (default: 7d) | No |
| `PORT` | Server port (default: 4000) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `CORS_ORIGIN` | Allowed CORS origin | Yes |
| `LOG_LEVEL` | Logging level (default: info) | No |

## Database Schema

The application uses Prisma with PostgreSQL. Key models include:

- **User**: User accounts and profiles
- **Session**: JWT session management
- **Asset**: Cryptocurrency definitions
- **UserAsset**: User's selected assets
- **ContentType**: Available content categories
- **UserContentType**: User's content preferences
- **UserInvestorProfile**: User's investor type and settings
- **NewsItem**: Market news articles
- **Meme**: Daily crypto memes
- **PriceSnapshot**: Historical price data
- **AIInsight**: AI-generated market insights
- **Vote**: User votes on content
- **Interaction**: User engagement tracking
- **RecommendationProfile**: AI recommendation settings
- **UserRecommendation**: Personalized recommendations
- **RecommendationEvent**: Recommendation interaction events

## Security Features

- **JWT Authentication**: Access tokens (15m) + refresh tokens (7d)
- **Secure Cookies**: httpOnly, secure, sameSite for refresh tokens
- **CORS Protection**: Single origin configuration
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet**: Security headers
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Zod schemas for all endpoints

## Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build TypeScript to JavaScript
- `pnpm start` - Start production server
- `pnpm migrate:deploy` - Run database migrations (production)
- `pnpm migrate:dev` - Run migrations in development
- `pnpm db:seed` - Seed database with sample data
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues

## Dev → Prod Quick Guide

### Development (local, free)
1) Start DB:
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

2) Copy env:
   ```bash
   cd server && cp env.example .env
   ```

3) Run migrations:
   ```bash
   npm run migrate:dev
   ```

4) Start API:
   ```bash
   npm run dev
   ```

5) Start Frontend (new terminal):
   ```bash
   cd .. && npm run dev
   ```

6) Test:
   - API: http://localhost:4000/healthz
   - Frontend: http://localhost:5173
   - DB: `npm run studio` (Prisma Studio)

### Production (Railway)

1) **Create Railway Project**:
   - New Project → GitHub Repo
   - Add PostgreSQL Plugin

2) **Deploy API Service**:
   - Service Path: `/server`
   - Build: `npm install --production=false && node_modules/.bin/prisma generate && npm run build && node_modules/.bin/prisma migrate deploy`
   - Start: `npm start`
   - Variables:
     ```
     JWT_ACCESS_SECRET=<64+ chars>
     JWT_REFRESH_SECRET=<64+ chars>
     ACCESS_TOKEN_TTL=15m
     REFRESH_TOKEN_TTL=7d
     PORT=4000
     NODE_ENV=production
     CORS_ORIGIN=https://<frontend-url>.up.railway.app
     ```
   - Link PostgreSQL plugin

3) **Deploy Frontend Service**:
   - Service Path: `/` (root)
   - Build: `npm install --production=false && npm run build`
   - Start: `npm run serve:static`
   - Variables:
     ```
     VITE_API_BASE_URL=https://<api-url>.up.railway.app
     ```

4) **Update CORS**:
   - Copy frontend URL to API's `CORS_ORIGIN`
   - Redeploy API

5) **Test Production**:
   - Frontend loads → Login → Cookie set → API calls work

### Environment Files

**Development** (`server/.env`):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/moveo?schema=public"
JWT_ACCESS_SECRET=dev_access_replace_with_64_chars
JWT_REFRESH_SECRET=dev_refresh_replace_with_64_chars
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
PORT=4000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**Frontend Development** (`env.development`):
```env
VITE_API_BASE_URL=http://localhost:4000
```

### Troubleshooting

- **CORS 403/blocked**: ensure exact `CORS_ORIGIN` (HTTPS, no trailing slash).
- **401 on /me**: accessToken missing in Authorization header.
- **Refresh fails**: check `withCredentials: true` and cookie flags (secure in prod).
- **Prisma errors**: verify DATABASE_URL is injected and migrations ran (`migrate:deploy` logs).
- **Build fails**: ensure all environment variables are set in Railway dashboard.
- **Database connection**: check PostgreSQL plugin is linked to the API service.

## Deploy on Railway

### Prerequisites
- Railway account and CLI installed
- PostgreSQL plugin added to your Railway project

### API Service Configuration

**Build Command:**
```bash
npm install --production=false && npx prisma generate && npm run build && npx prisma migrate deploy
```

**Start Command:**
```bash
npm start
```

### Environment Variables
Set these in Railway dashboard under Variables:
```
JWT_ACCESS_SECRET=<64+ random characters>
JWT_REFRESH_SECRET=<64+ random characters>
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://<frontend-url>.up.railway.app
```

### Database Setup
1. **Link PostgreSQL Plugin**: Go to Variables → Link → PostgreSQL
2. This automatically injects `DATABASE_URL` (private: postgres.railway.internal)
3. Migrations run automatically during build

### Health Check
- **Path**: `/healthz`
- **Expected Response**: `200 OK` with "ok" body

### Deployment Steps
1. Deploy API service first
2. Note the API URL (e.g., `https://api-production-xxxx.up.railway.app`)
3. Deploy frontend service with `VITE_API_BASE_URL` set to API URL
   - **Build Command**: `npm install --production=false && npm run build`
   - **Start Command**: `npm run serve:static`
4. Update API `CORS_ORIGIN` to frontend URL
5. Redeploy API service

### Troubleshooting
- **Build fails**: Ensure all environment variables are set
- **Database errors**: Verify PostgreSQL plugin is linked
- **CORS errors**: Check `CORS_ORIGIN` matches frontend URL exactly
- **Health check fails**: Check `/healthz` endpoint returns 200

## Development Notes

- The server uses ES modules (`"type": "module"` in package.json)
- Prisma client is generated on `postinstall` for Railway deployment
- Railway uses Nixpacks (no Dockerfile required)
- Refresh tokens are stored in httpOnly cookies for security
- CORS is configured for single origin in production
- All routes are protected except `/auth/signup`, `/auth/login`, and `/healthz`
