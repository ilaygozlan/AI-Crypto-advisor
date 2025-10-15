# Frontend Standalone Development

This guide shows you how to work on the frontend UI without needing the backend server or database.

## 🚀 Quick Start

### Option 1: Use the Batch Script (Windows)
```bash
# Double-click or run:
start-frontend-standalone.bat
```

### Option 2: Manual Setup
```bash
# 1. Copy standalone environment file
copy env.standalone .env

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

## 🎭 Mock API Features

The standalone mode includes a complete mock API with:

- **Authentication**: Login/signup with mock user data
- **Dashboard**: News, prices, AI insights, and memes
- **Voting**: Mock voting functionality
- **Realistic Data**: Sample crypto data and news

## 🔧 Environment Variables

**`env.standalone`:**
```env
VITE_USE_MOCK_API=true
VITE_API_BASE_URL=http://localhost:4000
```

## 📱 Available Features

### Authentication
- ✅ Login with any email/password
- ✅ Signup with any data
- ✅ Mock JWT tokens
- ✅ User profile data

### Dashboard
- ✅ **News**: Sample crypto news articles
- ✅ **Prices**: Mock Bitcoin/Ethereum prices
- ✅ **AI Insights**: Sample market analysis
- ✅ **Memes**: Mock crypto memes with voting

### Interactive Features
- ✅ Voting on memes
- ✅ Responsive design
- ✅ Dark/light theme
- ✅ Navigation between pages

## 🎨 UI Development

You can now work on:
- Component styling and layout
- User interface improvements
- Responsive design
- Theme customization
- Navigation and routing
- Form validation and UX

## 🔄 Switching Back to Real API

To use the real backend:

1. **Update environment:**
   ```env
   VITE_USE_MOCK_API=false
   VITE_API_BASE_URL=http://localhost:4000
   ```

2. **Start the backend server** (see server README)

3. **Restart the frontend:**
   ```bash
   npm run dev
   ```

## 🐛 Troubleshooting

**Mock API not working?**
- Check that `VITE_USE_MOCK_API=true` in your `.env` file
- Look for "🎭 Using Mock API" in browser console

**Styling issues?**
- Make sure Tailwind CSS is working: `npm run dev`
- Check browser dev tools for CSS errors

**Build errors?**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build`

## 📁 File Structure

```
src/
├── lib/
│   ├── api/
│   │   ├── client.ts      # Main API client (auto-switches to mock)
│   │   ├── mock.ts        # Mock API data and responses
│   │   └── mockClient.ts  # Mock client implementation
│   └── state/             # Zustand stores
├── components/            # React components
├── features/              # Feature-based organization
└── app/                   # App routing and providers
```

## 🎯 Next Steps

1. **Start developing**: Run the standalone mode
2. **Customize mock data**: Edit `src/lib/api/mock.ts`
3. **Build your UI**: Focus on components and styling
4. **Test interactions**: All features work with mock data
5. **Switch to real API**: When backend is ready

Happy coding! 🚀
