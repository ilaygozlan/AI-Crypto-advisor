import { useState } from 'react'
import { PartyPopper, RefreshCw } from 'lucide-react'
import { useMeme } from '../hooks/useMeme'
import { MemeSection } from '../components/MemeSection'

const SUBREDDIT_OPTIONS = [
  { value: 'all', label: 'All Subreddits' },
  { value: 'CryptoMemes', label: 'CryptoMemes' },
  { value: 'cryptomemes', label: 'cryptomemes' },
  { value: 'BitcoinMemes', label: 'BitcoinMemes' },
  { value: 'CryptoCurrency', label: 'CryptoCurrency' },
  { value: 'Bitcoin', label: 'Bitcoin' },
]

export default function MemePanel() {
  const [selectedSub, setSelectedSub] = useState('all')
  const memeHook = useMeme({ 
    limit: 24, 
    sub: selectedSub === 'all' ? undefined : selectedSub 
  })
  
  const { data: memes, isLoading, isLoadingMore, isError, error, hasMore, refetch, loadMore, updateMemeReaction } = memeHook

  const handleSubredditChange = (sub: string) => {
    setSelectedSub(sub)
  }

  const handleVote = (memeId: string, reaction: 'like' | 'dislike' | null) => {
    updateMemeReaction?.(memeId, reaction)
  }

  if (isError) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <PartyPopper className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Crypto Memes</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Community's favorite crypto humor</p>
            </div>
          </div>
        </div>

        {/* Error State */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <div className="text-red-600 dark:text-red-400 text-4xl mb-4">😞</div>
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
            Couldn't load memes
          </h3>
          <p className="text-red-700 dark:text-red-300 mb-4">
            {error?.message || 'Something went wrong while fetching memes. Please try again.'}
          </p>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <PartyPopper className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Crypto Memes</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Community's favorite crypto humor</p>
          </div>
        </div>

        {/* Subreddit Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="subreddit-filter" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Filter:
          </label>
          <select
            id="subreddit-filter"
            value={selectedSub}
            onChange={(e) => handleSubredditChange(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {SUBREDDIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Meme Grid */}
      <MemeSection
        memes={memes}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onVote={handleVote}
      />
    </div>
  )
}
