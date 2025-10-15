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

## Railway Deploy Checklist

1) In Railway, create a **New Project**.

2) **Add Plugin → PostgreSQL** (Railway will inject `DATABASE_URL` for connected services).

3) **Add Service → GitHub Repo** pointing to this project.
   - **API Service** (path `/server`)
     - Build Command: `pnpm install --frozen-lockfile && pnpm build && pnpm migrate:deploy`
     - Start Command: `pnpm start`
     - Variables:
       - `JWT_ACCESS_SECRET` + `JWT_REFRESH_SECRET` (64+ random chars)
       - `ACCESS_TOKEN_TTL=15m`, `REFRESH_TOKEN_TTL=7d`
       - `PORT=4000`, `NODE_ENV=production`
       - `CORS_ORIGIN=https://<YOUR-FRONTEND>.up.railway.app`
     - Link the **PostgreSQL plugin** to this service so `DATABASE_URL` is available.

4) **Deploy API** once to obtain its Railway URL: `https://<api>.up.railway.app`.

5) **Frontend Service** (project root):
   - Build Command: `pnpm install --frozen-lockfile && pnpm build`
   - Start Command: `pnpm serve:static`
   - Variables:
     - `VITE_API_BASE_URL=https://<api>.up.railway.app`

6) Update API `CORS_ORIGIN` with the actual frontend URL: `https://<frontend>.up.railway.app`, then redeploy API.

7) Test:
   - Open `<frontend>.up.railway.app`
   - Signup/Login → should set httpOnly `refresh_token` cookie and return accessToken
   - `/me` with Bearer → OK
   - Refresh page → silent `/auth/refresh` works (cookie).

## Troubleshooting

- **CORS 403/blocked**: ensure exact `CORS_ORIGIN` (HTTPS, no trailing slash).
- **401 on /me**: accessToken missing in Authorization header.
- **Refresh fails**: check `withCredentials: true` and cookie flags (secure in prod).
- **Prisma errors**: verify DATABASE_URL is injected and migrations ran (`migrate:deploy` logs).
- **Build fails**: ensure all environment variables are set in Railway dashboard.
- **Database connection**: check PostgreSQL plugin is linked to the API service.

## Development Notes

- The server uses ES modules (`"type": "module"` in package.json)
- Prisma client is generated on `postinstall` for Railway deployment
- Refresh tokens are stored in httpOnly cookies for security
- CORS is configured for single origin in production
- All routes are protected except `/auth/signup`, `/auth/login`, and `/healthz`
