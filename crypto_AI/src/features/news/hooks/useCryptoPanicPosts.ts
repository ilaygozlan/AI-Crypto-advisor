import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { transformStaticNewsData } from '@/data/staticNews'
import { 
  getPreferences, 
  setPreferences, 
  getReactions, 
  setReaction,
  type ReactionType 
} from '@/lib/utils/cryptoPrefs'

export type FilterType = 'hot' | 'rising' | 'important' | 'bullish' | 'bearish'
import { 
  calculatePersonalizationScore, 
  updateWeights, 
  sortPostsByScore,
  type ScoredPost 
} from '@/lib/utils/scoring'
import { useAuth } from '@/contexts/AuthContext'

// Debounce utility
function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number): T {
  const timeoutRef = useRef<number>()
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = window.setTimeout(() => callback(...args), delay)
  }, [callback, delay]) as T
}

export function useCryptoPanicPosts() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const abortControllerRef = useRef<AbortController>()

  // Get current preferences
  const preferences = getPreferences()
  const reactions = getReactions()
  
  // Initialize with user preferences if available
  const initialAssets = preferences.assets.length > 0 
    ? preferences.assets 
    : user?.preferences?.selectedAssets && user.preferences.selectedAssets.length > 0
      ? user.preferences.selectedAssets 
      : ['BTC', 'SOL', 'AVAX', 'MATIC'] // Fallback assets

  const initialFilter = preferences.filter || 
    (user?.preferences?.investorType === 'day_trader' ? 'hot' : 'important')

  // Update preferences if they were initialized
  if (preferences.assets.length === 0) {
    setPreferences({ assets: initialAssets, filter: initialFilter })
  }

  // Main query for posts
  const postsQuery = useQuery({
    queryKey: ['crypto-panic-posts', preferences.filter, preferences.assets.sort().join(',')],
    queryFn: async () => {
      // Abort previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      
      // Create new abort controller
      abortControllerRef.current = new AbortController()
      // Note: signal is available from the query function parameter

      try {
        // Use static news data instead of server API
        const newsItems = transformStaticNewsData()

        // Transform static data to match expected format
        const transformedPosts = newsItems.map(item => ({
          id: item.id,
          title: item.title,
          url: item.url,
          published_at: item.published_at,
          created_at: item.created_at,
          domain: new URL(item.url).hostname,
          slug: item.id,
          kind: 'news',
          description: item.description || item.title,
          source: {
            title: item.source || 'cryptopanic',
            region: 'en',
            domain: new URL(item.url).hostname
          },
          currencies: (item.currencies as string[])?.map(code => ({
            code,
            title: code,
            slug: code.toLowerCase(),
            url: `https://cryptopanic.com/currencies/${code.toLowerCase()}/`
          })) || [],
          votes: {
            negative: 0,
            positive: 0,
            important: item.is_important ? 1 : 0,
            liked: 0,
            disliked: 0,
            lol: 0,
            toxic: 0,
            saved: 0,
            comments: 0
          },
          metadata: {
            description: item.description || item.title
          }
        }))

        // Transform to scored posts
        const scoredPosts: ScoredPost[] = transformedPosts.map(post => {
          const userReaction = reactions[post.id] || null
          
          // Convert string id to number for compatibility with CryptoPanicPost type
          const cryptoPanicPost = {
            ...post,
            id: parseInt(post.id, 10) || 0
          }
          
          const score = calculatePersonalizationScore(
            cryptoPanicPost,
            preferences.weights,
            userReaction,
            user?.preferences?.selectedAssets || ['BTC', 'ETH', 'SOL'],
            preferences.filter,
            user?.preferences?.investorType || 'investor'
          )

          return {
            ...cryptoPanicPost,
            personalizationScore: score,
            userReaction
          }
        })

        // Sort by personalization score
        return sortPostsByScore(scoredPosts)
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request was cancelled')
        }
        throw error
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })

  // Mutation for reactions
  const reactionMutation = useMutation({
    mutationFn: async ({ 
      postId, 
      reaction 
    }: { 
      postId: string
      reaction: ReactionType | null 
    }) => {
      const post = postsQuery.data?.find(p => String(p.id) === postId)
      if (!post) throw new Error('Post not found')

      const previousReaction = reactions[postId] || null
      
      // Update reaction
      setReaction(postId, reaction)
      
      // Update weights
      const newWeights = updateWeights(
        preferences.weights,
        post,
        reaction,
        previousReaction
      )
      
      setPreferences({ weights: newWeights })
      
      return { postId, reaction, previousReaction }
    },
    onSuccess: () => {
      // Invalidate and refetch to update scores
      queryClient.invalidateQueries({ queryKey: ['crypto-panic-posts'] })
    },
  })

  // Debounced filter update
  const debouncedUpdateFilter = useDebounce((filter: FilterType) => {
    setPreferences({ filter })
    queryClient.invalidateQueries({ queryKey: ['crypto-panic-posts'] })
  }, 500)

  // Debounced assets update
  const debouncedUpdateAssets = useDebounce((assets: string[]) => {
    setPreferences({ assets })
    queryClient.invalidateQueries({ queryKey: ['crypto-panic-posts'] })
  }, 500)

  // Reset to user preferences or defaults
  const resetToDefaults = useCallback(() => {
    const defaultAssets = user?.preferences?.selectedAssets && user.preferences.selectedAssets.length > 0 
      ? user.preferences.selectedAssets 
      : ['BTC', 'SOL', 'AVAX', 'MATIC']
    
    const defaultFilter = user?.preferences?.investorType === 'day_trader' ? 'hot' : 'important'
    
    setPreferences({ 
      assets: defaultAssets, 
      filter: defaultFilter,
      weights: { assets: {}, tags: {}, sources: {} }
    })
    
    queryClient.invalidateQueries({ queryKey: ['crypto-panic-posts'] })
  }, [queryClient, user])

  return {
    posts: postsQuery.data || [],
    isLoading: postsQuery.isLoading,
    error: postsQuery.error,
    refetch: postsQuery.refetch,
    preferences,
    updateFilter: debouncedUpdateFilter,
    updateAssets: debouncedUpdateAssets,
    resetToDefaults,
    handleReaction: reactionMutation.mutate,
    isReacting: reactionMutation.isPending,
  }
}
