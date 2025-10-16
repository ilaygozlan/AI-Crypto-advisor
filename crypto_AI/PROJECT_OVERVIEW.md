# AI Crypto Advisor - Project Overview

## General Overview

The **AI Crypto Advisor** is a full-stack web application that provides personalized cryptocurrency investment insights and real-time market data. The application combines real-time crypto market data from CoinGecko with AI-powered insights to help users make informed investment decisions.

### Key Features
- **User Authentication**: Secure JWT-based login/signup system
- **Real-time Crypto Data**: Live prices, charts, and market data via CoinGecko API
- **AI Insights**: Daily AI-generated market analysis and recommendations
- **Personalized Dashboard**: Customizable crypto portfolio tracking
- **User Preferences**: Investment type selection and asset preferences

### Technology Stack
- **Backend**: Node.js, Express.js, PostgreSQL
- **Frontend**: React 18, TypeScript, Vite
- **Authentication**: JWT tokens with httpOnly cookies
- **Database**: PostgreSQL with connection pooling
- **External APIs**: CoinGecko API, OpenRouter AI
- **UI Framework**: Tailwind CSS, Shadcn/ui components
- **State Management**: React Context, TanStack Query
- **Security**: Helmet, CORS, Rate limiting

### Workflow
1. User registers/logs in with email and password
2. User sets investment preferences (investor type, selected assets)
3. Dashboard displays personalized crypto data and AI insights
4. Real-time price updates and market analysis
5. User can vote on insights and track portfolio performance

## Project Structure

```
crypto_AI/
├── server/                          # Backend Node.js/Express application
│   ├── index.js                     # Main server entry point
│   ├── DB.js                        # PostgreSQL connection and initialization
│   ├── package.json                 # Backend dependencies
│   ├── routes/                      # API route definitions
│   │   ├── auth.js                  # Authentication endpoints
│   │   └── me.js                    # User data endpoints
│   ├── services/                    # Business logic layer
│   │   ├── user.service.js          # User CRUD operations
│   │   ├── userData.service.js      # User preferences management
│   │   └── token.service.js         # JWT token handling
│   ├── middlewares/                 # Express middleware
│   │   └── auth.js                  # JWT authentication middleware
│   └── utils/                       # Backend utilities
│       └── crypto.js                # Cryptographic helpers
├── src/                             # Frontend React application
│   ├── app/                         # Main app configuration
│   │   ├── App.tsx                  # Root component
│   │   ├── main.tsx                 # React entry point
│   │   ├── providers.tsx            # Context providers
│   │   └── router.tsx               # React Router configuration
│   ├── components/                  # Reusable UI components
│   │   ├── layout/                  # Layout components
│   │   │   ├── AppLayout.tsx        # Main app layout
│   │   │   ├── Navbar.tsx           # Navigation bar
│   │   │   ├── Footer.tsx           # Footer component
│   │   │   └── ProtectedRoute.tsx   # Route protection
│   │   ├── ui/                      # Shadcn/ui components
│   │   └── common/                  # Common components
│   ├── features/                    # Feature-based modules
│   │   ├── auth/                    # Authentication features
│   │   │   ├── components/          # Auth components
│   │   │   ├── pages/               # Auth pages
│   │   │   └── hooks/               # Auth hooks
│   │   ├── dashboard/               # Dashboard features
│   │   │   ├── components/          # Dashboard components
│   │   │   ├── hooks/               # Data fetching hooks
│   │   │   └── panels/              # Dashboard panels
│   │   ├── news/                    # News features
│   │   └── settings/                # Settings features
│   ├── lib/                         # Frontend utilities
│   │   ├── api/                     # API client and endpoints
│   │   ├── query/                   # TanStack Query configuration
│   │   ├── state/                   # State management
│   │   └── utils/                   # Frontend utilities
│   ├── types/                       # TypeScript type definitions
│   └── styles/                      # Global styles
├── public/                          # Static assets
├── package.json                     # Frontend dependencies
├── vite.config.ts                   # Vite configuration
├── tailwind.config.ts               # Tailwind CSS configuration
└── tsconfig.json                    # TypeScript configuration
```

