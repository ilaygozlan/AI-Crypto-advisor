import { useQuery } from '@tanstack/react-query'
import { newDashboardApi } from '@/lib/api/newEndpoints'

export function useMeme() {
  return useQuery({
    queryKey: ['meme'],
    queryFn: async () => {
      return await newDashboardApi.getMeme()
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (daily meme)
  })
}
