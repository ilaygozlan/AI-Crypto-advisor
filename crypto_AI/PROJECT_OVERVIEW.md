# AI Crypto Advisor - Project Overview

## General Overview

The **AI Crypto Advisor** is a full-stack web application that provides personalized cryptocurrency investment insights and real-time market data. The application combines real-time crypto market data from CoinGecko with AI-powered insights to help users make informed investment decisions.

### Key Features
- **User Authentication**: Secure JWT-based login/signup system with rate limiting and lockout protection
- **Enhanced Onboarding**: 3-step wizard for user preferences (investor type, assets, content types)
- **Real-time Crypto Data**: Live prices, charts, and market data via CoinGecko API with Pro API support
- **CryptoPanic News Integration**: Real-time cryptocurrency news with personalized filtering and sentiment analysis
- **AI Insights Service**: Daily AI-generated market analysis using OpenRouter API with structured prompts and user-specific recommendations
- **Reddit Memes Integration**: Automated meme fetching from crypto subreddits with content filtering and NSFW protection
- **Interactive Voting System**: Like/dislike functionality for all content (news, prices, AI insights, memes) with optimistic updates and persistent storage
- **Personalized Dashboard**: Customizable crypto portfolio tracking with user preference-based content filtering
- **Settings Management**: Profile editing and preference viewing with secure logout
- **Dark Mode Support**: System preference detection with manual toggle
- **Responsive Design**: Mobile-first design with smooth animations and transitions
- **Content Personalization**: ML-based scoring system for news relevance based on user behavior
- **Automated Content Pipeline**: Scheduled tasks for meme fetching and AI insight generation
- **Advanced Data Processing**: Sophisticated JSON handling and content normalization for external APIs

### Technology Stack
- **Backend**: Node.js, Express.js, PostgreSQL
- **Frontend**: React 18, TypeScript, Vite
- **Authentication**: JWT tokens with httpOnly cookies, bcrypt password hashing
- **Database**: PostgreSQL with connection pooling and automatic migrations
- **External APIs**: CoinGecko API (Free & Pro), CryptoPanic API, OpenRouter AI, Reddit API
- **UI Framework**: Tailwind CSS, Shadcn/ui components, Framer Motion animations
- **State Management**: React Context, TanStack Query (React Query), Zustand for preferences
- **Security**: Helmet, CORS, Rate limiting, Input validation with Joi
- **Development Tools**: ESLint, Prettier, Vitest for testing
- **Icons**: Lucide React icon library
- **HTTP Client**: Custom fetch-based API client with retry logic
- **AI Integration**: OpenRouter API for LLM-powered insights with structured prompts
- **Content Automation**: Node-cron for scheduled tasks, Reddit API for meme fetching
- **Data Processing**: Advanced JSON handling and content normalization

### Workflow
1. User registers/logs in with email and password (with rate limiting protection)
2. New users complete 3-step onboarding: personal info, investor type selection, asset preferences, content type selection
3. Dashboard displays personalized content based on user preferences with tabbed interface
4. Real-time crypto prices, news from CryptoPanic, AI insights, and fun memes
5. Users can vote on all content (news, prices, insights, memes) with optimistic UI updates
6. Content personalization improves over time based on user voting behavior
7. Settings page allows profile management and preference viewing

## Project Structure