### Folder Responsibilities

- **`/server`** - Backend logic, Express routes, database queries, middleware, and authentication
- **`/src`** - React frontend, UI components, state management, API calls
- **`/server/routes`** - API route definitions and controllers
- **`/server/services`** - Business logic for user data, token handling, external APIs
- **`/server/middlewares`** - Authentication, validation, and error handling
- **`/server/utils`** - Backend helper functions (crypto utilities, formatters)
- **`/src/features`** - Feature-based frontend modules (auth, dashboard, news)
- **`/src/components`** - Reusable UI components and layouts
- **`/src/lib`** - Frontend utilities, API clients, state management
- **`/src/types`** - TypeScript type definitions
- **`/public`** - Static assets, icons, and images

## API Documentation

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/login` | POST | No | User login with email/password, returns JWT |
| `/auth/signup` | POST | No | New user registration with preferences |
| `/auth/refresh` | POST | No | Refresh expired JWT token |
| `/auth/logout` | POST | Yes | Logout and invalidate tokens |
| `/me` | GET | Yes | Returns logged-in user information |
| `/me/data` | GET | Yes | Returns user investment preferences |
| `/health` | GET | No | Server health check |
| `/api/coinGecko/prices` | GET | Yes | Fetches crypto prices via backend proxy |
| `/api/coinGecko/markets` | GET | Yes | Fetches market data via backend proxy |
| `/api/coinGecko/chart/:coinId` | GET | Yes | Fetches chart data for specific coin |

### Authentication Flow
1. **Login/Signup**: Client sends credentials to `/auth/login` or `/auth/signup`
2. **Token Generation**: Server creates JWT access token and refresh token
3. **Cookie Storage**: Access token stored in httpOnly cookie, refresh token in separate cookie
4. **Request Authentication**: Client includes credentials in requests automatically
5. **Token Refresh**: Automatic refresh when access token expires

## Backend Architecture

### Request Flow
```
Client Request → Express Middleware → Route Handler → Service Layer → Database/External API → Response
```

### Key Components

#### 1. Authentication System
- **JWT Tokens**: Access tokens (15 min) and refresh tokens (7 days)
- **httpOnly Cookies**: Secure token storage, not accessible via JavaScript
- **Token Rotation**: Refresh tokens are rotated on each use
- **Middleware**: `requireAuth` middleware validates tokens on protected routes

#### 2. Database Integration
- **PostgreSQL**: Primary database with connection pooling
- **Tables**: `users`, `user_data`, `refresh_tokens`
- **Connection Management**: Automatic connection pooling and error handling
- **Migrations**: Database schema initialization on startup

#### 3. External API Integration
- **CoinGecko API**: Real-time crypto market data
- **Backend Proxy**: All external API calls go through backend for security
- **Caching**: In-memory caching for API responses (30s-2min TTL)
- **Rate Limiting**: Protection against API abuse

#### 4. Security Features
- **Helmet**: Security headers (CSP, HSTS)
- **CORS**: Restrictive cross-origin resource sharing
- **Rate Limiting**: Authentication endpoint protection (3 attempts/15min)
- **Input Validation**: Joi schema validation for all inputs
- **Error Sanitization**: Production-safe error logging

## Frontend Overview

### Architecture
- **React 18**: Modern React with hooks and context
- **TypeScript**: Full type safety throughout the application
- **Vite**: Fast development server and build tool
- **TanStack Query**: Server state management and caching

### Key Components

#### 1. Authentication System
- **AuthContext**: Global authentication state management
- **Protected Routes**: Route guards for authenticated users
- **Automatic Token Refresh**: Seamless token renewal
- **Login/Signup Forms**: Real-time validation and error handling

#### 2. Dashboard Layout
- **AppLayout**: Main application layout with navigation
- **Coin Prices Panel**: Real-time crypto price display with charts
- **AI Insight Section**: Daily AI-generated market analysis
- **User Preferences**: Investment type and asset selection

#### 3. State Management
- **React Context**: Global state for authentication and user data
- **TanStack Query**: Server state caching and synchronization
- **Local State**: Component-level state with useState/useReducer

#### 4. API Integration
- **Fetch-based Client**: Custom API client with automatic retry
- **Error Handling**: Centralized error handling with user-friendly messages
- **Loading States**: Skeleton loaders and loading indicators
- **Real-time Updates**: Polling for live data updates

## Environment & Deployment

### Required Environment Variables

#### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/crypto_advisor

# JWT Secrets
JWT_ACCESS_SECRET=your-access-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# External APIs
CG_API_KEY=your-coingecko-api-key
OPENROUTER_API_KEY=your-openrouter-api-key

# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Frontend (.env.local)
```bash
# Server Configuration
VITE_SERVER_URL=http://localhost:3000
```

### Local Development Setup

#### Backend
```bash
cd server
npm install
npm run dev
```

#### Frontend
```bash
npm install
npm run dev
```

### Deployment
- **Backend**: Deploy to Render, Railway, or AWS
- **Frontend**: Deploy to Vercel, Netlify, or static hosting
- **Database**: Use managed PostgreSQL (Render, Railway, AWS RDS)
- **Environment**: Set production environment variables
- **Domain**: Configure CORS for production domains

## How to Rebuild This Project from Scratch

### 1. Project Initialization
```bash
# Create project structure
mkdir crypto_AI
cd crypto_AI

