# AI Crypto Advisor - Complete Project Documentation

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Complete Folder Structure](#complete-folder-structure)
- [Backend Structure (server/)](#backend-structure-server)
- [Frontend Structure (src/)](#frontend-structure-src)
- [API Endpoints Documentation](#api-endpoints-documentation)
- [Key Features & Components](#key-features--components)
- [Database Schema](#database-schema)
- [Deployment & Configuration](#deployment--configuration)
- [Troubleshooting Guide](#troubleshooting-guide)

---

## 🎯 Project Overview

The **AI Crypto Advisor** is a production-grade full-stack web application that provides personalized cryptocurrency investment insights and real-time market data. The application combines real-time crypto market data from CoinGecko with AI-powered insights to help users make informed investment decisions.

### 🚀 Key Features
- **User Authentication:** Secure JWT-based login/signup system with rate limiting
- **Enhanced Onboarding:** 3-step wizard for user preferences (investor type, assets, content types)
- **Real-time Crypto Data:** Live prices, charts, and market data via CoinGecko API
- **CryptoPanic News Integration:** Real-time cryptocurrency news with personalized filtering
- **AI Insights Service:** Daily AI-generated market analysis using OpenRouter API
- **Reddit Memes Integration:** Automated meme fetching from crypto subreddits
- **Interactive Voting System:** Like/dislike functionality for all content types
- **Personalized Dashboard:** Customizable crypto portfolio tracking
- **Dark Mode Support:** System preference detection with manual toggle
- **Responsive Design:** Mobile-first design with smooth animations

---

## 🏗️ System Architecture

```
crypto_AI/                           # Root project directory
├── server/                          # Backend Node.js/Express application
│   ├── index.js                     # Main server entry point with middleware setup
│   ├── DB.js                        # PostgreSQL connection and schema initialization
│   ├── package.json                 # Backend dependencies and scripts
│   ├── routes/                      # API route definitions
│   │   ├── auth.js                  # Authentication endpoints (login, signup, refresh, logout)
│   │   ├── me.js                    # User data endpoints (/me, /me/data)
│   │   ├── insights.js              # AI insights endpoints (/api/insights)
│   │   ├── memes.js                 # Memes API endpoints (/api/memes)
│   │   ├── news.js                  # News API endpoints (/api/news)
│   │   ├── dashboard.js             # Dashboard API endpoints (/dashboard/*)
│   │   └── reactions.js             # User reactions API endpoints (/api/reactions)
│   ├── services/                    # Business logic layer
│   │   ├── user.service.js          # User CRUD operations
│   │   ├── userData.service.js      # User preferences management
│   │   ├── token.service.js         # JWT token handling
│   │   ├── insightService.js        # AI insights generation and management
│   │   ├── llmOpenRouter.js         # OpenRouter API integration for LLM calls
│   │   ├── memes.service.js         # Reddit memes fetching and processing
│   │   ├── news.service.js          # CryptoPanic news integration
│   │   └── redditClient.js          # Reddit API client and authentication
│   ├── middlewares/                  # Express middleware
│   │   └── auth.js                  # JWT authentication middleware
│   ├── security/                    # Security utilities
│   │   └── rateLimit.js             # Rate limiting configuration
│   ├── repos/                       # Data access layer
│   │   ├── refresh-token.repo.js    # Refresh token repository
│   │   ├── userDataRepo.js          # User data repository
│   │   └── insightsRepo.js          # AI insights repository
│   ├── memeDB/                      # Memes database management
│   │   └── memeDB.js                # Memes database connection
│   ├── scripts/                     # Utility scripts
│   │   ├── get-reddit-refresh-token.js # Reddit OAuth token generation
│   │   └── testReddit.js            # Reddit API testing script
│   └── utils/                       # Backend utilities
│       └── crypto.js                # Cryptographic helpers
├── src/                             # Frontend React application
│   ├── app/                         # Main app configuration
│   │   ├── App.tsx                  # Root component
│   │   ├── main.tsx                 # React entry point
│   │   ├── providers.tsx             # Context providers (QueryClient, Auth)
│   │   ├── router.tsx               # React Router configuration
│   │   └── data/                    # Mock data for development
│   ├── components/                  # Reusable UI components
│   │   ├── layout/                  # Layout components
│   │   │   ├── AppLayout.tsx        # Main app layout
│   │   │   ├── Navbar.tsx           # Navigation bar with dark mode toggle
│   │   │   ├── Footer.tsx            # Footer component
│   │   │   └── ProtectedRoute.tsx    # Route protection
│   │   ├── ui/                      # Shadcn/ui components
│   │   │   ├── button.tsx           # Button component
│   │   │   ├── card.tsx             # Card components
│   │   │   ├── input.tsx            # Input component
│   │   │   ├── select.tsx           # Select component
│   │   │   ├── toast.tsx            # Toast notifications
│   │   │   └── IconTabs.tsx         # Custom tab component
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
│   │   │       └── SignupPage.tsx  # Signup page
│   │   ├── dashboard/               # Dashboard features
│   │   │   ├── DashboardView.tsx    # Main dashboard view with tabs
│   │   │   ├── components/          # Dashboard components
│   │   │   │   ├── AIInsightSection.tsx # AI insights display
│   │   │   │   ├── CoinChart.tsx  # Price charts
│   │   │   │   ├── MemeSection.tsx # Meme display
│   │   │   │   ├── NewsSection.tsx # News display
│   │   │   │   ├── PricesSection.tsx # Prices display
│   │   │   │   └── PriceRow.tsx    # Individual price row
│   │   │   ├── hooks/               # Data fetching hooks
│   │   │   │   ├── useAIInsight.ts # AI insights hook
│   │   │   │   ├── useChart.ts     # Chart data hook
│   │   │   │   ├── useMeme.ts      # Meme data hook
│   │   │   │   ├── useNews.ts      # News data hook
│   │   │   │   ├── usePrices.ts    # Prices data hook
│   │   │   │   ├── useTodayInsight.ts # Today's AI insight hook
│   │   │   │   └── useVote.ts      # Voting hook
│   │   │   ├── panels/             # Dashboard panels
│   │   │   │   ├── AiInsightPanel.tsx # AI insights panel
│   │   │   │   ├── CoinPricesPanel.tsx # Prices panel
│   │   │   │   ├── MarketNewsPanel.tsx # News panel
│   │   │   │   └── MemePanel.tsx   # Meme panel
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
│   │   └── settings/                 # Settings features
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
│   │   ├── common.ts                 # Common types
│   │   └── dashboard.ts             # Dashboard types
│   ├── styles/                      # Global styles
│   │   └── globals.css              # Global CSS with Tailwind
│   └── vite-env.d.ts                # Vite environment types
├── public/                          # Static assets
│   ├── favicon.svg                  # Favicon
│   └── vite.svg                     # Vite logo
├── dist/                            # Build output
│   ├── assets/                      # Bundled assets
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
├── nixpacks.toml                    # Nixpacks configuration
├── CRYPTOPANIC_SETUP.md             # CryptoPanic setup guide
├── BACKEND_INTEGRATION.md           # Backend integration guide
├── PROJECT_OVERVIEW.md              # Project overview
├── S3-DEPLOYMENT-GUIDE.md           # S3 deployment guide
└── README.md                        # Main project documentation
```

---

## 🛠️ Technology Stack

### Frontend
- **React 18 + TypeScript** - Modern React with hooks and context
- **Vite** - Fast development server and build tool
- **Tailwind CSS + Shadcn/ui** - Utility-first CSS framework with component library
- **React Router v6** - Client-side routing
- **TanStack Query** - Server state management and caching
- **Framer Motion** - Animation library
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls

### Backend
- **Node.js + Express.js** - Server runtime and web framework
- **PostgreSQL** - Primary database with connection pooling
- **JWT Authentication** - Token-based authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS + Rate Limiting** - Cross-origin and rate limiting protection

### External APIs
- **CoinGecko API** - Real-time cryptocurrency data
- **CryptoPanic API** - Cryptocurrency news
- **OpenRouter API** - AI-powered insights
- **Reddit API** - Meme content

### Development Tools
- **ESLint + Prettier** - Code linting and formatting
- **Vitest** - Testing framework
- **Docker Support** - Containerization
- **Railway Deployment** - Cloud deployment platform

---

## 🔧 Backend Structure (server/)

### 📁 Core Files

**index.js** - Main server entry point
- Express server setup with middleware configuration
- CORS setup for cross-origin requests
- Route mounting for all API endpoints
- Database initialization and cron job startup
- Health check and CORS test endpoints

**DB.js** - Database connection and schema
- PostgreSQL connection pool configuration
- Database schema initialization with table creation
- Index setup for performance optimization
- Table relationships and constraints

**package.json** - Backend dependencies
- Express.js and related middleware
- PostgreSQL client and authentication libraries
- External API clients (Reddit, OpenRouter)
- Development and testing dependencies

### 🛣️ Routes Directory (server/routes/)

**auth.js** - Authentication endpoints
- `POST /auth/login` - User login with email/password
- `POST /auth/signup` - User registration with onboarding data
- `POST /auth/refresh` - JWT token refresh
- `POST /auth/logout` - User logout and token invalidation

**me.js** - User data endpoints
- `GET /me` - Returns current user information
- `GET /me/data` - Returns user preferences and onboarding data

**insights.js** - AI insights API
- `GET /api/insights/today` - Fetches today's AI insight for user

**memes.js** - Memes API endpoints
- `GET /api/memes` - Fetches memes with pagination and filtering
- `POST /api/memes/refresh` - Manually triggers meme fetching from Reddit

**news.js** - News API endpoints
- `GET /api/news` - Fetches personalized crypto news from CryptoPanic

**dashboard.js** - Dashboard API endpoints
- `POST /dashboard/vote` - Submit vote for content with metadata

**reactions.js** - User reactions API
- `POST /api/reactions` - Save/update user reaction for any content type

### ⚙️ Services Directory (server/services/)

**user.service.js** - User CRUD operations
- User registration and authentication
- Profile management and data retrieval
- Password hashing and validation

**userData.service.js** - User preferences management
- Onboarding data storage and retrieval
- User preference updates
- Investment type and asset management

**token.service.js** - JWT token handling
- Access token generation and validation
- Refresh token management
- Token rotation and security

**insightService.js** - AI insights generation
- Daily AI insight creation using OpenRouter API
- User-specific market analysis
- Content regeneration and caching

**llmOpenRouter.js** - OpenRouter API integration
- Direct integration with OpenRouter API
- LLM model selection and configuration
- Token usage tracking and optimization

**memes.service.js** - Reddit memes fetching
- Automated Reddit content fetching
- Content filtering and NSFW protection
- Scheduled updates with cron jobs

**news.service.js** - CryptoPanic news integration
- Real-time news fetching from CryptoPanic API
- Personalized filtering based on user preferences
- Sentiment analysis and content scoring

**redditClient.js** - Reddit API client
- Reddit OAuth authentication
- API client configuration and error handling
- Content fetching and processing

### 🛡️ Security & Middleware

**middlewares/auth.js** - JWT authentication middleware
- Token validation and user authentication
- Protected route middleware
- User context injection

**security/rateLimit.js** - Rate limiting configuration
- Authentication endpoint protection
- Progressive lockout system
- Rate limit configuration for different endpoints

### 🗄️ Data Access Layer

**repos/refresh-token.repo.js** - Refresh token repository
- Refresh token storage and retrieval
- Token rotation and cleanup
- Expiration management

**repos/userDataRepo.js** - User data repository
- User preference data access
- Onboarding data management
- User profile operations

**repos/insightsRepo.js** - AI insights repository
- AI insight storage and retrieval
- Content metadata management
- User-specific insight filtering

**memeDB/memeDB.js** - Memes database management
- Memes database connection
- Content storage and retrieval
- Reddit data processing

---

## ⚛️ Frontend Structure (src/)

### 📱 App Configuration (src/app/)

**App.tsx** - Root component
- Main app component that renders the router
- Provider wrapper for context and state management

**main.tsx** - React entry point
- React application mounting
- DOM rendering and initialization

**providers.tsx** - Context providers
- React Query client configuration
- Authentication context provider
- Global state management setup

**router.tsx** - React Router configuration
- Route definitions and navigation
- Protected route implementation
- Layout and page component mounting

### 🧩 Components Directory (src/components/)

#### Layout Components (src/components/layout/)

**AppLayout.tsx** - Main app layout
- Application shell with navigation and footer
- Dark mode toggle and theme management
- Responsive layout configuration

**Navbar.tsx** - Navigation bar
- Main navigation with user authentication
- Dark mode toggle functionality
- User menu and logout options

**Footer.tsx** - Footer component
- Application footer with links and information
- Copyright and version information

**ProtectedRoute.tsx** - Route protection
- Authentication-based route protection
- Redirect logic for unauthenticated users
- Loading states and error handling

#### UI Components (src/components/ui/)

**button.tsx** - Button component
- Reusable button component with variants
- Loading states and disabled states
- Accessibility features

**card.tsx** - Card components
- Card container components
- Header, content, and footer sections
- Hover effects and animations

**input.tsx** - Input component
- Form input components
- Validation states and error handling
- Accessibility features

**select.tsx** - Select component
- Dropdown select components
- Search and filtering capabilities
- Keyboard navigation

**toast.tsx** - Toast notifications
- Notification system components
- Success, error, and info variants
- Auto-dismiss functionality

**IconTabs.tsx** - Custom tab component
- Tab navigation with icons
- Active state management
- Responsive design

#### Common Components (src/components/common/)

**Card.tsx** - Custom card wrapper
- Enhanced card component with animations
- Loading states and empty states
- Content organization

**Skeleton.tsx** - Loading skeletons
- Loading state components
- Content placeholders and animations
- Performance optimization

**EmptyState.tsx** - Empty state component
- Empty state displays
- Call-to-action buttons
- User guidance

**VoteButtons.tsx** - Voting interface
- Like/dislike voting buttons
- Vote count display
- Optimistic updates

**SectionHeader.tsx** - Section headers
- Consistent section headers
- Action buttons and controls
- Responsive design

### 🎯 Features Directory (src/features/)

#### Authentication Features (src/features/auth/)

**components/AuthForm.tsx** - Login form
- User login form with validation
- Error handling and loading states
- Form submission and API integration

**components/EnhancedSignupForm.tsx** - 3-step signup wizard
- Multi-step registration process
- Onboarding data collection
- Form validation and progression

**pages/LoginPage.tsx** - Login page
- Login page layout and styling
- Form integration and navigation
- Error display and user feedback

**pages/SignupPage.tsx** - Signup page
- Registration page layout
- Multi-step form integration
- Success and error handling

#### Dashboard Features (src/features/dashboard/)

**DashboardView.tsx** - Main dashboard view
- Tabbed interface with 4 main sections
- Content filtering and personalization
- Real-time data updates

**components/AIInsightSection.tsx** - AI insights display
- AI-generated market analysis display
- Content formatting and styling
- Regeneration functionality

**components/CoinChart.tsx** - Price charts
- Cryptocurrency price visualization
- Chart configuration and data
- Interactive features

**components/MemeSection.tsx** - Meme display
- Reddit meme content display
- Voting functionality
- Content filtering

**components/NewsSection.tsx** - News display
- CryptoPanic news integration
- Personalized filtering
- External link handling

**components/PricesSection.tsx** - Prices display
- Real-time cryptocurrency prices
- Price change indicators
- Market data visualization

**components/PriceRow.tsx** - Individual price row
- Single cryptocurrency price display
- Voting and interaction features
- Responsive design

**hooks/useAIInsight.ts** - AI insights hook
- AI insight data fetching
- Caching and error handling
- User-specific filtering

**hooks/useChart.ts** - Chart data hook
- Chart data fetching and processing
- Real-time updates
- Error handling

**hooks/useMeme.ts** - Meme data hook
- Reddit meme data fetching
- Pagination and filtering
- Content processing

**hooks/useNews.ts** - News data hook
- CryptoPanic news integration
- Personalized filtering
- Real-time updates

**hooks/usePrices.ts** - Prices data hook
- CoinGecko price data fetching
- Real-time updates
- Error handling and fallbacks

**hooks/useTodayInsight.ts** - Today's AI insight hook
- Daily AI insight fetching
- User-specific content
- Caching and optimization

**hooks/useVote.ts** - Voting hook
- Universal voting functionality
- Optimistic updates
- Vote persistence

**panels/AiInsightPanel.tsx** - AI insights panel
- AI insight display panel
- Content formatting
- User interaction features

**panels/CoinPricesPanel.tsx** - Prices panel
- Cryptocurrency prices panel
- Market data display
- Interactive features

**panels/MarketNewsPanel.tsx** - News panel
- News feed panel
- Personalized content
- External link handling

**panels/MemePanel.tsx** - Meme panel
- Meme content panel
- Community features
- Content moderation

**pages/DashboardPage.tsx** - Dashboard page wrapper
- Dashboard page layout
- Component integration
- State management

#### News Features (src/features/news/)

**components/NewsCard.tsx** - Individual news card
- News article display
- Voting functionality
- External link handling

**components/NewsFeed.tsx** - News feed with filtering
- News feed display
- Content filtering
- Pagination and loading

**hooks/useCryptoPanicPosts.ts** - CryptoPanic integration
- CryptoPanic API integration
- Data fetching and processing
- Error handling

**pages/NewsPage.tsx** - News page
- News page layout
- Component integration
- User interaction features

#### Settings Features (src/features/settings/)

**components/PreferencesForm.tsx** - Preferences display
- User preferences display
- Preference editing
- Form validation

**components/ProfileForm.tsx** - Profile management
- User profile editing
- Data validation
- Update functionality

**pages/SettingsPage.tsx** - Settings page
- Settings page layout
- Component integration
- User data management

### 📚 Libraries & Utilities (src/lib/)

#### API Integration (src/lib/api/)

**api.ts** - Main API client
- Centralized API client configuration
- Authentication handling
- Error handling and retries

**coinGecko.ts** - CoinGecko API integration
- Cryptocurrency data fetching
- API configuration
- Data processing

**cryptopanic.ts** - CryptoPanic API service
- News data fetching
- API integration
- Content processing

**newEndpoints.ts** - New API endpoints
- Additional API endpoints
- Endpoint configuration
- Data handling

#### State Management (src/lib/state/)

**prefs.store.ts** - Preferences store
- User preferences state management
- Zustand store configuration
- State persistence

#### Utilities (src/lib/utils/)

**coinMapping.ts** - Coin ID mapping
- Cryptocurrency ID mapping
- Symbol and name conversion
- Data normalization

**cryptoPanic.ts** - CryptoPanic utilities
- CryptoPanic API utilities
- Data processing functions
- Content formatting

**cryptoPrefs.ts** - Crypto preferences
- User preference utilities
- Preference validation
- Data processing

**format.ts** - Formatting utilities
- Data formatting functions
- Currency and number formatting
- Date and time formatting

**guards.ts** - Type guards
- TypeScript type guards
- Runtime type checking
- Data validation

**scoring.ts** - Content scoring algorithm
- Content relevance scoring
- User preference matching
- ML-based recommendations

**utils.ts** - General utilities
- Common utility functions
- Helper functions
- Data processing

### 🎯 Contexts & Hooks

**contexts/AuthContext.tsx** - Authentication context
- Global authentication state
- User data management
- Authentication methods

**hooks/useAuthLockout.ts** - Authentication lockout hook
- Rate limiting protection
- Lockout state management
- User feedback

**hooks/useToast.ts** - Toast notifications hook
- Notification system
- Toast management
- User feedback

**state/useAuth.ts** - Authentication state
- Authentication state management
- User session handling
- Token management

### 📝 Type Definitions

**types/auth.ts** - Authentication types
- User authentication types
- Token types
- Authentication state types

**types/common.ts** - Common types
- Shared type definitions
- Common interfaces
- Utility types

**types/dashboard.ts** - Dashboard types
- Dashboard-specific types
- Component prop types
- Data structure types

---

## 🔌 API Endpoints Documentation

### 🔐 Authentication Endpoints

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/auth/login` | POST | No | User login with email/password, returns JWT tokens |
| `/auth/signup` | POST | No | New user registration with preferences (3-step onboarding) |
| `/auth/refresh` | POST | No | Refresh expired JWT token using refresh token |
| `/auth/logout` | POST | Yes | Logout and invalidate all tokens |

### 👤 User Data Endpoints

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/me` | GET | Yes | Returns logged-in user basic information |
| `/me/data` | GET | Yes | Returns user investment preferences and onboarding data |

### 🤖 AI Insights Endpoints

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/insights/today` | GET | Yes | Fetches today's AI insight for user (with user_id query param) |

### 🎭 Memes Endpoints

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/memes` | GET | Yes | Fetches memes with pagination and filtering (limit, sub, cursor params) |
| `/api/memes/refresh` | POST | Yes | Manually triggers meme fetching from Reddit |

### 📰 News Endpoints

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/news` | GET | Yes | Fetches personalized crypto news from CryptoPanic |

### 👍 Reactions Endpoints

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/reactions` | POST | Yes | Save/update user reaction for any content type |
| `/dashboard/vote` | POST | Yes | Submit vote for content (like/dislike) with rich metadata |

### 🏥 System Endpoints

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/health` | GET | No | Server health check |
| `/cors-test` | GET | No | CORS configuration test endpoint |

---

## ✨ Key Features & Components

### 🔐 Authentication System
- JWT-based authentication with httpOnly cookies
- Rate limiting and lockout protection
- Automatic token refresh
- 3-step onboarding wizard
- Secure password hashing with bcryptjs

### 📊 Dashboard Interface
- Tabbed interface with 4 main sections
- Real-time crypto prices with charts
- Personalized news feed
- AI-generated market insights
- Daily crypto memes

### 🤖 AI Insights Service
- OpenRouter API integration
- Daily personalized market analysis
- Structured prompt engineering
- User-specific recommendations
- Content regeneration capability

### 📰 News Integration
- CryptoPanic API integration
- Personalized filtering by investor type
- Sentiment analysis
- Real-time updates
- Fallback to mock data

### 🎭 Memes System
- Automated Reddit meme fetching
- Content filtering and NSFW protection
- Scheduled updates with cron jobs
- Pagination support
- Community voting system

### 👍 Voting System
- Universal like/dislike functionality
- Optimistic UI updates
- Persistent vote storage
- Rich content metadata
- Real-time vote counts

---

## 🗄️ Database Schema

### 📋 Core Tables

```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User data table (onboarding preferences)
CREATE TABLE user_data (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  investor_type TEXT CHECK (
    investor_type IN ('day_trader', 'investor', 'conservative')
  ) NOT NULL,
  selected_assets TEXT[] NOT NULL,
  selected_content_types TEXT[] NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Refresh tokens table
CREATE TABLE refresh_tokens (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ
);
```

### 🤖 AI Insights Table

```sql
-- AI insights table
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  date_key DATE NOT NULL,
  provider TEXT,
  model TEXT,
  prompt_tokens INT,
  completion_tokens INT,
  title TEXT,
  tl_dr TEXT,
  content_md TEXT,
  content_json JSONB,
  sources JSONB
);
```

### 🎭 Memes Table

```sql
-- Memes table
CREATE TABLE memes (
  id TEXT PRIMARY KEY,         -- redditId
  subreddit TEXT NOT NULL,
  title TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  num_comments INTEGER NOT NULL DEFAULT 0,
  permalink TEXT NOT NULL,
  source_url TEXT NOT NULL,    -- direct image if available
  cdn_url TEXT,                -- optional if you later mirror to S3
  is_nsfw BOOLEAN NOT NULL DEFAULT FALSE,
  flair TEXT,
  author_name TEXT,
  created_utc TIMESTAMPTZ NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 👍 User Reactions Table

```sql
-- User reactions table
CREATE TABLE user_reactions (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,                -- 'meme' | 'news' | 'coin' | 'ai_daily_news'
  external_id TEXT NOT NULL,                 -- Item identifier in source
  reaction reaction_value NOT NULL,          -- like | dislike
  content JSONB NOT NULL,                    -- Minimal snapshot of content
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, content_type, external_id)
);
```

### 📰 News Items Table

```sql
-- News items table
CREATE TABLE news_items (
  id BIGSERIAL PRIMARY KEY,
  source_id TEXT,               -- upstream unique id if exists
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  currencies TEXT[] DEFAULT '{}',
  is_important BOOLEAN DEFAULT FALSE,
  source TEXT,                  -- e.g., "cryptopanic"
  raw JSONB,                    -- full upstream payload
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🚀 Deployment & Configuration

### 🔧 Environment Variables

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
FRONTEND_URL=http://crypto-ai-advisore.s3-website-us-east-1.amazonaws.com
ALLOWED_ORIGINS=http://crypto-ai-advisore.s3-website-us-east-1.amazonaws.com,http://localhost:3000
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

### 🏗️ Build & Development

#### Frontend Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

#### Backend Development
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start development server
npm start
```

### 🐳 Docker Support
- **docker-compose.dev.yml** - Docker development setup
- **nixpacks.toml** - Nixpacks configuration for Railway

### ☁️ Deployment Platforms
- **Backend:** Railway, Render, or AWS with PostgreSQL
- **Frontend:** Vercel, Netlify, or S3 static hosting
- **Database:** Managed PostgreSQL (Railway, Render, AWS RDS)
- **Domain:** Configure CORS for production domains

---

## 🔧 Troubleshooting Guide

### 🚨 Common Issues

#### Authentication Issues
- **Login fails:** Check JWT secrets and database connection
- **Token refresh fails:** Verify httpOnly cookie settings
- **Rate limiting:** Check rate limit configuration and user lockout

#### API Integration Issues
- **CryptoPanic API:** Verify API key and rate limits
- **CoinGecko API:** Check API key and request limits
- **OpenRouter API:** Verify API key and model configuration
- **Reddit API:** Check OAuth tokens and client credentials

#### Database Issues
- **Connection fails:** Verify DATABASE_URL and SSL settings
- **Schema errors:** Check table creation and migrations
- **Query errors:** Verify table structure and indexes

#### Frontend Issues
- **Build fails:** Check TypeScript errors and dependencies
- **API calls fail:** Verify CORS settings and server URL
- **Styling issues:** Check Tailwind configuration and imports

### 🔍 Debugging Steps
1. Check server logs for errors
2. Verify environment variables are set correctly
3. Test API endpoints individually
4. Check database connection and schema
5. Verify external API credentials
6. Check CORS configuration
7. Review rate limiting settings

### 📞 Support Resources
- **Documentation:** README.md, PROJECT_OVERVIEW.md
- **API Guides:** CRYPTOPANIC_SETUP.md, BACKEND_INTEGRATION.md
- **Deployment:** S3-DEPLOYMENT-GUIDE.md
- **Code Comments:** Inline documentation throughout codebase

---

## 📝 Summary

This comprehensive documentation covers the complete structure and functionality of the AI Crypto Advisor project. The application is a production-ready full-stack platform that combines modern web technologies with AI-powered insights to provide users with personalized cryptocurrency investment guidance.

### 🎯 Key Takeaways
- **Full-Stack Architecture:** React frontend with Node.js backend and PostgreSQL database
- **AI Integration:** OpenRouter API for intelligent market analysis
- **Real-time Data:** CoinGecko and CryptoPanic APIs for live market information
- **User Experience:** Personalized dashboard with voting system and dark mode
- **Security:** JWT authentication with rate limiting and secure token storage
- **Scalability:** Modular architecture with clear separation of concerns

This documentation serves as a complete reference for understanding, maintaining, and extending the AI Crypto Advisor platform. Each section provides detailed information about the project's structure, components, and functionality, making it easy to locate and understand any part of the codebase.

---

*Generated on: $(date)*
*Project Version: 1.0.0*
*Documentation Version: 1.0.0*


