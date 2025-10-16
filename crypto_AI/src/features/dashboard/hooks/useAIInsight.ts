import { useQuery } from '@tanstack/react-query'
import { newDashboardApi } from '@/lib/api/newEndpoints'

export function useAIInsight() {
  return useQuery({
    queryKey: ['ai-insight'],
    queryFn: async () => {
      return await newDashboardApi.getAIInsight()
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (daily insight)
  })
}