```
crypto_AI/
├── server/                          # Backend Node.js/Express application
│   ├── index.js                     # Main server entry point
│   ├── DB.js                        # PostgreSQL connection and initialization
│   ├── package.json                 # Backend dependencies
│   ├── routes/                      # API route definitions
│   │   ├── auth.js                  # Authentication endpoints (login, signup, refresh, logout)
│   │   ├── me.js                    # User data endpoints (/me, /me/data)
│   │   ├── insights.js              # AI insights endpoints (/api/insights)
│   │   └── memes.js                 # Memes API endpoints (/api/memes)
│   ├── services/                    # Business logic layer
│   │   ├── user.service.js          # User CRUD operations
│   │   ├── userData.service.js      # User preferences management
│   │   ├── token.service.js         # JWT token handling
│   │   ├── insightService.js        # AI insights generation and management
│   │   ├── insightPrompt.js         # AI prompt engineering and message building
│   │   ├── llmOpenRouter.js         # OpenRouter API integration for LLM calls
│   │   ├── memes.service.js         # Reddit memes fetching and processing
│   │   └── redditClient.js          # Reddit API client and authentication
│   ├── middlewares/                 # Express middleware
│   │   └── auth.js                  # JWT authentication middleware
│   ├── security/                    # Security utilities
│   │   └── rateLimit.js             # Rate limiting configuration
│   ├── repos/                       # Data access layer
│   │   ├── refresh-token.repo.js    # Refresh token repository
│   │   ├── userDataRepo.js          # User data repository
│   │   └── insightsRepo.js          # AI insights repository
│   ├── memeDB/                      # Memes database management
│   │   └── memeDB.js                # Memes database connection and initialization
│   ├── scripts/                     # Utility scripts
│   │   ├── get-reddit-refresh-token.js # Reddit OAuth token generation
│   │   └── testReddit.js            # Reddit API testing script
│   └── utils/                       # Backend utilities
│       └── crypto.js                # Cryptographic helpers
├── src/                             # Frontend React application
│   ├── app/                         # Main app configuration
│   │   ├── App.tsx                  # Root component
│   │   ├── main.tsx                 # React entry point
│   │   ├── providers.tsx            # Context providers (QueryClient, Auth)
│   │   ├── router.tsx               # React Router configuration
│   │   └── data/                    # Mock data for development
│   ├── components/                  # Reusable UI components
│   │   ├── layout/                  # Layout components
│   │   │   ├── AppLayout.tsx        # Main app layout
│   │   │   ├── Navbar.tsx           # Navigation bar with dark mode toggle
│   │   │   ├── Footer.tsx           # Footer component
│   │   │   └── ProtectedRoute.tsx   # Route protection
│   │   ├── ui/                      # Shadcn/ui components
│   │   │   ├── button.tsx           # Button component
│   │   │   ├── card.tsx             # Card components
│   │   │   ├── input.tsx            # Input component
│   │   │   ├── select.tsx           # Select component
│   │   │   ├── toast.tsx            # Toast notifications
│   │   │   ├── IconTabs.tsx         # Custom tab component
│   │   │   └── ...                  # Other UI components
│   │   ├── common/                  # Common components
│   │   │   ├── Card.tsx             # Custom card wrapper
│   │   │   ├── Skeleton.tsx         # Loading skeletons
│   │   │   ├── EmptyState.tsx       # Empty state component
│   │   │   ├── VoteButtons.tsx      # Voting interface
│   │   │   └── SectionHeader.tsx    # Section headers
│   │   ├── Brand.tsx                # Brand/logo component
│   │   ├── Protected.tsx            # Protected content wrapper
│   │   └── PreferencesIndicator.tsx # User preferences display
│   ├── features/                    # Feature-based modules
│   │   ├── auth/                    # Authentication features
│   │   │   ├── components/          # Auth components
│   │   │   │   ├── AuthForm.tsx     # Login form
│   │   │   │   └── EnhancedSignupForm.tsx # 3-step signup wizard
│   │   │   └── pages/               # Auth pages
│   │   │       ├── LoginPage.tsx    # Login page
│   │   │       └── SignupPage.tsx   # Signup page
│   │   ├── dashboard/               # Dashboard features
│   │   │   ├── DashboardView.tsx    # Main dashboard view with tabs
│   │   │   ├── components/          # Dashboard components
│   │   │   │   ├── AIInsightSection.tsx # AI insights display
│   │   │   │   ├── CoinChart.tsx    # Price charts
│   │   │   │   ├── MemeSection.tsx  # Meme display
│   │   │   │   ├── NewsSection.tsx  # News display
│   │   │   │   ├── PricesSection.tsx # Prices display
│   │   │   │   └── PriceRow.tsx     # Individual price row
│   │   │   ├── hooks/               # Data fetching hooks
│   │   │   │   ├── useAIInsight.ts  # AI insights hook
│   │   │   │   ├── useChart.ts      # Chart data hook
│   │   │   │   ├── useMeme.ts       # Meme data hook
│   │   │   │   ├── useNews.ts       # News data hook
│   │   │   │   ├── usePrices.ts     # Prices data hook
│   │   │   │   ├── useTodayInsight.ts # Today's AI insight hook
│   │   │   │   └── useVote.ts       # Voting hook
│   │   │   ├── panels/              # Dashboard panels
│   │   │   │   ├── AiInsightPanel.tsx # AI insights panel
│   │   │   │   ├── CoinPricesPanel.tsx # Prices panel
│   │   │   │   ├── MarketNewsPanel.tsx # News panel
│   │   │   │   └── MemePanel.tsx    # Meme panel
│   │   │   └── pages/               # Dashboard pages
│   │   │       └── DashboardPage.tsx # Dashboard page wrapper
│   │   ├── news/                    # News features
│   │   │   ├── components/          # News components
│   │   │   │   ├── NewsCard.tsx     # Individual news card
│   │   │   │   └── NewsFeed.tsx     # News feed with filtering
│   │   │   ├── hooks/               # News hooks
│   │   │   │   └── useCryptoPanicPosts.ts # CryptoPanic integration
│   │   │   └── pages/               # News pages
│   │   │       └── NewsPage.tsx     # News page
│   │   ├── onboarding/              # Onboarding features (future)
│   │   │   ├── components/          # Onboarding components
│   │   │   └── pages/               # Onboarding pages
│   │   └── settings/                # Settings features
│   │       ├── components/          # Settings components
│   │       │   ├── PreferencesForm.tsx # Preferences display
│   │       │   └── ProfileForm.tsx  # Profile management
│   │       └── pages/               # Settings pages
│   │           └── SettingsPage.tsx # Settings page
│   ├── lib/                         # Frontend utilities
│   │   ├── api/                     # API client and endpoints
│   │   │   ├── api.ts               # Main API client
│   │   │   ├── coinGecko.ts         # CoinGecko API integration
│   │   │   ├── cryptopanic.ts       # CryptoPanic API service
│   │   │   └── newEndpoints.ts      # New API endpoints
│   │   ├── query/                   # TanStack Query configuration
│   │   │   └── queryClient.ts       # Query client setup
│   │   ├── state/                   # State management
│   │   │   └── prefs.store.ts       # Preferences store
│   │   ├── services/                # Frontend services
│   │   └── utils/                   # Frontend utilities
│   │       ├── coinMapping.ts       # Coin ID mapping
│   │       ├── cryptoPanic.ts       # CryptoPanic utilities
│   │       ├── cryptoPrefs.ts       # Crypto preferences
│   │       ├── format.ts            # Formatting utilities
│   │       ├── guards.ts            # Type guards
│   │       ├── scoring.ts           # Content scoring algorithm
│   │       └── utils.ts             # General utilities
│   ├── contexts/                    # React contexts
│   │   └── AuthContext.tsx          # Authentication context
│   ├── hooks/                       # Custom hooks
│   │   ├── useAuthLockout.ts        # Authentication lockout hook
│   │   └── useToast.ts              # Toast notifications hook
│   ├── state/                       # State management
│   │   └── useAuth.ts               # Authentication state
│   ├── types/                       # TypeScript type definitions
│   │   ├── auth.ts                  # Authentication types
│   │   ├── common.ts                # Common types
│   │   └── dashboard.ts             # Dashboard types
│   ├── styles/                      # Global styles
│   │   └── globals.css              # Global CSS with Tailwind
│   └── vite-env.d.ts                # Vite environment types
├── public/                          # Static assets
│   ├── favicon.svg                  # Favicon
│   └── vite.svg                     # Vite logo
├── dist/                            # Build output
│   ├── assets/                      # Bundled assets
│   ├── mocks/                       # Mock data files
│   └── index.html                   # Built HTML
├── package.json                     # Frontend dependencies
├── vite.config.ts                   # Vite configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── components.json                  # Shadcn/ui configuration
├── postcss.config.js                # PostCSS configuration
├── env.development                  # Development environment
├── env.production                   # Production environment
├── env.example                      # Environment template
├── docker-compose.dev.yml           # Docker development setup
├── railway.json                     # Railway deployment config
├── nixpacks.toml                    # Nixpacks configuration
├── CRYPTOPANIC_SETUP.md             # CryptoPanic setup guide
├── BACKEND_INTEGRATION.md           # Backend integration guide
└── PROJECT_OVERVIEW.md              # This file
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

### Authentication Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/login` | POST | No | User login with email/password, returns JWT tokens |
| `/auth/signup` | POST | No | New user registration with preferences (3-step onboarding) |
| `/auth/refresh` | POST | No | Refresh expired JWT token using refresh token |
| `/auth/logout` | POST | Yes | Logout and invalidate all tokens |

