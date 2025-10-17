import { useState } from 'react'
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CoinChart } from './CoinChart'

export interface PriceData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_1h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
}

interface PriceRowProps {
  coin: PriceData;
  showChart?: boolean;
  onVote?: (coinId: string, voteType: 'like' | 'dislike') => void;
  userVote?: 'like' | 'dislike' | null;
  likes?: number;
  dislikes?: number;
}

export function PriceRow({ 
  coin, 
  showChart = true, 
  onVote, 
  userVote = null, 
}: PriceRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`
    if (price < 1) return `$${price.toFixed(4)}`
    if (price < 100) return `$${price.toFixed(2)}`
    return `$${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
    return `$${marketCap.toLocaleString()}`
  }

  const formatPercentage = (percentage: number) => {
    const sign = percentage >= 0 ? '+' : ''
    return `${sign}${percentage.toFixed(2)}%`
  }

  const getChangeColor = (percentage: number) => {
    if (percentage > 0) return 'text-green-600 dark:text-green-400'
    if (percentage < 0) return 'text-red-600 dark:text-red-400'
    return 'text-slate-600 dark:text-slate-400'
  }

  const getChangeIcon = (percentage: number) => {
    if (percentage > 0) return <TrendingUp className="h-4 w-4" />
    if (percentage < 0) return <TrendingDown className="h-4 w-4" />
    return null
  }

  return (
    <div className="border-b border-slate-200 dark:border-slate-700 last:border-0">
      {/* Main Row */}
      <div 
        className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Left: Coin Info */}
        <div className="flex items-center space-x-3">
          <img 
            src={coin.image} 
            alt={coin.name}
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/32x32/6366f1/ffffff?text=${coin.symbol.charAt(0)}`
            }}
          />
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {coin.name}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {coin.symbol.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Center: Price & Market Cap */}
        <div className="text-center">
          <div className="font-semibold text-slate-900 dark:text-slate-100">
            {formatPrice(coin.current_price)}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {formatMarketCap(coin.market_cap)}
          </div>
        </div>

        {/* Right: Changes */}
        <div className="text-right">
          <div className={`flex items-center justify-end space-x-1 ${getChangeColor(coin.price_change_percentage_24h)}`}>
            {getChangeIcon(coin.price_change_percentage_24h)}
            <span className="font-medium">
              {formatPercentage(coin.price_change_percentage_24h)}
            </span>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            24h
          </div>
        </div>

        {/* All Action Buttons - Right Aligned */}
        <div className="flex items-center justify-end space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${
              userVote === 'like' 
                ? 'text-green-600 bg-green-50 hover:bg-green-100 dark:text-green-400 dark:bg-green-900/20' 
                : 'text-slate-500 hover:text-green-600 hover:bg-green-50 dark:text-slate-400 dark:hover:text-green-400'
            }`}
            onClick={(e) => {
              e.stopPropagation()
              onVote?.(coin.id, 'like')
            }}
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
        
          
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${
              userVote === 'like' 
                ? 'text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20' 
                : 'text-slate-500 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400'
            }`}
            onClick={(e) => {
              e.stopPropagation()
              onVote?.(coin.id, 'dislike')
              
            }}
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
      
          
          {showChart && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Expanded Chart Section */}
      {isExpanded && showChart && (
        <div className="px-4 pb-4">
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className={`text-sm font-medium ${getChangeColor(coin.price_change_percentage_1h)}`}>
                  {formatPercentage(coin.price_change_percentage_1h)}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">1h</div>
              </div>
              <div className="text-center">
                <div className={`text-sm font-medium ${getChangeColor(coin.price_change_percentage_24h)}`}>
                  {formatPercentage(coin.price_change_percentage_24h)}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">24h</div>
              </div>
              <div className="text-center">
                <div className={`text-sm font-medium ${getChangeColor(coin.price_change_percentage_7d)}`}>
                  {formatPercentage(coin.price_change_percentage_7d)}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">7d</div>
              </div>
            </div>
            <CoinChart coinId={coin.id} />
          </div>
        </div>
      )}
    </div>
  )
}
