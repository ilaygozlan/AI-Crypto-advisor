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
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Icons**: Lucide React
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

3. Create environment file:
```bash
cp env.example .env
```

4. Update `.env` with your configuration:
```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_NAME=AI Crypto Advisor
```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://crypto-ai-advisore.s3-website-us-east-1.amazonaws.com`

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
src/
├── app/                    # App configuration and routing
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Layout components
│   └── common/             # Reusable components
├── features/               # Feature-based modules
│   ├── auth/               # Authentication
│   ├── onboarding/         # User onboarding
│   ├── dashboard/          # Main dashboard
│   └── settings/           # User settings
├── lib/
│   ├── api/                # API client and endpoints
│   ├── state/              # Zustand stores
│   └── utils/              # Utility functions
├── types/                  # TypeScript type definitions
├── styles/                 # Global styles
└── test/                   # Test setup
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
- `VITE_API_BASE_URL`: Backend API endpoint
- `VITE_APP_NAME`: Application display name

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

## 🎯 Future Enhancements

- Real-time WebSocket connections
- Advanced charting with TradingView
- Portfolio tracking and analytics
- Social features and community
- Mobile app with React Native
- Advanced AI insights and predictions

---

Built with ❤️ using modern web technologies and best practices.