### User Data Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/me` | GET | Yes | Returns logged-in user basic information |
| `/me/data` | GET | Yes | Returns user investment preferences and onboarding data |
| `/db/debug` | GET | Yes | Database debug endpoint (development only) |

### External API Proxies

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/coinGecko/prices` | GET | Yes | Fetches crypto prices via backend proxy |
| `/api/coinGecko/markets` | GET | Yes | Fetches market data via backend proxy |
| `/api/coinGecko/chart/:coinId` | GET | Yes | Fetches chart data for specific coin |

### Dashboard API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/dashboard/news` | GET | Yes | Fetches personalized news feed |
| `/dashboard/prices` | GET | Yes | Fetches user's selected crypto prices |
| `/dashboard/ai-insight` | GET | Yes | Fetches AI-generated market insights |
| `/dashboard/meme` | GET | Yes | Fetches daily crypto meme |
| `/dashboard/vote` | POST | Yes | Submit vote for content (like/dislike) |

### AI Insights API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/insights/today` | GET | Yes | Fetches today's AI insight for user (with user_id query param) |

### Memes API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/memes` | GET | Yes | Fetches memes with pagination and filtering (limit, sub, cursor params) |
| `/api/memes/refresh` | POST | Yes | Manually triggers meme fetching from Reddit |

