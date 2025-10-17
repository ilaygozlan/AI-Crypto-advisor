import { useChart } from '../hooks/useChart'
import { Skeleton } from '@/components/common/Skeleton'

interface CoinChartProps {
  coinId: string;
  days?: number;
  height?: number;
}

export function CoinChart({ coinId, days = 7, height = 120 }: CoinChartProps) {
  const { data: chartData, isLoading, error } = useChart({
    coinId,
    days,
    enabled: true
  })

  if (isLoading) {
    return (
      <div className="w-full" style={{ height }}>
        <Skeleton className="h-full w-full rounded" />
      </div>
    )
  }

  if (error || !chartData || chartData.length === 0) {
    return (
      <div 
        className="flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm"
        style={{ height }}
      >
        Chart data unavailable
      </div>
    )
  }

  // Simple sparkline chart using SVG
  const minPrice = Math.min(...chartData.map(d => d.price))
  const maxPrice = Math.max(...chartData.map(d => d.price))
  const priceRange = maxPrice - minPrice

  // Get the first and last prices to determine color
  const firstPrice = chartData[0]?.price || 0
  const lastPrice = chartData[chartData.length - 1]?.price || 0
  const isPositive = lastPrice >= firstPrice

  // Create SVG path
  const width = 300
  const padding = 10
  const chartWidth = width - (padding * 2)
  const chartHeight = height - (padding * 2)

  const points = chartData.map((point, index) => {
    const x = padding + (index / (chartData.length - 1)) * chartWidth
    const y = padding + ((maxPrice - point.price) / priceRange) * chartHeight
    return `${x},${y}`
  }).join(' ')

  const pathData = `M ${points}`

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {days === 1 ? '24h' : `${days}d`} Price Chart
        </span>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={`text-xs ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isPositive ? '↗' : '↘'}
          </span>
        </div>
      </div>
      
      <div className="relative">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path 
                d="M 20 0 L 0 0 0 20" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5" 
                opacity="0.1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Price line */}
          <path
            d={pathData}
            fill="none"
            stroke={isPositive ? '#10b981' : '#ef4444'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Area fill */}
          <path
            d={`M ${padding},${height - padding} L ${pathData} L ${width - padding},${height - padding} Z`}
            fill={isPositive ? 'url(#greenGradient)' : 'url(#redGradient)'}
            opacity="0.1"
          />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Price labels */}
        <div className="absolute top-0 left-0 text-xs text-slate-600 dark:text-slate-400">
          ${(maxPrice || 0).toFixed(2)}
        </div>
        <div className="absolute bottom-0 left-0 text-xs text-slate-600 dark:text-slate-400">
          ${(minPrice || 0).toFixed(2)}
        </div>
      </div>
    </div>
  )
}
