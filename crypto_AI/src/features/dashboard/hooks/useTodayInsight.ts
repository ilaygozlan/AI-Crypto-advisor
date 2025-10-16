import { useQuery } from '@tanstack/react-query'
import { insightsApi } from '@/lib/api/newEndpoints'
import { useAuth } from '@/contexts/AuthContext'

export function useTodayInsight() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['today-insight', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User ID is required')
      return await insightsApi.getTodayInsight(user.id)
    },
    enabled: !!user?.id,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (daily insight)
  })
}