### System Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/health` | GET | No | Server health check |

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
- **Tables**: `users`, `user_data`, `refresh_tokens`, `insights`, `memes`
- **Connection Management**: Automatic connection pooling and error handling
- **Migrations**: Database schema initialization on startup
- **Dual Database Setup**: Separate connections for main app and memes data
- **JSONB Support**: Advanced JSON storage for AI insights and content metadata

#### 3. External API Integration
- **CoinGecko API**: Real-time crypto market data
- **OpenRouter API**: AI-powered insights generation with structured prompts
- **Reddit API**: Automated meme fetching from crypto subreddits
- **Backend Proxy**: All external API calls go through backend for security
- **Caching**: In-memory caching for API responses (30s-2min TTL)
- **Rate Limiting**: Protection against API abuse
- **OAuth Integration**: Reddit OAuth for secure API access
- **Content Filtering**: NSFW detection and content moderation

#### 4. AI and Automation Services
- **AI Insights Generation**: Daily personalized market analysis using OpenRouter API
- **Structured Prompts**: Advanced prompt engineering for consistent AI responses
- **Content Processing**: JSON parsing and normalization for AI-generated content
- **Scheduled Tasks**: Node-cron for automated meme fetching and content updates
- **Reddit Integration**: Automated content curation from crypto subreddits
- **Content Moderation**: NSFW filtering and quality control for user-generated content
- **Data Persistence**: AI insights stored with metadata for analytics and improvement

