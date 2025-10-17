import { Skeleton } from '@/components/common/Skeleton'
import { VoteButtons } from '@/components/common/VoteButtons'
import { usePrices } from '../hooks/usePrices'
import { useVote } from '../hooks/useVote'
import { PriceRow } from '../components/PriceRow'
import { useAuth } from '@/contexts/AuthContext'

export default function CoinPricesPanel() {
  const { data: prices, isLoading, error } = usePrices()
  const { mutate: vote } = useVote()
  const { user } = useAuth()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800" />
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load prices</p>
      </div>
    )
  }

  if (!prices || prices.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No price data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <span className="text-green-600 dark:text-green-400 text-lg">💰</span>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Coin Prices</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Your selected cryptocurrencies
            {user?.preferences?.selectedAssets && (
              <span className="ml-1 text-xs">
                ({user.preferences.selectedAssets.join(', ')})
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="space-y-0">
        {prices.map((price) => (
          <PriceRow 
            key={price.id} 
            coin={price} 
            showChart={true}
            onVote={(coinId, voteType) => {
              console.log(`Vote ${voteType} for coin ${coinId}`)
              // The PriceRow component now handles localStorage interaction
            }}
          />
        ))}
      </div>

    </div>
  )
}
