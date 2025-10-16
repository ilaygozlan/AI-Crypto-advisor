# Crypto AI Server

A production-ready Node.js server built with TypeScript, Express, and PostgreSQL.

## Features

- **TypeScript** with strict type checking
- **Express.js** with security middleware (helmet, cors, compression)
- **PostgreSQL** connection with connection pooling
- **Environment validation** with Zod
- **Structured logging** with Pino
- **Graceful shutdown** handling
- **Health checks** for server and database
- **ESLint & Prettier** for code quality

## API Endpoints

- `GET /health` - Server health check
- `GET /version` - Application version
- `GET /db/health` - Database health check

## Local Development

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment:**

   ```bash
   cp env.sample .env
   ```

   Edit `.env` with your values:

   ```
   NODE_ENV=development
   PORT=8080
   FRONTEND_URL=http://localhost:5173
   LOG_LEVEL=info
   DATABASE_URL=postgres://user:password@localhost:5432/dbname
   ```

3. **Run in development mode:**

   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Type check without building

## Render Deployment

1. **Create a new Web Service** on Render
2. **Connect your repository**
3. **Set build and start commands:**
   - Build Command: `npm run build`
   - Start Command: `npm start`
4. **Set environment variables:**
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NODE_ENV` - `production`
   - `FRONTEND_URL` - Your frontend URL
   - `LOG_LEVEL` - `info` (optional)

## Environment Variables

| Variable       | Description                  | Required | Default       |
| -------------- | ---------------------------- | -------- | ------------- |
| `NODE_ENV`     | Environment mode             | No       | `development` |
| `PORT`         | Server port                  | No       | `8080`        |
| `FRONTEND_URL` | Frontend URL for CORS        | Yes      | -             |
| `LOG_LEVEL`    | Logging level                | No       | `info`        |
| `DATABASE_URL` | PostgreSQL connection string | Yes      | -             |

## Database

The server uses PostgreSQL with connection pooling. SSL is automatically enabled for production environments.

## Security

- **Helmet** for security headers
- **CORS** configured for your frontend
- **Input validation** with Zod
- **Error handling** with proper status codes
- **No sensitive data** in logs

## Monitoring

- Health check endpoints for monitoring
- Structured JSON logging
- Graceful shutdown handling
- Database connection monitoring