#### 5. Security Features
- **Helmet**: Security headers (CSP, HSTS, X-Frame-Options)
- **CORS**: Restrictive cross-origin resource sharing with environment-based origins
- **Rate Limiting**: Authentication endpoint protection (3 attempts/15min) with lockout system
- **Input Validation**: Joi schema validation for all inputs with sanitization
- **Error Sanitization**: Production-safe error logging with detailed development logging
- **Password Security**: bcrypt hashing with salt rounds
- **Token Security**: JWT tokens with expiration, rotation, and secure storage

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
- **AppLayout**: Main application layout with navigation and dark mode toggle
- **DashboardView**: Tabbed interface with personalized content filtering
- **Coin Prices Panel**: Real-time crypto price display with charts and voting
- **AI Insight Section**: Daily AI-generated market analysis with regeneration
- **News Panel**: CryptoPanic integration with personalized filtering and sentiment analysis
- **Meme Panel**: Daily crypto memes with community voting
- **User Preferences**: Investment type and asset selection with 3-step onboarding

#### 3. State Management
- **React Context**: Global state for authentication and user data
- **TanStack Query**: Server state caching and synchronization with optimistic updates
- **Zustand**: Preferences and local state management
- **Local State**: Component-level state with useState/useReducer
- **Custom Hooks**: Specialized hooks for data fetching and business logic

#### 4. API Integration
- **Fetch-based Client**: Custom API client with automatic retry and error handling
- **CoinGecko Integration**: Direct API integration with Pro API support
- **CryptoPanic Integration**: Real-time news with filtering and personalization
- **Error Handling**: Centralized error handling with user-friendly messages and fallbacks
- **Loading States**: Skeleton loaders, loading indicators, and empty states
- **Real-time Updates**: Polling for live data updates with stale-while-revalidate strategy

## Advanced Features

### CryptoPanic News Integration
- **Real-time News**: Integration with CryptoPanic API for live cryptocurrency news
- **Personalized Filtering**: News filtered based on user's selected cryptocurrencies and investment type
- **Sentiment Analysis**: Uses CryptoPanic's built-in sentiment scoring for content relevance
- **Smart Filtering**: 
  - Conservative investors see "important" news (reliable, high-impact stories)
  - Day traders see "hot" and "rising" news (trending, popular stories)
  - Moderate investors see "important" and "hot" news
- **Fallback System**: Graceful degradation to mock data if API is unavailable
- **Rate Limiting**: Respects API rate limits with proper error handling

### Content Personalization System
- **ML-based Scoring**: Algorithm that scores news relevance based on user behavior
- **Vote-based Learning**: System learns from user votes to improve content recommendations
- **Weight Adjustment**: Dynamic weight adjustment based on user preferences and voting patterns
- **Asset Relevance**: Content scoring considers user's selected cryptocurrency assets
- **Investor Type Matching**: Content filtered and scored based on user's investment style
- **Persistent Learning**: User preferences and voting history stored for continuous improvement

### AI Insights Generation System
- **OpenRouter Integration**: Advanced LLM API integration for market analysis
- **Structured Prompts**: Sophisticated prompt engineering for consistent AI responses
- **User-Specific Analysis**: Personalized insights based on user's investment type and asset preferences
- **Daily Generation**: Automated daily insight creation with caching and regeneration
- **Content Parsing**: Advanced JSON parsing and normalization for AI-generated content
- **Source Attribution**: AI insights include source references and metadata
- **Token Management**: Efficient token usage tracking and cost optimization

### Reddit Memes Automation
- **Multi-Subreddit Fetching**: Automated content curation from multiple crypto subreddits
- **Content Filtering**: NSFW detection and quality control for user-generated content
- **Image Processing**: Advanced image URL extraction and validation
- **Scheduled Updates**: Hourly cron jobs for fresh content delivery
- **Pagination Support**: Efficient content loading with cursor-based pagination
- **OAuth Integration**: Secure Reddit API access with token refresh
- **Content Moderation**: Automated filtering of inappropriate or low-quality content

