import { Skeleton } from '@/components/common/Skeleton'
import { VoteButtons } from '@/components/common/VoteButtons'
import { PreferencesIndicator } from '@/components/PreferencesIndicator'
import { useNews } from '../hooks/useNews'
import { useVote } from '../hooks/useVote'
import { ExternalLink } from 'lucide-react'

export default function MarketNewsPanel() {
  const { data: news, isLoading, error } = useNews()
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
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-1/3" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load news</p>
      </div>
    )
  }

  if (!news || news.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No news available</p>
      </div>
    )
  }

  const latestNews = news[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <span className="text-blue-600 dark:text-blue-400 text-lg">📰</span>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Market News</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Latest crypto market updates</p>
        </div>
      </div>

      <PreferencesIndicator />

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-3 line-clamp-2">
            {latestNews.title}
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {latestNews.summary}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium">{latestNews.source}</span>
          <span>{new Date(latestNews.publishedAt).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center justify-between pt-4">
          <a
            href={latestNews.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors font-medium"
          >
            Read full article
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>

          <VoteButtons
            upVotes={latestNews.votes.up}
            downVotes={latestNews.votes.down}
            userVote={latestNews.userVote}
            onVote={(voteType) => vote({ section: 'news', itemId: latestNews.id, vote: voteType })}
          />
        </div>
      </div>
    </div>
  )
}
