import { useQuery } from '@tanstack/react-query'
import { newDashboardApi } from '@/lib/api/newEndpoints'
import { useAuth } from '@/contexts/AuthContext'
import { transformStaticNewsData } from '@/data/staticNews'
import type { NewsItem } from '@/types/dashboard'

export function useNews() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['news', user?.id],
    queryFn: async () => {
      // Use static news data instead of fetching from server
      console.log('📰 Using static news data')
      const newsItems = transformStaticNewsData()
      
      // Transform to app format - show all results
      const transformedData: NewsItem[] = newsItems.map(item => ({
        id: String(item.id),
        title: item.title,
        summary: item.description || item.title, // Use description as summary
        source: item.source || 'cryptopanic',
        url: item.url || '#',
        publishedAt: item.published_at,
        votes: {
          up: item.is_important ? 1 : 0, // Use importance as upvotes
          down: 0
        },
        userVote: null, // Will be populated below
      }))
      
      // If user is logged in, fetch their reactions for these news items
      if (user?.id && transformedData.length > 0) {
        try {
          const newsIds = transformedData.map(item => item.id)
          console.log('📰 Fetching user reactions for news items')
          const reactionsData = await newDashboardApi.getNewsReactions(newsIds.map(String))
          
          // Enrich news items with user reactions and vote counts
          transformedData.forEach(item => {
            item.userVote = reactionsData.userReactions[item.id] || null
            if (reactionsData.voteCounts[item.id]) {
              item.votes = reactionsData.voteCounts[item.id]
            }
          })
          
          console.log('📰 Successfully enriched news with user reactions')
        } catch (error) {
          console.error('❌ Failed to fetch user reactions:', error)
          // Continue without user reactions
        }
      }
      
      console.log('📰 Successfully transformed news data:', { count: transformedData.length })
      return transformedData
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Only retry once to avoid long delays
  })
}
