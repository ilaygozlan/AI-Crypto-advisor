# AI Crypto Advisor

A production-grade React + TypeScript application for AI-powered cryptocurrency insights and market analysis.

## 🚀 Features

- **Modern UI/UX**: Apple-like design with clean aesthetics, smooth animations, and responsive layout
- **Authentication**: Secure login/signup with JWT token management
- **Onboarding**: 3-step wizard to personalize user experience
- **Real-time News**: Integration with [CryptoPanic API](https://cryptopanic.com/developers/api/) for personalized crypto news
- **Dashboard**: Real-time crypto data with 4 main sections:
  - 📰 Market News
  - 💰 Coin Prices
  - 🤖 AI Insights
  - 🎉 Fun Crypto Memes
- **Interactive Voting**: Like/dislike system for all content
- **Settings**: Profile management and preferences
- **Dark Mode**: System preference detection with manual toggle
- **Real-time Data**: Live cryptocurrency data and news feeds

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express.js + PostgreSQL
- **Styling**: Tailwind CSS + shadcn/ui components (Radix UI)
- **State Management**: Zustand + React Context
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Authentication**: JWT tokens with httpOnly cookies
- **Testing**: Vitest + Testing Library
- **Linting**: ESLint + Prettier

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-crypto-advisor
```

2. Install dependencies:
```bash
npm install
```

3. Create environment files:
```bash
cp env.example .env
cp env.development .env.development
cp env.production .env.production
```

4. Update environment files with your configuration:

**Frontend (.env.development / .env.production):**
```env
VITE_SERVER_URL=http://localhost:3000
VITE_CRYPTOPANIC_API_KEY=your_cryptopanic_api_key
VITE_APP_NAME=AI Crypto Advisor
```

**Backend (.env):**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/crypto_advisor
JWT_ACCESS_SECRET=your-access-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
CG_API_KEY=your-coingecko-api-key
OPENROUTER_API_KEY=your-openrouter-api-key
REDDIT_CLIENT_ID=your-reddit-client-id
REDDIT_CLIENT_SECRET=your-reddit-client-secret
PORT=3000
NODE_ENV=development
```

## 🚀 Development

### Frontend Development
Start the frontend development server:
```bash
npm run dev
```

### Backend Development
Start the backend server:
```bash
cd server
npm install
npm start
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`

## 🏗 Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

## 🔧 Code Quality

Lint code:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint:fix
```

Format code:
```bash
npm run format
```

Check formatting:
```bash
npm run format:check
```

## 📁 Project Structure

```
crypto_AI/
├── server/                 # Backend Node.js/Express application
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic layer
│   ├── middlewares/        # Express middleware
│   ├── repos/              # Data access layer
│   ├── utils/              # Backend utilities
│   └── package.json        # Backend dependencies
├── src/                    # Frontend React application
│   ├── app/                # App configuration and routing
│   ├── components/
│   │   ├── ui/             # shadcn/ui components (Radix UI)
│   │   ├── layout/         # Layout components
│   │   └── common/         # Reusable components
│   ├── features/           # Feature-based modules
│   │   ├── auth/           # Authentication
│   │   ├── dashboard/      # Main dashboard
│   │   ├── news/           # News features
│   │   └── settings/       # User settings
│   ├── lib/
│   │   ├── api/            # API client and endpoints
│   │   ├── state/          # Zustand stores
│   │   └── utils/          # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── styles/             # Global styles
│   └── contexts/           # React contexts
├── public/                 # Static assets
├── dist/                   # Build output
└── package.json            # Frontend dependencies
```

## 🔗 CryptoPanic API Integration

This app integrates with the [CryptoPanic API](https://cryptopanic.com/developers/api/) to provide real-time cryptocurrency news based on user preferences.

### Setup
1. Get a free API key from [CryptoPanic Developers](https://cryptopanic.com/developers/api/)
2. Add it to your environment variables:
   ```env
   VITE_CRYPTOPANIC_API_KEY=your_api_key_here
   ```

### Features
- **Personalized News**: Filters news based on user's selected cryptocurrencies and investment type
- **Sentiment Analysis**: Uses CryptoPanic's built-in sentiment scoring
- **Real-time Updates**: Fetches latest news every 10 minutes
- **Robust Error Handling**: Graceful error handling with user feedback

See [CRYPTOPANIC_SETUP.md](./CRYPTOPANIC_SETUP.md) for detailed setup instructions.

## 🔌 Backend API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration with onboarding
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - User logout

### User Data
- `GET /me` - Get user information
- `GET /me/data` - Get user preferences and onboarding data

### External APIs (Proxied)
- `GET /api/coinGecko/prices` - Crypto prices
- `GET /api/coinGecko/markets` - Market data
- `GET /api/coinGecko/chart/:coinId` - Chart data

### Content & Features
- `GET /api/insights/today` - Today's AI insight
- `GET /api/memes` - Fetch memes with pagination
- `POST /api/memes/refresh` - Manually refresh memes
- `POST /api/reactions` - Save user reactions
- `POST /dashboard/vote` - Submit content votes

### System
- `GET /health` - Server health check

## 🎨 Design System

### Colors
- **Light Mode**: Clean whites and soft grays
- **Dark Mode**: Near-black backgrounds with neutral grays
- **Accents**: Subtle primary colors for interactive elements

### Typography
- **Font**: System UI stack (San Francisco on Apple, Inter fallback)
- **Sizes**: Generous headings, readable body text
- **Weights**: 400-600 range for optimal readability

### Components
- **Cards**: Subtle borders, soft shadows, hover effects
- **Buttons**: Clear hierarchy with focus states
- **Forms**: Inline validation with helpful error messages
- **Navigation**: Translucent navbar with backdrop blur

## 🔐 Authentication Flow

1. **Login/Signup**: Email and password authentication
2. **JWT Storage**: Secure token management with Zustand
3. **Route Protection**: Automatic redirects based on auth state
4. **Onboarding Check**: New users guided through setup

## 📊 Dashboard Sections

### Market News
- Latest cryptocurrency news from various sources
- Vote on article relevance
- External links to full articles

### Coin Prices
- Real-time price data for selected assets
- 24h change indicators
- Sparkline charts (placeholder)

### AI Insights
- Daily AI-generated market analysis
- Personalized recommendations
- Regenerate functionality

### Fun Memes
- Daily crypto-related memes
- Community voting system
- Light-hearted content to balance serious analysis

## 🗳 Voting System

- **Optimistic Updates**: Immediate UI feedback
- **Persistent Storage**: Votes saved to backend
- **Visual Feedback**: Active states and vote counts
- **Accessibility**: Keyboard navigation and screen reader support

## 🌙 Dark Mode

- **System Detection**: Respects `prefers-color-scheme`
- **Manual Toggle**: User-controlled theme switching
- **Persistent**: Remembers user preference
- **Smooth Transitions**: Animated theme changes

## 📱 Responsive Design

- **Mobile First**: Optimized for all screen sizes
- **Grid Layout**: Adaptive dashboard grid
- **Touch Friendly**: Appropriate touch targets
- **Performance**: Optimized for mobile devices

## 🧪 Testing Strategy

- **Unit Tests**: Component logic and utilities
- **Integration Tests**: User interactions and flows
- **Accessibility Tests**: Screen reader and keyboard navigation
- **Visual Tests**: Component rendering and styling

## 🚀 Performance

- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Responsive images with lazy loading
- **Bundle Analysis**: Optimized bundle size
- **Caching**: Efficient data fetching with React Query

## 🔧 Configuration

### Environment Variables

**Frontend:**
- `VITE_SERVER_URL`: Backend API endpoint
- `VITE_CRYPTOPANIC_API_KEY`: CryptoPanic API key for news
- `VITE_APP_NAME`: Application display name

**Backend:**
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_ACCESS_SECRET`: JWT access token secret
- `JWT_REFRESH_SECRET`: JWT refresh token secret
- `CG_API_KEY`: CoinGecko API key
- `OPENROUTER_API_KEY`: OpenRouter AI API key
- `REDDIT_CLIENT_ID`: Reddit API client ID
- `REDDIT_CLIENT_SECRET`: Reddit API client secret
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

### TypeScript
- Strict mode enabled
- Path mapping with `@/*` aliases
- Comprehensive type coverage

### Tailwind CSS
- Custom design tokens
- Component-based utilities
- Dark mode support

## 🤝 Contributing

1. Follow the established code style
2. Write tests for new features
3. Update documentation as needed
4. Ensure accessibility compliance

## 📄 License

This project is a production-ready AI-powered cryptocurrency advisor application.

## 🎯 Current Features

- **Full-Stack Application**: Complete React frontend with Node.js backend
- **AI-Powered Insights**: Daily market analysis using OpenRouter API
- **Real-time Data**: Live crypto prices, news, and market data
- **Reddit Integration**: Automated meme fetching from crypto subreddits
- **Interactive Voting**: Like/dislike system for all content types
- **Personalized Content**: ML-based scoring and user preference filtering
- **Secure Authentication**: JWT-based auth with rate limiting and lockout protection
- **Responsive Design**: Mobile-first design with dark mode support

## 🚀 Future Enhancements

- Real-time WebSocket connections
- Advanced charting with TradingView
- Portfolio tracking and analytics
- Social features and community
- Mobile app with React Native
- Advanced AI insights and predictions
- Push notifications for price alerts
- Advanced technical analysis tools

---

Built with ❤️ using modern web technologies and best practices.
