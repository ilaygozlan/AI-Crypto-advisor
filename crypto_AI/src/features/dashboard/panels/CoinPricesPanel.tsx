import { Skeleton } from '@/components/common/Skeleton'
import { VoteButtons } from '@/components/common/VoteButtons'
import { usePrices } from '../hooks/usePrices'
import { useVote } from '../hooks/useVote'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function CoinPricesPanel() {
  const { data: prices, isLoading, error } = usePrices()
  const { mutate: vote } = useVote()

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

  const topPrices = prices.slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <span className="text-green-600 dark:text-green-400 text-lg">💰</span>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Coin Prices</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Top cryptocurrency prices</p>
        </div>
      </div>

      <div className="space-y-4">
        {topPrices.map((price: any) => {
          const isPositive = price.priceChangePercentage24h >= 0
          const TrendIcon = isPositive ? TrendingUp : TrendingDown
          
          return (
            <div key={price.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-semibold">
                  {price.symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{price.symbol}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{price.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                  ${price.currentPrice.toLocaleString()}
                </div>
                <div className={`text-sm flex items-center justify-end ${
                  isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  <TrendIcon className="h-4 w-4 mr-1" />
                  {Math.abs(price.priceChangePercentage24h).toFixed(2)}%
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600 dark:text-slate-400">Overall sentiment</span>
          <VoteButtons
            upVotes={prices.reduce((acc: any, p: any) => acc + p.votes.up, 0)}
            downVotes={prices.reduce((acc: any, p: any) => acc + p.votes.down, 0)}
            onVote={(voteType) => vote({ section: 'prices', itemId: 'overall', vote: voteType })}
          />
        </div>
      </div>
    </div>
  )
}
