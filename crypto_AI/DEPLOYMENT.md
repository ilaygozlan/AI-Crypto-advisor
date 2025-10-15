# Railway Deployment Guide

This guide will help you deploy the Moveo AI Crypto Advisor application to Railway with both frontend and backend services.

## Prerequisites

- Railway account (free tier available)
- GitHub repository with this code
- Basic understanding of environment variables

## Important Note

This project uses **npm** (not pnpm) for package management. Railway will auto-detect the Node.js project and use the appropriate build commands. The `package-lock.json` file has been generated and is included in the repository for reliable, reproducible builds.

## Step-by-Step Deployment

### 1. Create Railway Project

1. Go to [Railway](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### 2. Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a PostgreSQL instance
4. Note the `DATABASE_URL` that will be available to your services

### 3. Deploy Backend API

1. In your Railway project, click "New"
2. Select "GitHub Repo" and choose your repository
3. **Configure the service**:
   - **Root Directory**: `/server`
   - Railway will auto-detect Node.js and use the build commands from `railway.json`
   - **Build Command**: `npm ci && npm run build && npm run migrate:deploy`
   - **Start Command**: `npm start`

4. **Add Environment Variables**:
   ```
   JWT_ACCESS_SECRET=your_64_character_secret_for_access_tokens_here
   JWT_REFRESH_SECRET=your_64_character_secret_for_refresh_tokens_here
   ACCESS_TOKEN_TTL=15m
   REFRESH_TOKEN_TTL=7d
   PORT=4000
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-url.up.railway.app
   ```

5. **Link PostgreSQL**:
   - In the backend service settings, go to "Variables"
   - Click "Add Reference"
   - Select your PostgreSQL service
   - Choose `DATABASE_URL`

6. **Deploy**: Click "Deploy" and wait for the build to complete

7. **Note the API URL**: Copy the generated URL (e.g., `https://your-api.up.railway.app`)

### 4. Deploy Frontend

1. In your Railway project, click "New"
2. Select "GitHub Repo" and choose your repository
3. **Configure the service**:
   - **Root Directory**: `/` (root)
   - Railway will auto-detect Node.js and use the build commands from `railway.json`
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm run serve:static`

4. **Add Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-api.up.railway.app
   ```

5. **Deploy**: Click "Deploy" and wait for the build to complete

6. **Note the Frontend URL**: Copy the generated URL (e.g., `https://your-frontend.up.railway.app`)

### 5. Update CORS Configuration

1. Go back to your **Backend API** service
2. Update the `CORS_ORIGIN` variable with your actual frontend URL:
   ```
   CORS_ORIGIN=https://your-frontend.up.railway.app
   ```
3. **Redeploy** the backend service

### 6. Test the Deployment

1. **Open your frontend URL** in a browser
2. **Test signup/login**:
   - Create a new account
   - Check that you're redirected to onboarding
   - Complete onboarding
   - Verify you can access the dashboard

3. **Test authentication**:
   - Refresh the page (should stay logged in)
   - Check browser dev tools for `refresh_token` cookie
   - Verify API calls work without errors

## Environment Variables Reference

### Backend (API Service)

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_ACCESS_SECRET` | 64+ character secret for access tokens | `abc123...` |
| `JWT_REFRESH_SECRET` | 64+ character secret for refresh tokens | `def456...` |
| `ACCESS_TOKEN_TTL` | Access token expiration | `15m` |
| `REFRESH_TOKEN_TTL` | Refresh token expiration | `7d` |
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment | `production` |
| `CORS_ORIGIN` | Allowed frontend origin | `https://app.up.railway.app` |
| `DATABASE_URL` | PostgreSQL connection (auto-injected) | `postgresql://...` |

### Frontend (Web Service)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `https://api.up.railway.app` |

## Troubleshooting

### Common Issues

**CORS Errors**
- Ensure `CORS_ORIGIN` matches your frontend URL exactly (HTTPS, no trailing slash)
- Check that the backend was redeployed after updating CORS_ORIGIN

**Authentication Issues**
- Verify JWT secrets are 64+ characters long
- Check that refresh token cookies are being set (httpOnly, secure)
- Ensure `withCredentials: true` is set in frontend API client

**Database Connection**
- Verify PostgreSQL service is linked to the backend
- Check that migrations ran successfully in build logs
- Ensure `DATABASE_URL` is available in backend environment

**Build Failures**
- Check that all environment variables are set
- Verify Node.js version compatibility (20+)
- Review build logs for specific error messages
- **"Cannot install with frozen-lockfile because pnpm-lock.yaml is absent"**: This project uses npm, not pnpm. Railway will auto-detect the Node.js project and use npm commands.
- **"undefined variable 'npm'"**: This was caused by incorrect nixpacks configuration. The nixpacks.toml files have been removed to let Railway auto-detect the Node.js project properly.

**Frontend Not Loading**
- Ensure `VITE_API_BASE_URL` is set correctly
- Check that the build completed successfully
- Verify the serve command is working

### Debugging Steps

1. **Check Railway Logs**:
   - Go to your service → "Deployments" → Click on latest deployment
   - Review build and runtime logs

2. **Test API Endpoints**:
   - Use curl or Postman to test `/healthz` endpoint
   - Verify database connectivity

3. **Check Browser Console**:
   - Look for CORS errors
   - Check network tab for failed requests
   - Verify cookies are being set

4. **Database Issues**:
   - Connect to PostgreSQL using Railway's database console
   - Check if tables were created by migrations

## Security Considerations

- **JWT Secrets**: Use cryptographically secure random strings (64+ characters)
- **HTTPS**: Railway provides HTTPS by default
- **CORS**: Restrict to your specific frontend domain
- **Cookies**: Refresh tokens are httpOnly and secure in production
- **Rate Limiting**: Backend includes rate limiting (100 req/15min per IP)

## Scaling

Railway automatically handles:
- **Horizontal scaling** based on traffic
- **Database connections** with connection pooling
- **SSL certificates** and HTTPS
- **CDN** for static assets

For production workloads, consider:
- **Database backups** (Railway Pro feature)
- **Monitoring** with Railway's built-in metrics
- **Custom domains** for professional appearance

## Cost Optimization

- **Free Tier**: Includes 500 hours of usage per month
- **Sleep Mode**: Services sleep after 5 minutes of inactivity
- **Database**: PostgreSQL included in free tier
- **Bandwidth**: 100GB included per month

## Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Community**: [Railway Discord](https://discord.gg/railway)
- **Status**: [status.railway.app](https://status.railway.app)
