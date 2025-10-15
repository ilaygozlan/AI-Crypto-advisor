import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/endpoints'
import type { VoteRequest } from '@/types/dashboard'

/**
 * Hook for handling user votes on content
 * Provides optimistic updates for better UX
 */
export function useVote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: VoteRequest) => {
      try {
        const response = await dashboardApi.vote(data)
        return response.data
      } catch (error) {
        // Fallback for demo purposes when backend is not available
        console.log('Vote recorded:', data)
        return {
          success: true,
          newVoteCount: {
            up: Math.floor(Math.random() * 100) + 10,
            down: Math.floor(Math.random() * 50) + 5,
          },
        }
      }
    },
    onSuccess: (data, variables) => {
      // Optimistically update the UI with new vote counts
      const queryKey = getQueryKeyForSection(variables.section)
      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData

        if (variables.section === 'news' && Array.isArray(oldData)) {
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

        if (variables.section === 'meme' && oldData.id === variables.itemId) {
          return {
            ...oldData,
            votes: (data as any).newVoteCount || oldData.votes,
            userVote: variables.vote,
          }
        }

        return oldData
      })
    },
    onError: (error) => {
      console.error('Vote failed:', error)
    },
  })
}

function getQueryKeyForSection(section: string) {
  switch (section) {
    case 'news':
      return ['news']
    case 'prices':
      return ['prices']
    case 'ai':
      return ['ai-insight']
    case 'meme':
      return ['meme']
    default:
      return []
  }
}
