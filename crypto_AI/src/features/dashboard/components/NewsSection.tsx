import { Card } from '@/components/common/Card'
import { Skeleton } from '@/components/common/Skeleton'
import { VoteButtons } from '@/components/common/VoteButtons'
import { useNews } from '../hooks/useNews'
import { useVote } from '../hooks/useVote'
import { ExternalLink } from 'lucide-react'

export function NewsSection() {
  const { data: news, isLoading, error } = useNews()
  const { mutate: vote } = useVote()

  if (isLoading) {
    return (
      <Card title="📰 Market News">
        <div className="space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-1/3" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card title="📰 Market News">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Failed to load news</p>
        </div>
      </Card>
    )
  }

  if (!news || news.length === 0) {
    return (
      <Card title="📰 Market News">
        <div className="text-center py-8">
          <p className="text-muted-foreground">No news available</p>
        </div>
      </Card>
    )
  }

  const latestNews = news[0]

  return (
    <Card title="📰 Market News">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-sm mb-2 line-clamp-2">
            {latestNews.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {latestNews.summary}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{latestNews.source}</span>
          <span>{new Date(latestNews.publishedAt).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center justify-between">
          <a
            href={latestNews.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Read more
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>

          <VoteButtons
            upVotes={latestNews.votes.up}
            downVotes={latestNews.votes.down}
            userVote={latestNews.userVote}
            onVote={(voteType) => vote({ section: 'news', itemId: latestNews.id, vote: voteType })}
          />
        </div>
      </div>
    </Card>
  )
}
