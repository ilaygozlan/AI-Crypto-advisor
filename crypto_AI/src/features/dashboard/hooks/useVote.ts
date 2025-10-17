import { useMutation, useQueryClient } from '@tanstack/react-query'
import { newDashboardApi } from '@/lib/api/newEndpoints'
import type { VoteRequest } from '@/types/dashboard'

/**
 * Hook for handling user votes on content
 * Provides optimistic updates for better UX
 */
export function useVote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: VoteRequest) => {
      return await newDashboardApi.vote(data)
    },
    onSuccess: (data, variables) => {
      // Optimistically update the UI with new vote counts
      // For news, we need to update all queries that start with 'news'
      if (variables.section === 'news') {
        queryClient.setQueriesData(
          { queryKey: ['news'] },
          (oldData: any) => {
            if (!oldData || !Array.isArray(oldData)) return oldData

            return oldData.map((item: any) =>
              item.id === variables.itemId
                ? {
                    ...item,
                    votes: (data as any).newVoteCount || item.votes,
                    userVote: variables.vote,
                  }
                : item
            )
          }
        )
      } else {
        // For other sections, use the original logic
        const queryKey = getQueryKeyForSection(variables.section)
        queryClient.setQueryData(queryKey, (oldData: any) => {
          if (!oldData) return oldData

          if (variables.section === 'prices' && Array.isArray(oldData)) {
            return oldData.map((item: any) =>
              item.id === variables.itemId
                ? {
                    ...item,
                    votes: (data as any).newVoteCount || item.votes,
                    userVote: variables.vote,
                  }
                : item
            )
          }

          if (variables.section === 'ai' && oldData.id === variables.itemId) {
            return {
              ...oldData,
              votes: (data as any).newVoteCount || oldData.votes,
              userVote: variables.vote,
            }
          }

          if (variables.section === 'meme' && Array.isArray(oldData)) {
            return oldData.map((item: any) =>
              item.id === variables.itemId
                ? {
                    ...item,
                    votes: (data as any).newVoteCount || item.votes,
                    user_reaction: variables.vote === 'up' ? 'like' : variables.vote === 'down' ? 'dislike' : null,
                  }
                : item
            )
          }

          return oldData
        })
      }
    },
    onError: (error) => {
      console.error('Vote failed:', error)
    },
  })
}

function getQueryKeyForSection(section: string) {
  switch (section) {
    case 'news':
      return ['news'] // This will match any query starting with 'news'
    case 'prices':
      return ['prices']
    case 'ai':
      return ['today-insight'] // Updated to match the useTodayInsight hook
    case 'meme':
      return ['meme-data'] // Updated to match the custom hook
    default:
      return []
  }
}
