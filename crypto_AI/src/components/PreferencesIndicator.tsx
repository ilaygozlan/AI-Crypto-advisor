import { useAuth } from '@/contexts/AuthContext'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Shield, Zap } from 'lucide-react'

export function PreferencesIndicator() {
  const { user } = useAuth()
  
  const assets = user?.preferences?.selectedAssets || []
  const investorType = user?.preferences?.investorType || null
  const contentTypes = user?.preferences?.selectedContentTypes || []

  const getInvestorTypeIcon = (type: string | null) => {
    switch (type) {
      case 'HODLer':
        return <Shield className="h-3 w-3" />
      case 'Day Trader':
        return <TrendingUp className="h-3 w-3" />
      case 'NFT Collector':
        return <Zap className="h-3 w-3" />
      default:
        return null
    }
  }

  const getInvestorTypeColor = (type: string | null) => {
    switch (type) {
      case 'HODLer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'Day Trader':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'NFT Collector':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  if (!assets.length && !investorType && !contentTypes.length) {
    return null
  }

  return (
    <div className="mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          News filtered by your preferences:
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {investorType && (
          <Badge 
            variant="secondary" 
            className={`${getInvestorTypeColor(investorType)} flex items-center gap-1`}
          >
            {getInvestorTypeIcon(investorType)}
            {investorType.charAt(0).toUpperCase() + investorType.slice(1)} Investor
          </Badge>
        )}
        
        {assets.length > 0 && (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            {assets.length} Asset{assets.length > 1 ? 's' : ''}: {assets.join(', ')}
          </Badge>
        )}
        
        {contentTypes.length > 0 && (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            {contentTypes.length} Content Type{contentTypes.length > 1 ? 's' : ''}
          </Badge>
        )}
      </div>
      
      <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
        News is personalized based on your investment style and selected cryptocurrencies.
        {investorType === 'HODLer' && ' Showing important and reliable news sources.'}
        {investorType === 'Day Trader' && ' Showing trending and popular news.'}
        {investorType === 'NFT Collector' && ' Showing bullish and high-impact news.'}
      </div>
    </div>
  )
}
