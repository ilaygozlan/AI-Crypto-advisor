import { useQuery } from '@tanstack/react-query'
import { getChart } from '@/lib/api/coinGecko'

export interface ChartData {
  timestamp: number;
  price: number;
  marketCap: number;
  volume: number;
}

export interface UseChartOptions {
  coinId: string;
  vsCurrency?: string;
  days?: number;
  enabled?: boolean;
}

export function useChart({ 
  coinId, 
  vsCurrency = 'usd', 
  days = 7, 
  enabled = true 
}: UseChartOptions) {
  return useQuery({
    queryKey: ['chart', coinId, vsCurrency, days],
    queryFn: async (): Promise<ChartData[]> => {
      try {
        console.log('📈 Fetching chart data for:', { coinId, vsCurrency, days })
        
        const chartData = await getChart(coinId, vsCurrency, days)
        
        // Transform chart data to our format
        const transformedData: ChartData[] = chartData.prices.map((pricePoint, index) => ({
          timestamp: pricePoint[0],
          price: pricePoint[1],
          marketCap: chartData.market_caps[index]?.[1] || 0,
          volume: chartData.total_volumes[index]?.[1] || 0,
        }))
        
        console.log('📈 Successfully fetched chart data:', { 
          coinId, 
          dataPoints: transformedData.length 
        })
        
        return transformedData
      } catch (error) {
        console.error('❌ Failed to fetch chart data:', error)
        throw error
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled: enabled && !!coinId, // Only fetch when enabled and coinId is provided
  })
}
