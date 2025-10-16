import { useQuery } from '@tanstack/react-query'
import { newDashboardApi } from '@/lib/api/newEndpoints'
import { fetchCryptoPanicPosts } from '@/lib/utils/cryptoPanic'
import { useAuth } from '@/contexts/AuthContext'

export function useNews() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['news', user?.preferences],
    queryFn: async () => {
      try {
        // Get user preferences from auth context
        const assets = user?.preferences?.selectedAssets?.length > 0 
          ? user.preferences.selectedAssets 
          : ['BTC', 'ETH', 'SOL'] // Default fallback assets

        // Get initial filter based on investor type
        const filter = user?.preferences?.investorType === 'Day Trader' ? 'hot' : 'important'

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
        console.error('❌ CryptoPanic API failed, trying backend API:', error)
        
        // Try the backend API as fallback
        return await newDashboardApi.getNews()
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Only retry once to avoid long delays
  })
}