### Interactive Voting System
- **Universal Voting**: Like/dislike functionality for all content types (news, prices, insights, memes)
- **Optimistic Updates**: Immediate UI feedback with server synchronization
- **Vote Persistence**: Votes saved to backend with user association
- **Visual Feedback**: Active states, vote counts, and hover effects
- **Accessibility**: Keyboard navigation and screen reader support
- **Real-time Sync**: Vote counts updated across all users in real-time

### Enhanced Authentication & Security
- **Rate Limiting**: Login attempt limiting with progressive lockout (3 attempts/15min)
- **Lockout Protection**: Automatic lockout system with countdown timer
- **Token Rotation**: Refresh tokens rotated on each use for enhanced security
- **Secure Storage**: httpOnly cookies for token storage, not accessible via JavaScript
- **Input Validation**: Real-time form validation with user-friendly error messages
- **Error Handling**: Professional error messages with appropriate retry logic

### Dark Mode & UI/UX
- **System Detection**: Automatically detects user's system preference
- **Manual Toggle**: User-controlled theme switching with persistent storage
- **Smooth Transitions**: Animated theme changes with Framer Motion
- **Responsive Design**: Mobile-first design with breakpoint optimization
- **Accessibility**: WCAG compliant with proper contrast ratios and focus states
- **Loading States**: Comprehensive skeleton loaders and loading indicators

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
OPENROUTER_MODEL=openrouter/auto

# Reddit API Configuration
REDDIT_CLIENT_ID=your-reddit-client-id
REDDIT_CLIENT_SECRET=your-reddit-client-secret
REDDIT_USER_AGENT=your-app-name/1.0.0
REDDIT_REFRESH_TOKEN=your-reddit-refresh-token

# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Frontend (env.development / env.production)
```bash
# Server Configuration
VITE_SERVER_URL=http://localhost:3000

# CryptoPanic API
VITE_CRYPTOPANIC_API_KEY=your_cryptopanic_api_key

# App Configuration
VITE_APP_NAME=AI Crypto Advisor
VITE_API_BASE_URL=https://api.example.com
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
npm start
```

### Deployment
- **Backend**: Deploy to Render, Railway, or AWS with automatic database migrations
- **Frontend**: Deploy to Vercel, Netlify, or static hosting with environment variables
- **Database**: Use managed PostgreSQL (Render, Railway, AWS RDS) with connection pooling
- **Environment**: Set production environment variables for all services (including Reddit and OpenRouter APIs)
- **Domain**: Configure CORS for production domains and SSL certificates
- **Docker**: Docker Compose setup available for containerized deployment
- **Railway**: Pre-configured with railway.json and nixpacks.toml for easy deployment
- **Monitoring**: Health check endpoints and error logging for production monitoring
- **Scheduled Tasks**: Ensure cron jobs for meme fetching and AI insights run in production
- **API Rate Limits**: Configure rate limiting for external API calls (Reddit, OpenRouter)
- **Content Moderation**: Implement production-ready content filtering and NSFW detection

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
    "pg": "^8.16.3",
    "morgan": "^1.10.1",
    "express-rate-limit": "^8.1.0",
    "joi": "^17.11.0",
    "node-cron": "^4.2.1",
    "node-fetch": "^3.3.2",
    "snoowrap": "^1.23.0"
  },
  "devDependencies": {
    "reddit-oauth-helper": "^0.3.2"
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
- `server/index.js` - Main server file with scheduled tasks
- `server/DB.js` - Database connection and schema initialization
- `server/routes/auth.js` - Authentication routes
- `server/routes/me.js` - User data routes
- `server/routes/insights.js` - AI insights API routes
- `server/routes/memes.js` - Memes API routes
- `server/services/user.service.js` - User business logic
- `server/services/token.service.js` - JWT handling
- `server/services/insightService.js` - AI insights generation
- `server/services/llmOpenRouter.js` - OpenRouter API integration
- `server/services/memes.service.js` - Reddit memes fetching
- `server/services/redditClient.js` - Reddit API client
- `server/middlewares/auth.js` - Authentication middleware
- `server/repos/insightsRepo.js` - AI insights data access
- `server/memeDB/memeDB.js` - Memes database management

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

-- AI insights table
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date_key TEXT NOT NULL,
  provider TEXT DEFAULT 'openrouter',
  model TEXT DEFAULT 'openrouter/auto',
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  title TEXT,
  tl_dr TEXT,
  content_md TEXT,
  content_json JSONB,
  sources JSONB DEFAULT '[]',
  generated_at TIMESTAMP DEFAULT NOW()
);

