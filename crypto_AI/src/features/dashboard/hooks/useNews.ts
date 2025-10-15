import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/endpoints'
import type { NewsItem } from '@/types/dashboard'

export function useNews() {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      try {
        const response = await dashboardApi.getNews()
        return response.data.data
      } catch (error) {
        // Fallback to mock data if API fails
        const mockResponse = await fetch('/mocks/news.json')
        const mockData = await mockResponse.json()
        return mockData.data
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
