import { Skeleton } from '@/components/common/Skeleton'
import { VoteButtons } from '@/components/common/VoteButtons'
import { PreferencesIndicator } from '@/components/PreferencesIndicator'
import { useNews } from '../hooks/useNews'
import { useVote } from '../hooks/useVote'

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
  function formatDate(isoString: string) {
    const date = new Date(isoString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
  
    const hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHour = hours % 12 || 12
  
    return `${day}.${month}.${year} AT ${formattedHour}:${minutes} ${ampm}`
  }

  function sortNewsByDate(newsArray: any) {
    return [...newsArray].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  }
  const sortedNews = sortNewsByDate(news)


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

    {/* Render up to 3 latest news */}
    <div className="space-y-6">
      {sortedNews.slice(0, 4).map((item) => (
        <div key={item.id} className="space-y-4 border-b pb-4 last:border-0 last:pb-0">
          <div>
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {item.summary || item.description}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
            <span className="font-medium">
            {formatDate(item.publishedAt)}
            </span>
            <VoteButtons
              upVotes={item.votes?.up || 0}
              downVotes={item.votes?.down || 0}
              userVote={item.userVote}
              onVote={(voteType) =>
                vote({ 
                  section: 'news', 
                  itemId: item.id, 
                  vote: voteType,
                  content: {
                    title: item.title,
                    source: item.source,
                    publishedAt: item.publishedAt,
                    summary: item.summary || item.description
                  }
                })
              }
            />
          </div>
        </div>
      ))}
    </div>

    <PreferencesIndicator />
  </div>
)

}
