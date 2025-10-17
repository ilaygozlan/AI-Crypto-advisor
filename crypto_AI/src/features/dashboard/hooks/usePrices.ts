import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { getMarkets } from '@/lib/api/coinGecko'
import { mapAssetsToCoinGeckoIds, getUnmappedAssets } from '@/lib/utils/coinMapping'

export function usePrices() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['prices', user?.preferences?.selectedAssets],
    queryFn: async () => {
      try {
        // Get user's selected assets from auth context
        const selectedAssets = user?.preferences?.selectedAssets || ['BTC', 'ETH', 'SOL']
        
        // Map symbols to CoinGecko IDs
        const coinGeckoIds = mapAssetsToCoinGeckoIds(selectedAssets)
        const unmappedAssets = getUnmappedAssets(selectedAssets)
        
        // Log unmapped assets for debugging
        if (unmappedAssets.length > 0) {
          console.warn('Unmapped assets (will be excluded):', unmappedAssets)
        }
        
        if (coinGeckoIds.length === 0) {
          throw new Error('No valid assets to fetch prices for')
        }
        
      
        
        // Fetch market data from CoinGecko
        const marketData = await getMarkets(coinGeckoIds, 'usd')
        
        // Transform to app format
        const transformedData = marketData.map(coin => ({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          image: coin.image,
          current_price: coin.current_price,
          market_cap: coin.market_cap,
          market_cap_rank: coin.market_cap_rank,
          price_change_percentage_1h: coin.price_change_percentage_1h_in_currency,
          price_change_percentage_24h: coin.price_change_percentage_24h_in_currency,
          price_change_percentage_7d: coin.price_change_percentage_7d_in_currency,
        }))
        
        return transformedData
      } catch (error) {
        console.error('❌ Failed to fetch prices:', error)
        throw error
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // 1 minute
    retry: 2,
    enabled: !!user, // Only fetch when user is logged in
  })
}
