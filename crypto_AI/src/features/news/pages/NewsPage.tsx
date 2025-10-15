import { NewsFeed } from '../components/NewsFeed'
import { TrendingUp } from 'lucide-react'

export function NewsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Personalized News Feed
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Crypto news tailored to your preferences and reactions
          </p>
        </div>
      </div>

      {/* News Feed */}
      <NewsFeed />
    </div>
  )
}
