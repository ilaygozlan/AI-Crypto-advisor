// Mock API responses for standalone frontend development
export const mockApi = {
  // Mock user data
  user: {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // Mock auth responses
  auth: {
    signup: {
      success: true,
      data: {
        user: {
          id: '1',
          email: 'demo@example.com',
          name: 'Demo User',
        },
        accessToken: 'mock-access-token-12345',
      },
      message: 'User created successfully',
    },
    
    login: {
      success: true,
      data: {
        user: {
          id: '1',
          email: 'demo@example.com',
          name: 'Demo User',
        },
        accessToken: 'mock-access-token-12345',
      },
      message: 'Login successful',
    },

    refresh: {
      success: true,
      data: {
        accessToken: 'mock-refreshed-token-67890',
      },
    },

    me: {
      success: true,
      data: {
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  },

  // Mock dashboard data
  dashboard: {
    news: {
      success: true,
      data: [
        {
          id: '1',
          title: 'Bitcoin Reaches New All-Time High',
          content: 'Bitcoin has reached a new all-time high of $100,000...',
          source: 'CoinDesk',
          publishedAt: new Date().toISOString(),
          sentiment: 'positive',
        },
        {
          id: '2',
          title: 'Ethereum 2.0 Upgrade Complete',
          content: 'The Ethereum network has successfully completed its 2.0 upgrade...',
          source: 'Ethereum Foundation',
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          sentiment: 'positive',
        },
      ],
    },

    prices: {
      success: true,
      data: [
        {
          id: '1',
          symbol: 'BTC',
          name: 'Bitcoin',
          price: 100000,
          change24h: 5.2,
          marketCap: 2000000000000,
          volume24h: 50000000000,
        },
        {
          id: '2',
          symbol: 'ETH',
          name: 'Ethereum',
          price: 3500,
          change24h: -2.1,
          marketCap: 420000000000,
          volume24h: 20000000000,
        },
      ],
    },

    aiInsight: {
      success: true,
      data: {
        id: '1',
        title: 'Market Analysis: Bullish Trend Expected',
        content: 'Based on current market indicators and sentiment analysis, we expect a bullish trend in the coming weeks...',
        confidence: 85,
        createdAt: new Date().toISOString(),
      },
    },

    meme: {
      success: true,
      data: {
        id: '1',
        title: 'HODL Strong 💎🙌',
        imageUrl: 'https://via.placeholder.com/400x300/1f2937/ffffff?text=HODL+Strong',
        upvotes: 1250,
        downvotes: 45,
        createdAt: new Date().toISOString(),
      },
    },
  },

  // Mock voting data
  vote: {
    success: true,
    data: {
      id: '1',
      section: 'meme',
      itemId: '1',
      vote: 'up',
      createdAt: new Date().toISOString(),
    },
  },
}

// Mock API delay to simulate network requests
export const mockDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms))

// Mock API client that returns mock data
export const createMockApiClient = () => {
  return {
    post: async (url: string, data?: any) => {
      await mockDelay()
      
      if (url.includes('/auth/signup')) {
        return { data: mockApi.auth.signup }
      }
      if (url.includes('/auth/login')) {
        return { data: mockApi.auth.login }
      }
      if (url.includes('/auth/refresh')) {
        return { data: mockApi.auth.refresh }
      }
      if (url.includes('/vote')) {
        return { data: mockApi.vote }
      }
      
      throw new Error(`Mock API: POST ${url} not implemented`)
    },

    get: async (url: string) => {
      await mockDelay()
      
      if (url.includes('/me')) {
        return { data: mockApi.auth.me }
      }
      if (url.includes('/dashboard/news')) {
        return { data: mockApi.dashboard.news }
      }
      if (url.includes('/dashboard/prices')) {
        return { data: mockApi.dashboard.prices }
      }
      if (url.includes('/dashboard/ai-insight')) {
        return { data: mockApi.dashboard.aiInsight }
      }
      if (url.includes('/dashboard/meme')) {
        return { data: mockApi.dashboard.meme }
      }
      
      throw new Error(`Mock API: GET ${url} not implemented`)
    },
  }
}