# Initialize backend
mkdir server
cd server
npm init -y
npm install express cors helmet cookie-parser dotenv bcrypt jsonwebtoken pg morgan

# Initialize frontend
cd ..
npm create vite@latest . -- --template react-ts
npm install @tanstack/react-query react-router-dom framer-motion
npm install -D tailwindcss postcss autoprefixer
```

### 2. Essential Dependencies

#### Backend (server/package.json)
```json
{
  "dependencies": {
    "express": "^5.1.0",
    "cors": "^2.8.5",
    "helmet": "^8.1.0",
    "cookie-parser": "^1.4.7",
    "dotenv": "^17.2.3",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "pg": "^8.11.3",
    "morgan": "^1.10.1",
    "express-rate-limit": "^7.1.5",
    "joi": "^17.11.0"
  }
}
```

#### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "@tanstack/react-query": "^5.0.0",
    "framer-motion": "^10.0.0",
    "lucide-react": "^0.263.0"
  }
}
```

### 3. Core Files to Create

#### Backend Structure
- `server/index.js` - Main server file
- `server/DB.js` - Database connection
- `server/routes/auth.js` - Authentication routes
- `server/routes/me.js` - User data routes
- `server/services/user.service.js` - User business logic
- `server/services/token.service.js` - JWT handling
- `server/middlewares/auth.js` - Authentication middleware

#### Frontend Structure
- `src/app/App.tsx` - Main app component
- `src/app/providers.tsx` - Context providers
- `src/app/router.tsx` - Route configuration
- `src/lib/api.ts` - API client
- `src/contexts/AuthContext.tsx` - Authentication context
- `src/components/layout/ProtectedRoute.tsx` - Route protection
- `src/features/auth/pages/LoginPage.tsx` - Login page
- `src/features/dashboard/pages/DashboardPage.tsx` - Dashboard

### 4. Database Schema
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- User data table
CREATE TABLE user_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  investor_type VARCHAR(50) NOT NULL,
  selected_assets TEXT[] NOT NULL,
  selected_content_types TEXT[] NOT NULL,
  completed_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Refresh tokens table
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Startup Sequence
1. **Database Setup**: Initialize PostgreSQL and run schema
2. **Backend Start**: Start Express server with middleware
3. **Frontend Start**: Start Vite development server
4. **Environment**: Configure environment variables
5. **Testing**: Verify authentication and API endpoints

### 6. Key Implementation Notes
- **Security First**: Implement rate limiting, input validation, and secure token storage
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Type Safety**: Full TypeScript implementation for both frontend and backend
- **Performance**: Implement caching and optimize API calls
- **Testing**: Add unit tests for critical functionality
- **Documentation**: Maintain API documentation and code comments

This architecture provides a solid foundation for a production-ready crypto advisor application with proper security, scalability, and maintainability.
