import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/endpoints'
import type { MemeItem } from '@/types/dashboard'

export function useMeme() {
  return useQuery({
    queryKey: ['meme'],
    queryFn: async () => {
      try {
        const response = await dashboardApi.getMeme()
        return response.data.data
      } catch (error) {
        // Fallback to mock data if API fails
        const mockResponse = await fetch('/mocks/meme.json')
        const mockData = await mockResponse.json()
        return mockData.data
      }
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (daily meme)
  })
}
