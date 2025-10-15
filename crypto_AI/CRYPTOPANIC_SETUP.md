# CryptoPanic API Integration

This application integrates with the [CryptoPanic API](https://cryptopanic.com/developers/api/) to provide real-time cryptocurrency news based on user preferences.

## Setup Instructions

### 1. Get Your API Key

1. Visit [CryptoPanic Developers](https://cryptopanic.com/developers/api/)
2. Sign up for a free account
3. Generate an API key from your dashboard
4. Copy the API key

### 2. Configure Environment Variables

Add your API key to the environment files:

**For Development (`env.development`):**
```env
VITE_CRYPTOPANIC_API_KEY=your_actual_api_key_here
```

**For Production (`env.production`):**
```env
VITE_CRYPTOPANIC_API_KEY=your_actual_api_key_here
```

### 3. How It Works

The integration automatically filters news based on user preferences:

#### Investor Type Filtering:
- **Conservative**: Shows "important" news (reliable, high-impact stories)
- **Moderate**: Shows "hot" news (trending, popular stories)
- **Aggressive**: Shows "bullish" news (positive sentiment stories)

#### Asset Filtering:
- News is filtered to show only stories related to cryptocurrencies the user has selected
- Supports all major cryptocurrencies (BTC, ETH, ADA, etc.)

#### Content Type Filtering:
- Shows only "news" type content (excludes media/videos)
- Focuses on English language content

### 4. API Features Used

- **Real-time News**: Fetches latest cryptocurrency news
- **Sentiment Analysis**: Uses CryptoPanic's built-in sentiment scoring
- **Vote System**: Integrates with CryptoPanic's community voting
- **Source Attribution**: Shows original news sources
- **Rate Limiting**: Respects API rate limits with proper error handling

### 5. Fallback System

The application has a robust fallback system:

1. **Primary**: CryptoPanic API with user preferences
2. **Secondary**: Original mock API
3. **Tertiary**: Static mock data files

This ensures the app always works, even if the CryptoPanic API is temporarily unavailable.

### 6. Rate Limits

CryptoPanic API has rate limits:
- **Free Tier**: 100 requests per hour
- **Paid Tiers**: Higher limits available

The app implements:
- 5-minute cache (staleTime)
- 10-minute refetch interval
- Single retry on failure
- Graceful fallback to mock data

### 7. Data Transformation

The CryptoPanic API data is transformed to match our app's format:

```typescript
// CryptoPanic format → App format
{
  id: "12345",
  title: "Bitcoin Reaches New High",
  url: "https://example.com/news",
  published_at: "2024-01-15T10:30:00Z",
  source: { title: "CoinDesk" },
  votes: { positive: 150, negative: 20 },
  currencies: [{ code: "BTC" }]
}
```

Becomes:

```typescript
{
  id: "12345",
  title: "Bitcoin Reaches New High",
  summary: "Bitcoin Reaches New High",
  source: "CoinDesk",
  url: "https://example.com/news",
  publishedAt: "2024-01-15T10:30:00Z",
  sentiment: "positive",
  votes: { up: 150, down: 20 },
  userVote: null,
  currencies: ["BTC"]
}
```

### 8. Testing

To test the integration:

1. Set up your API key
2. Complete the onboarding process with your preferences
3. Navigate to the Market News tab
4. You should see real news filtered by your preferences
5. Check the browser console for any API errors

### 9. Troubleshooting

**No news showing:**
- Check if API key is correctly set
- Verify internet connection
- Check browser console for errors
- App will fallback to mock data if API fails

**API rate limit exceeded:**
- Wait for the rate limit to reset (1 hour for free tier)
- Consider upgrading to a paid CryptoPanic plan
- App will use cached data during rate limit periods

**Wrong news showing:**
- Verify your onboarding preferences are set correctly
- Check if the preferences are being passed to the API correctly
- Clear browser cache and refresh

### 10. Privacy & Security

- API key is stored in environment variables (not in code)
- No user data is sent to CryptoPanic
- Only preference-based filtering is applied
- All API calls are made from the client-side (no server proxy needed)
