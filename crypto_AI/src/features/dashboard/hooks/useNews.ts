import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/endpoints'
import { cryptoPanicService } from '@/lib/api/cryptopanic'
import { usePrefsStore } from '@/lib/state/prefs.store'

export function useNews() {
  const { assets, investorType, contentTypes } = usePrefsStore()

  return useQuery({
    queryKey: ['news', assets, investorType, contentTypes],
    queryFn: async () => {
      try {
        // Try to get real data from CryptoPanic API
        const userFilters = cryptoPanicService.getUserFilters({
          assets,
          investorType,
          contentTypes
        })
        
        const cryptoPanicData = await cryptoPanicService.fetchNews(userFilters)
        
        // Transform the data to our app format
        const transformedData = cryptoPanicData.results
          .slice(0, 10) // Limit to 10 items
          .map(item => cryptoPanicService.transformToAppFormat(item))
        
        return transformedData
      } catch (error) {
        console.warn('CryptoPanic API failed, falling back to mock data:', error)
        
        try {
          // Try the original API first
          const response = await dashboardApi.getNews()
          return response.data.data
        } catch (apiError) {
          // Fallback to mock data if both APIs fail
          const mockResponse = await fetch('/mocks/news.json')
          const mockData = await mockResponse.json()
          return mockData.data
        }
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Only retry once to avoid long delays
  })
}
