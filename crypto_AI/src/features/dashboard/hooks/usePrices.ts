import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/endpoints'
import type { PriceData } from '@/types/dashboard'

export function usePrices() {
  return useQuery({
    queryKey: ['prices'],
    queryFn: async () => {
      try {
        const response = await dashboardApi.getPrices()
        return response.data.data
      } catch (error) {
        // Fallback to mock data if API fails
        const mockResponse = await fetch('/mocks/prices.json')
        const mockData = await mockResponse.json()
        return mockData.data
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
