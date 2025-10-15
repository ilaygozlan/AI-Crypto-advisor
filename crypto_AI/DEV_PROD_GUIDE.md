# Moveo AI Crypto Advisor - Dev → Prod Pipeline

## 🚀 Quick Start

### Development (Local)
```bash
# 1. Start PostgreSQL
docker compose -f docker-compose.dev.yml up -d

# 2. Setup Backend
cd server
cp env.example .env
npm install
npm run migrate:dev
npm run dev

# 3. Setup Frontend (new terminal)
cd ..
npm install
npm run dev
```

### Production (Railway)
1. **Create Railway Project** → Add PostgreSQL Plugin
2. **Deploy API** (`/server`) → Deploy Frontend (`/`)
3. **Update CORS** → Test Production

---

## 📁 Project Structure

```
crypto_AI/
├── docker-compose.dev.yml    # Local PostgreSQL
├── env.development           # Frontend dev env
├── env.production            # Frontend prod env
├── server/                   # Backend API
│   ├── src/
│   │   ├── config/env.ts     # Typed environment config
│   │   ├── utils/cookies.ts  # Secure cookie utilities
│   │   └── index.ts          # Express app with CORS/health
│   ├── env.example           # Backend dev env template
│   └── package.json          # Scripts for both envs
└── src/                      # Frontend React app
    └── lib/api/client.ts     # Axios with credentials
```

---

## 🔧 Environment Configuration

### Backend Environment (`server/.env`)
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

### Frontend Environment (`env.development`)
```env
VITE_API_BASE_URL=http://localhost:4000
```

---

## 🐳 Docker Development

**PostgreSQL Container:**
- **Image**: `postgres:16`
- **Port**: `5432`
- **Database**: `moveo`
- **User/Pass**: `postgres/postgres`
- **Health Check**: Built-in

**Start Database:**
```bash
docker compose -f docker-compose.dev.yml up -d
```

**Stop Database:**
```bash
docker compose -f docker-compose.dev.yml down
```

---

## 🚀 Railway Production

### API Service Configuration
- **Path**: `/server`
- **Build**: `npm install --production=false && node_modules/.bin/prisma generate && npm run build && node_modules/.bin/prisma migrate deploy`
- **Start**: `npm start`
- **Health Check**: `/healthz`

### Frontend Service Configuration
- **Path**: `/` (root)
- **Build**: `npm install --production=false && npm run build`
- **Start**: `npm run serve:static`
- **Health Check**: `/`

### Environment Variables

**API Service:**
```
JWT_ACCESS_SECRET=<64+ random characters>
JWT_REFRESH_SECRET=<64+ random characters>
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://<frontend-url>.up.railway.app
DATABASE_URL=<auto-injected by PostgreSQL plugin>
```

**Frontend Service:**
```
VITE_API_BASE_URL=https://<api-url>.up.railway.app
```

---

## 🔐 Security Features

### Typed Environment Configuration
- **Zod validation** for all environment variables
- **Type-safe** access to config values
- **Runtime validation** on startup

### Secure Cookie Configuration
- **HTTP-only** cookies for refresh tokens
- **Secure flag** in production (HTTPS)
- **SameSite: lax** for CSRF protection
- **Automatic TTL** parsing from environment

### CORS Configuration
- **Single origin** from environment variable
- **Credentials enabled** for cookie support
- **Production-ready** HTTPS enforcement

---

## 📊 Available Scripts

### Backend (`server/`)
```bash
npm run dev          # Hot-reload development server
npm run build        # TypeScript compilation
npm run start        # Production server
npm run migrate:dev  # Development migrations
npm run migrate:deploy # Production migrations
npm run studio       # Prisma Studio (DB GUI)
npm run health       # Health check test
```

### Frontend (root)
```bash
npm run dev          # Vite development server
npm run build        # Production build
npm run preview      # Preview production build
npm run serve:static # Serve static files (Railway)
```

---

## 🔍 Health Checks

### API Health Check
- **Endpoint**: `GET /healthz`
- **Response**: `200 OK` with server status
- **Usage**: Railway health monitoring

### Database Health Check
- **Built into**: Docker PostgreSQL container
- **Command**: `pg_isready -U postgres -d moveo`
- **Interval**: 5 seconds

---

## 🐛 Troubleshooting

### Common Issues

**CORS Errors:**
- Ensure `CORS_ORIGIN` matches frontend URL exactly
- No trailing slashes in URLs
- HTTPS in production, HTTP in development

**Database Connection:**
- Check PostgreSQL container is running
- Verify `DATABASE_URL` format
- Run migrations: `npm run migrate:dev`

**Authentication Issues:**
- Check JWT secrets are 64+ characters
- Verify cookie settings (secure in prod)
- Test refresh token flow

**Build Failures:**
- Clear node_modules: `rm -rf node_modules`
- Reinstall: `npm install`
- Check environment variables are set

### Railway-Specific Issues

**Prisma Permission Denied:**
- Use `node_modules/.bin/prisma` instead of `npx prisma`
- Ensure build command includes Prisma generation

**Docker Cache Conflicts:**
- Use `npm install --production=false` instead of `npm ci`
- Clear cache in build commands

**Environment Variables:**
- Set all required variables in Railway dashboard
- Link PostgreSQL plugin to API service
- Update CORS_ORIGIN after frontend deployment

---

## 📈 Monitoring

### Development
- **API Logs**: Console output with structured logging
- **Database**: Prisma Studio at `npm run studio`
- **Health**: `npm run health` or `curl localhost:4000/healthz`

### Production
- **Railway Logs**: Built-in log viewer
- **Health Checks**: Automatic monitoring
- **Database**: Railway PostgreSQL metrics

---

## 🔄 Deployment Workflow

1. **Development** → Test locally with Docker
2. **Commit** → Push to GitHub
3. **Railway** → Auto-deploy from GitHub
4. **Test** → Verify production endpoints
5. **Monitor** → Check logs and health

This pipeline ensures smooth development and reliable production deployments with minimal configuration overhead.