-- Memes table
CREATE TABLE memes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reddit_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subreddit TEXT NOT NULL,
  author TEXT,
  score INTEGER DEFAULT 0,
  num_comments INTEGER DEFAULT 0,
  source_url TEXT,
  is_nsfw BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  reddit_created_at TIMESTAMP
);
```

### 5. Startup Sequence
1. **Database Setup**: Initialize PostgreSQL and run schema (including insights and memes tables)
2. **Backend Start**: Start Express server with middleware and scheduled tasks
3. **AI Services**: Initialize OpenRouter API client and insight generation
4. **Reddit Integration**: Setup Reddit OAuth and start meme fetching cron job
5. **Frontend Start**: Start Vite development server
6. **Environment**: Configure environment variables for all external APIs
7. **Testing**: Verify authentication, API endpoints, and automated services

### 6. Key Implementation Notes
- **Security First**: Implement rate limiting, input validation, and secure token storage
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Type Safety**: Full TypeScript implementation for both frontend and backend
- **Performance**: Implement caching and optimize API calls
- **Testing**: Add unit tests for critical functionality
- **Documentation**: Maintain API documentation and code comments

## Current Implementation Status

### ✅ Completed Features
- **Authentication System**: Complete JWT-based auth with rate limiting and lockout protection
- **User Onboarding**: 3-step wizard for preferences (investor type, assets, content types)
- **Dashboard Interface**: Tabbed interface with personalized content filtering
- **CryptoPanic Integration**: Real-time news with personalized filtering and sentiment analysis
- **CoinGecko Integration**: Real-time crypto prices with Pro API support
- **AI Insights Service**: Daily AI-generated market analysis using OpenRouter API with structured prompts
- **Reddit Memes Integration**: Automated meme fetching from crypto subreddits with content filtering
- **Voting System**: Universal like/dislike functionality for all content types
- **Content Personalization**: ML-based scoring system for news relevance
- **Settings Management**: Profile editing and preference viewing
- **Dark Mode**: System detection with manual toggle and smooth transitions
- **Responsive Design**: Mobile-first design with comprehensive loading states
- **Security**: Rate limiting, input validation, secure token storage, and error handling
- **Automated Content Pipeline**: Scheduled tasks for meme fetching and AI insight generation
- **Advanced Data Processing**: Sophisticated JSON handling and content normalization

### 🔄 In Progress / Future Enhancements
- **Onboarding Flow**: Dedicated onboarding pages (currently integrated in signup)
- **Advanced Charts**: Interactive price charts with technical indicators
- **Portfolio Tracking**: User portfolio management and performance tracking
- **Push Notifications**: Real-time alerts for price movements and news
- **Social Features**: User profiles, following, and community features
- **Advanced AI**: More sophisticated AI insights with market predictions
- **Mobile App**: React Native mobile application
- **Analytics**: User behavior analytics and content performance metrics

### 🛠 Technical Debt & Improvements
- **Testing**: Comprehensive unit and integration test coverage
- **Performance**: Code splitting, lazy loading, and bundle optimization
- **Accessibility**: Enhanced WCAG compliance and screen reader support
- **Internationalization**: Multi-language support
- **Offline Support**: Service worker for offline functionality
- **Real-time Updates**: WebSocket integration for live data updates

This architecture provides a solid foundation for a production-ready crypto advisor application with proper security, scalability, and maintainability. The current implementation includes all core features with room for future enhancements and scaling.
