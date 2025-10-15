import { useState, useEffect } from 'react'
import { cryptoPanicService, type CryptoPanicFilters } from '@/lib/api/cryptopanic'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/common/Card'
import { ExternalLink, TrendingUp, TrendingDown, Shield, Zap } from 'lucide-react'

interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  source: string
  url: string
  publishedAt: string
  sentiment: 'positive' | 'negative' | 'neutral'
  votes: { up: number; down: number }
  userVote: null
  currencies: string[]
}

export function CryptoPanicDemo() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [currentFilter, setCurrentFilter] = useState('general')
  const [error, setError] = useState<string | null>(null)

  const filterOptions = [
    {
      id: 'general',
      label: 'General News',
      description: 'All crypto news',
      icon: <TrendingUp className="h-4 w-4" />,
      filters: { regions: ['en'], kind: 'news' as const, public: true }
    },
    {
      id: 'hodler',
      label: 'HODLer (Conservative)',
      description: 'Important & reliable news',
      icon: <Shield className="h-4 w-4" />,
      filters: { regions: ['en'], kind: 'news' as const, public: true, filter: 'important' as const }
    },
    {
      id: 'trader',
      label: 'Day Trader (Moderate)',
      description: 'Hot & trending news',
      icon: <TrendingUp className="h-4 w-4" />,
      filters: { regions: ['en'], kind: 'news' as const, public: true, filter: 'hot' as const }
    },
    {
      id: 'nft',
      label: 'NFT Collector (Aggressive)',
      description: 'Bullish & high-impact news',
      icon: <Zap className="h-4 w-4" />,
      filters: { regions: ['en'], kind: 'news' as const, public: true, filter: 'bullish' as const }
    },
    {
      id: 'bitcoin',
      label: 'Bitcoin Focus',
      description: 'BTC-specific news',
      icon: <TrendingUp className="h-4 w-4" />,
      filters: { currencies: ['BTC'], regions: ['en'], kind: 'news' as const, public: true }
    }
  ]

  const fetchNews = async (filters: CryptoPanicFilters) => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await cryptoPanicService.fetchNews(filters)
      const transformedNews = data.results
        .slice(0, 5) // Show top 5 items
        .map(item => cryptoPanicService.transformToAppFormat(item))
      
      setNews(transformedNews)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      console.error('CryptoPanic API Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterId: string) => {
    setCurrentFilter(filterId)
    const filter = filterOptions.find(f => f.id === filterId)
    if (filter) {
      fetchNews(filter.filters)
    }
  }

  useEffect(() => {
    // Load general news on component mount
    fetchNews(filterOptions[0].filters)
  }, [])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          🚀 CryptoPanic API Demo
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Real-time cryptocurrency news filtered by user preferences
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {filterOptions.map((option) => (
          <Button
            key={option.id}
            variant={currentFilter === option.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange(option.id)}
            className="flex items-center gap-2"
          >
            {option.icon}
            {option.label}
          </Button>
        ))}
      </div>

      {/* Current Filter Info */}
      {currentFilter && (
        <div className="text-center">
          <Badge variant="secondary" className="mb-2">
            {filterOptions.find(f => f.id === currentFilter)?.description}
          </Badge>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
            Fetching latest crypto news...
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <div className="text-red-600 dark:text-red-400">
            ❌ Error: {error}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            This might be due to API rate limits or network issues.
          </p>
        </div>
      )}

      {/* News Items */}
      {!loading && !error && news.length > 0 && (
        <div className="space-y-4">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">
              📰 {news.length} Latest News Items
            </Badge>
          </div>
          
          {news.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                    {item.title}
                  </h3>
                  <Badge 
                    variant={item.sentiment === 'positive' ? 'default' : item.sentiment === 'negative' ? 'destructive' : 'secondary'}
                    className="ml-2 flex-shrink-0"
                  >
                    {item.sentiment}
                  </Badge>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {item.summary}
                </p>
                
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{item.source}</span>
                    <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                    {item.currencies.length > 0 && (
                      <span>💰 {item.currencies.join(', ')}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      {item.votes.up}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingDown className="h-3 w-3 text-red-600" />
                      {item.votes.down}
                    </span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    Read full article
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* No News State */}
      {!loading && !error && news.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-600 dark:text-slate-400">
            No news items found for the selected filter.
          </p>
        </div>
      )}
    </div>
  )
}
