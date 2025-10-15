import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/endpoints'
import { fetchCryptoPanicPosts } from '@/lib/utils/cryptoPanic'
import { getPreferences } from '@/lib/utils/cryptoPrefs'
import { onboarding } from '@/app/data/onboarding'

export function useNews() {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      try {
        // Get user preferences
        const preferences = getPreferences()
        
        // Use onboarding assets if preferences are empty
        const assets = preferences.assets.length > 0 
          ? preferences.assets 
          : onboarding.data.selectedAssets.length > 0 
            ? onboarding.data.selectedAssets 
            : ['BTC', 'SOL', 'AVAX', 'MATIC'] // Fallback assets

        // Get initial filter based on investor type
        const filter = preferences.filter || 
          (onboarding.data.investorType === 'day_trader' ? 'hot' : 'important')

        // Fetch from CryptoPanic API
        console.log('📰 Fetching news with preferences:', { filter, assets })
        const response = await fetchCryptoPanicPosts(filter, assets, 1)
        
        // Transform to app format - show all results
        const transformedData = response.results.map(item => ({
          id: item.id,
          title: item.title,
          summary: item.description || item.title,
          content: item.description || item.title,
          source: item.source?.title || 'Unknown',
          url: item.url || '#',
          publishedAt: item.published_at,
          sentiment: (item.votes?.positive || 0) > (item.votes?.negative || 0) ? 'positive' : 
                    (item.votes?.negative || 0) > (item.votes?.positive || 0) ? 'negative' : 'neutral',
          votes: {
            up: (item.votes?.positive || 0) + (item.votes?.liked || 0),
            down: (item.votes?.negative || 0) + (item.votes?.disliked || 0)
          },
          userVote: null,
          currencies: item.currencies?.map(c => c.code) || []
        }))
        
        console.log('📰 Successfully transformed news data:', { count: transformedData.length })
        return transformedData
      } catch (error) {
        console.error('❌ CryptoPanic API failed, falling back to mock data:', error)
        
        try {
          // Try the original API first
          const response = await dashboardApi.getNews()
          return response.data.data
        } catch (apiError) {
          // Fallback to mock data if both APIs fail
          const mockResponse = await fetch('/mocks/news.json')
          const mockData = await mockResponse.json()
          return mockData.data
        }
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Only retry once to avoid long delays
  })
}
