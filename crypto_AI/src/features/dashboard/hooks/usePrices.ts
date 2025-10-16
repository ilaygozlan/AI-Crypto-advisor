import { useQuery } from '@tanstack/react-query'
import { newDashboardApi } from '@/lib/api/newEndpoints'

export function usePrices() {
  return useQuery({
    queryKey: ['prices'],
    queryFn: async () => {
      return await newDashboardApi.getPrices()
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
