import { Card } from '@/components/common/Card'
import { Skeleton } from '@/components/common/Skeleton'
import { VoteButtons } from '@/components/common/VoteButtons'
import { usePrices } from '../hooks/usePrices'
import { useVote } from '../hooks/useVote'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function PricesSection() {
  const { data: prices, isLoading, error } = usePrices()
  const { mutate: vote } = useVote()

  if (isLoading) {
    return (
      <Card title="💰 Coin Prices">
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
      </Card>
    )
  }

  if (error) {
    return (
      <Card title="💰 Coin Prices">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Failed to load prices</p>
        </div>
      </Card>
    )
  }

  if (!prices || prices.length === 0) {
    return (
      <Card title="💰 Coin Prices">
        <div className="text-center py-8">
          <p className="text-muted-foreground">No price data available</p>
        </div>
      </Card>
    )
  }

  const topPrices = prices.slice(0, 3)

  return (
    <Card title="💰 Coin Prices">
      <div className="space-y-4">
        {topPrices.map((price: any) => {
          const isPositive = price.priceChangePercentage24h >= 0
          const TrendIcon = isPositive ? TrendingUp : TrendingDown
          
          return (
            <div key={price.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                  {price.symbol.slice(0, 2)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{price.symbol}</div>
                  <div className="text-xs text-muted-foreground">{price.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm">
                  ${price.currentPrice.toLocaleString()}
                </div>
                <div className={`text-xs flex items-center ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon className="h-3 w-3 mr-1" />
                  {Math.abs(price.priceChangePercentage24h).toFixed(2)}%
                </div>
              </div>
            </div>
          )
        })}

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall sentiment</span>
            <VoteButtons
            upVotes={prices.reduce((acc: any, p: any) => acc + p.votes.up, 0)}
            downVotes={prices.reduce((acc: any, p: any) => acc + p.votes.down, 0)}
              onVote={(voteType) => vote({ section: 'prices', itemId: 'overall', vote: voteType })}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
