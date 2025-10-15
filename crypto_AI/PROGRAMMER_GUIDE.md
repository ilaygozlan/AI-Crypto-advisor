# Moveo AI Crypto Advisor - Programmer Guide

## Overview

The Moveo AI Crypto Advisor is a full-stack application providing personalized cryptocurrency insights and market analysis. The system consists of a React frontend, Node.js backend, and PostgreSQL database.

### Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Node.js API    │    │  PostgreSQL DB  │
│                 │    │                 │    │                 │
│ • TypeScript    │◄──►│ • Express       │◄──►│ • User Data     │
│ • Tailwind CSS  │    │ • JWT Auth      │    │ • Market Data   │
│ • Zustand Store │    │ • React Query   │    │ • AI Insights   │
│ • Framer Motion │    │ • Webhooks      │    │ • Interactions  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow

```
User Action → Frontend → API → Database
     ↓           ↓        ↓        ↓
  UI Update ← React Query ← Response ← Query
```

### Request Lifecycle

1. User interacts with UI
2. Frontend calls API via axios instance
3. API validates JWT token
4. Database query/update
5. Response with data
6. React Query caches and updates UI
7. Optimistic updates for better UX

## Local Setup

### Requirements

- **Node.js**: v18+ (LTS recommended)
- **Package Manager**: npm or pnpm
- **Database**: PostgreSQL 14+ or Docker
- **Git**: For version control

### Environment Variables

Create `.env` file in project root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=Moveo AI Crypto Advisor

# Backend (for reference)
DATABASE_URL=postgresql://user:password@localhost:5432/moveo_crypto
JWT_SECRET=your-super-secret-jwt-key
WEBHOOK_SECRET=your-webhook-signing-secret
NODE_ENV=development
PORT=3001
```

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Code Structure

### Frontend (`src/`)

```
src/
├── app/                    # App configuration
│   ├── main.tsx           # Entry point
│   ├── App.tsx            # Root component
│   ├── providers.tsx      # Context providers
│   └── router.tsx         # Route definitions
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Layout components
│   └── common/            # Reusable components
├── features/              # Feature-based modules
│   ├── auth/              # Authentication
│   ├── onboarding/        # User onboarding
│   ├── dashboard/         # Main dashboard
│   └── settings/          # User settings
├── lib/
│   ├── api/               # API client & endpoints
│   ├── state/             # Zustand stores
│   └── utils/             # Utility functions
├── types/                 # TypeScript definitions
└── styles/                # Global styles
```

### Naming Conventions

- **Components**: PascalCase (`AuthForm.tsx`)
- **Hooks**: camelCase starting with `use` (`useLogin.ts`)
- **Stores**: camelCase ending with `Store` (`authStore.ts`)
- **Types**: PascalCase (`LoginRequest`)
- **Files**: kebab-case for utilities (`format-currency.ts`)

### Patterns

- **Feature-based organization**: Each feature has its own folder with pages, components, hooks, and types
- **Custom hooks**: Data fetching logic encapsulated in hooks using React Query
- **State management**: Zustand for global state, React Query for server state
- **Type safety**: Full TypeScript coverage with strict mode

## Data Model

### Core Entities

| Table | Purpose |
|-------|---------|
| `users` | User accounts and profiles |
| `sessions` | JWT session management |
| `assets` | Cryptocurrency definitions |
| `user_assets` | User's selected assets |
| `content_types` | Available content categories |
| `user_content_types` | User's content preferences |
| `user_investor_profile` | User's investor type and settings |
| `news_items` | Market news articles |
| `memes` | Daily crypto memes |
| `price_snapshots` | Historical price data |
| `ai_insights` | AI-generated market insights |
| `votes` | User votes on content |
| `interactions` | User engagement tracking |
| `recommendation_profile` | AI recommendation settings |
| `user_recommendations` | Personalized recommendations |
| `recommendation_events` | Recommendation interaction events |

## API Usage

### Frontend API Integration

```typescript
// API client setup
import { apiClient } from '@/lib/api/client'

// Automatic JWT injection
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// React Query usage
const { data, isLoading, error } = useQuery({
  queryKey: ['news'],
  queryFn: () => dashboardApi.getNews(),
  staleTime: 5 * 60 * 1000, // 5 minutes
})
```

### Authentication Flow

1. User submits login/signup form
2. API returns JWT token
3. Token stored in Zustand store
4. Axios interceptor adds token to requests
5. Protected routes check authentication state

## Development Workflow

### Lint & Format

```bash
# Check for issues
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm test -- --watch
```

### Git Workflow

- **Feature branches**: `feat/feature-name`
- **Bug fixes**: `fix/bug-description`
- **Hotfixes**: `hotfix/critical-issue`
- **Commits**: Conventional commits format

Example:
```bash
git checkout -b feat/user-onboarding
git commit -m "feat: add 3-step onboarding wizard"
git push origin feat/user-onboarding
```

## Deployment

### Frontend (Vercel/Netlify)

```bash
# Build
npm run build

# Deploy
vercel --prod
# or
netlify deploy --prod --dir=dist
```

### Backend (Render/Railway)

```bash
# Environment variables
DATABASE_URL=postgresql://...
JWT_SECRET=...
WEBHOOK_SECRET=...

# Deploy
git push origin main
```

### Database Migrations

```bash
# Run migrations
npm run migrate

# Rollback
npm run migrate:rollback
```

## Troubleshooting

### Common Issues

**CORS Errors**
- Ensure `VITE_API_BASE_URL` matches backend URL
- Check backend CORS configuration

**Authentication Issues**
- Verify JWT token in browser storage
- Check token expiration
- Ensure backend JWT_SECRET matches

**Environment Mismatch**
- Compare `.env` with `.env.example`
- Restart development server after env changes

**Rate Limiting**
- Check API rate limits
- Implement exponential backoff
- Add request queuing for high-frequency calls

**Database Connection**
- Verify DATABASE_URL format
- Check PostgreSQL service status
- Ensure database exists and user has permissions

### Debug Tools

- **React DevTools**: Component state inspection
- **Redux DevTools**: Zustand store debugging
- **Network Tab**: API request/response inspection
- **Console**: Error logging and debugging

## API Documentation

- **OpenAPI Spec**: `/openapi/openapi.json`
- **Postman Collection**: `/postman/Moveo-AI-Crypto-Advisor.postman_collection.json`
- **JSON Schemas**: `/schemas/*.schema.json`
- **Webhook Specs**: `/webhooks/spec.json`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Ensure all checks pass
5. Submit a pull request

### Code Review Checklist

- [ ] TypeScript types are accurate
- [ ] Tests cover new functionality
- [ ] No console.log statements
- [ ] Proper error handling
- [ ] Accessibility considerations
- [ ] Performance impact assessed
