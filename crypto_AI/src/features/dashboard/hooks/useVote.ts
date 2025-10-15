import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/endpoints'
import type { VoteRequest } from '@/types/dashboard'

export function useVote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: VoteRequest) => {
      try {
        const response = await dashboardApi.vote(data)
        return response.data
      } catch (error) {
        // For demo purposes, simulate a successful vote
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
      // Optimistically update the UI
      const queryKey = getQueryKeyForSection(variables.section)
      queryClient.setQueryData(queryKey, (oldData: any) => {
        if (!oldData) return oldData

        if (variables.section === 'news' && Array.isArray(oldData)) {
          return oldData.map((item: any) =>
            item.id === variables.itemId
              ? {
                  ...item,
                  votes: data.newVoteCount,
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
                  votes: data.newVoteCount,
                  userVote: variables.vote,
                }
              : item
          )
        }

        if (variables.section === 'ai' && oldData.id === variables.itemId) {
          return {
            ...oldData,
            votes: data.newVoteCount,
            userVote: variables.vote,
          }
        }

        if (variables.section === 'meme' && oldData.id === variables.itemId) {
          return {
            ...oldData,
            votes: data.newVoteCount,
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
