// CryptoPanic API service for fetching real cryptocurrency news
// Documentation: https://cryptopanic.com/developers/api/

export interface CryptoPanicNewsItem {
  id: string
  title: string
  url: string
  published_at: string
  domain: string
  source: {
    title: string
    region: string
    domain: string
  }
  currencies?: Array<{
    code: string
    title: string
    slug: string
    url: string
  }>
  votes: {
    negative: number
    positive: number
    important: number
    liked: number
    disliked: number
    lol: number
    toxic: number
    saved: number
    comments: number
  }
  metadata?: {
    description?: string
  }
}

export interface CryptoPanicResponse {
  count: number
  next: string | null
  previous: string | null
  results: CryptoPanicNewsItem[]
}

export interface CryptoPanicFilters {
  currencies?: string[] // e.g., ['BTC', 'ETH']
  regions?: string[] // e.g., ['en', 'es']
  filter?: 'rising' | 'hot' | 'bullish' | 'bearish' | 'important' | 'saved' | 'lol'
  kind?: 'news' | 'media'
  public?: boolean
}

class CryptoPanicService {
  private baseUrl = 'https://cryptopanic.com/api/v1'
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || (import.meta as any).env?.VITE_CRYPTOPANIC_API_KEY || ''
  }

  /**
   * Fetch news from CryptoPanic API with optional filters
   */
  async fetchNews(filters: CryptoPanicFilters = {}): Promise<CryptoPanicResponse> {
    const params = new URLSearchParams()
    
    // Add API key if available
    if (this.apiKey) {
      params.append('auth_token', this.apiKey)
    }

    // Add filters
    if (filters.currencies && filters.currencies.length > 0) {
      params.append('currencies', filters.currencies.join(','))
    }
    
    if (filters.regions && filters.regions.length > 0) {
      params.append('regions', filters.regions.join(','))
    }
    
    if (filters.filter) {
      params.append('filter', filters.filter)
    }
    
    if (filters.kind) {
      params.append('kind', filters.kind)
    }

    // Set public to true to get public posts
    params.append('public', 'true')

    const url = `${this.baseUrl}/posts/?${params.toString()}`
    
    try {
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`CryptoPanic API error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching from CryptoPanic API:', error)
      throw error
    }
  }

  /**
   * Transform CryptoPanic data to our app's format
   */
  transformToAppFormat(cryptoPanicItem: CryptoPanicNewsItem) {
    return {
      id: cryptoPanicItem.id,
      title: cryptoPanicItem.title,
      summary: cryptoPanicItem.metadata?.description || cryptoPanicItem.title,
      content: cryptoPanicItem.metadata?.description || cryptoPanicItem.title,
      source: cryptoPanicItem.source.title,
      url: cryptoPanicItem.url,
      publishedAt: cryptoPanicItem.published_at,
      sentiment: this.determineSentiment(cryptoPanicItem.votes),
      votes: {
        up: cryptoPanicItem.votes.positive + cryptoPanicItem.votes.liked,
        down: cryptoPanicItem.votes.negative + cryptoPanicItem.votes.disliked
      },
      userVote: null, // Will be set by the app based on user interaction
      currencies: cryptoPanicItem.currencies?.map(c => c.code) || []
    }
  }

  /**
   * Determine sentiment based on votes
   */
  private determineSentiment(votes: CryptoPanicNewsItem['votes']): 'positive' | 'negative' | 'neutral' {
    const positive = votes.positive + votes.liked
    const negative = votes.negative + votes.disliked
    
    if (positive > negative * 1.5) return 'positive'
    if (negative > positive * 1.5) return 'negative'
    return 'neutral'
  }

  /**
   * Get filters based on user preferences
   */
  getUserFilters(userPrefs: {
    assets?: string[]
    investorType?: 'HODLer' | 'Day Trader' | 'NFT Collector' | null
    contentTypes?: string[]
  }): CryptoPanicFilters {
    const filters: CryptoPanicFilters = {
      regions: ['en'], // Default to English
      kind: 'news',
      public: true
    }

    // Add currency filters based on selected assets
    if (userPrefs.assets && userPrefs.assets.length > 0) {
      filters.currencies = userPrefs.assets
    }

    // Add sentiment filter based on investor type
    if (userPrefs.investorType) {
      switch (userPrefs.investorType) {
        case 'HODLer':
          filters.filter = 'important'
          break
        case 'Day Trader':
          filters.filter = 'hot'
          break
        case 'NFT Collector':
          filters.filter = 'bullish'
          break
      }
    }

    return filters
  }
}

// Export singleton instance
export const cryptoPanicService = new CryptoPanicService()

// Export the class for testing
export { CryptoPanicService }
