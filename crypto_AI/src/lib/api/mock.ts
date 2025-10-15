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
      message: 'Login successful - Mock mode accepts any credentials',
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
          summary: 'Bitcoin has reached a new all-time high of $100,000, driven by institutional adoption and positive market sentiment.',
          content: 'Bitcoin has reached a new all-time high of $100,000...',
          source: 'CoinDesk',
          url: 'https://coindesk.com/bitcoin-all-time-high',
          publishedAt: new Date().toISOString(),
          sentiment: 'positive',
          votes: {
            up: 1250,
            down: 45
          },
          userVote: null
        },
        {
          id: '2',
          title: 'Ethereum 2.0 Upgrade Complete',
          summary: 'The Ethereum network has successfully completed its 2.0 upgrade, improving scalability and reducing energy consumption.',
          content: 'The Ethereum network has successfully completed its 2.0 upgrade...',
          source: 'Ethereum Foundation',
          url: 'https://ethereum.org/eth2-upgrade',
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          sentiment: 'positive',
          votes: {
            up: 890,
            down: 23
          },
          userVote: null
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
          currentPrice: 100000,
          priceChangePercentage24h: 5.2,
          marketCap: 2000000000000,
          volume24h: 50000000000,
          votes: {
            up: 2100,
            down: 89
          }
        },
        {
          id: '2',
          symbol: 'ETH',
          name: 'Ethereum',
          currentPrice: 3500,
          priceChangePercentage24h: -2.1,
          marketCap: 420000000000,
          volume24h: 20000000000,
          votes: {
            up: 1800,
            down: 67
          }
        },
        {
          id: '3',
          symbol: 'ADA',
          name: 'Cardano',
          currentPrice: 0.45,
          priceChangePercentage24h: 3.8,
          marketCap: 15000000000,
          volume24h: 800000000,
          votes: {
            up: 950,
            down: 34
          }
        },
      ],
    },

    aiInsight: {
      success: true,
      data: {
        id: '1',
        title: 'Market Analysis: Bullish Trend Expected',
        content: 'Based on current market indicators and sentiment analysis, we expect a bullish trend in the coming weeks. The recent institutional adoption and positive regulatory developments suggest strong fundamentals for major cryptocurrencies.',
        confidence: 85,
        generatedAt: new Date().toISOString(),
        votes: {
          up: 1560,
          down: 78
        },
        userVote: null
      },
    },

    meme: {
      success: true,
      data: {
        id: '1',
        title: 'HODL Strong 💎🙌',
        caption: 'When the market dips but you know the fundamentals are solid',
        imageUrl: 'https://via.placeholder.com/400x300/1f2937/ffffff?text=HODL+Strong',
        source: 'r/cryptocurrency',
        votes: {
          up: 1250,
          down: 45
        },
        userVote: null,
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

  // Mock onboarding data
  onboarding: {
    success: true,
    data: {
      id: '1',
      userId: '1',
      investorType: 'conservative',
      selectedAssets: ['BTC', 'ETH'],
      selectedContentTypes: ['news', 'prices'],
      completedAt: new Date().toISOString(),
    },
    message: 'Onboarding completed successfully',
  },
}

// Mock API delay to simulate network requests
export const mockDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms))

// Mock API client that returns mock data
export const createMockApiClient = () => {
  console.log('🎭 Creating Mock API Client')
  return {
        post: async (url: string, _data?: any) => {
      console.log('🎭 Mock API POST request:', url, _data)
      await mockDelay()
      
      if (url.includes('/auth/signup')) {
        console.log('🎭 Returning signup response:', mockApi.auth.signup)
        return { data: mockApi.auth.signup }
      }
      if (url.includes('/auth/login')) {
        console.log('🎭 Returning login response:', mockApi.auth.login)
        return { data: mockApi.auth.login }
      }
      if (url.includes('/auth/refresh')) {
        return { data: mockApi.auth.refresh }
      }
      if (url.includes('/vote')) {
        return { data: mockApi.vote }
      }
      if (url.includes('/onboarding')) {
        return { data: mockApi.onboarding }
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

    // Add interceptors property to match axios interface
    interceptors: {
      request: {
        use: () => {}, // No-op for mock
      },
      response: {
        use: () => {}, // No-op for mock
      },
    },
  }
}
