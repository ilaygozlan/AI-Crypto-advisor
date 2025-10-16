import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/common/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { NewsCard } from './NewsCard'
import { useCryptoPanicPosts } from '../hooks/useCryptoPanicPosts'
import { Filter, Settings, RotateCcw, RefreshCw, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import type { FilterType } from '@/lib/utils/cryptoPrefs'

const AVAILABLE_ASSETS = [
  'BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'MATIC', 'AVAX', 'LINK', 
  'UNI', 'ATOM', 'NEAR', 'FTM', 'ALGO', 'VET', 'ICP', 'FIL'
]

export function NewsFeed() {
  const { user } = useAuth()
  const {
    posts,
    isLoading,
    error,
    refetch,
    preferences,
    updateFilter,
    updateAssets,
    resetToDefaults,
    handleReaction,
    isReacting
  } = useCryptoPanicPosts()

  const [showAssetSelector, setShowAssetSelector] = useState(false)
  const [tempAssets, setTempAssets] = useState<string[]>(preferences.assets)

  // Get available filters based on investor type
  const getAvailableFilters = (): Array<{ value: FilterType; label: string }> => {
    const investorType = user?.preferences?.investorType
    if (investorType === 'day_trader') {
      return [
        { value: 'hot', label: 'Hot' },
        { value: 'rising', label: 'Rising' }
      ]
    } else {
      return [
        { value: 'important', label: 'Important' },
        { value: 'hot', label: 'Hot' }
      ]
    }
  }

  const availableFilters = getAvailableFilters()

  const handleAssetToggle = (asset: string) => {
    const newAssets = tempAssets.includes(asset) 
      ? tempAssets.filter(a => a !== asset)
      : [...tempAssets, asset]
    
    setTempAssets(newAssets)
    updateAssets(newAssets)
  }

  const handleReset = () => {
    resetToDefaults()
    const defaultAssets = user?.preferences?.selectedAssets && user.preferences.selectedAssets.length > 0 
      ? user.preferences.selectedAssets 
      : ['BTC', 'SOL', 'AVAX', 'MATIC']
    setTempAssets(defaultAssets)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Toolbar skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
          <Skeleton className="h-16 w-full" />
        </div>

        {/* Posts skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Unable to load news
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {error instanceof Error ? error.message : 'An error occurred while fetching news'}
        </p>
        <Button onClick={() => refetch()} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="space-y-4">
        {/* Filter and Reset */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Filter:
            </span>
          </div>
          
          <Select value={preferences.filter} onValueChange={updateFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableFilters.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        </div>

        {/* Asset Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Assets ({preferences.assets.length}):
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAssetSelector(!showAssetSelector)}
            >
              {showAssetSelector ? 'Hide' : 'Customize'}
            </Button>
          </div>

          {/* Selected assets display */}
          <div className="flex flex-wrap gap-2">
            {preferences.assets.map((asset) => (
              <Badge 
                key={asset} 
                variant="secondary" 
                className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {asset}
              </Badge>
            ))}
          </div>

          {/* Asset selector */}
          {showAssetSelector && (
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="grid grid-cols-4 gap-2">
                {AVAILABLE_ASSETS.map((asset) => (
                  <div key={asset} className="flex items-center space-x-2">
                    <Checkbox
                      id={asset}
                      checked={tempAssets.includes(asset)}
                      onCheckedChange={() => handleAssetToggle(asset)}
                    />
                    <label
                      htmlFor={asset}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {asset}
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const top4 = AVAILABLE_ASSETS.slice(0, 4)
                      setTempAssets(top4)
                      updateAssets(top4)
                    }}
                  >
                    Top 4
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const btcEth = ['BTC', 'ETH']
                      setTempAssets(btcEth)
                      updateAssets(btcEth)
                    }}
                  >
                    BTC & ETH
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTempAssets([])
                      updateAssets([])
                    }}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status line */}
      <div className="text-sm text-slate-600 dark:text-slate-400">
        {posts.length} articles • Filter: {preferences.filter} • Assets: {preferences.assets.join(', ')}
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <EmptyState
          title="No news available"
          description="Try adjusting your filter or asset preferences to see more news."
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <NewsCard
              key={post.id}
              post={post}
              onReaction={(postId, reaction) => handleReaction({ postId, reaction })}
              isReacting={isReacting}
            />
          ))}
        </div>
      )}

      {/* Refresh button */}
      <div className="text-center pt-6">
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh News
        </Button>
      </div>
    </div>
  )
}
