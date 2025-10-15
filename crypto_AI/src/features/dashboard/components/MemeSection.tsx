import { Card } from '@/components/common/Card'
import { Skeleton } from '@/components/common/Skeleton'
import { VoteButtons } from '@/components/common/VoteButtons'
import { useMeme } from '../hooks/useMeme'
import { useVote } from '../hooks/useVote'
import { ExternalLink } from 'lucide-react'

export function MemeSection() {
  const { data: meme, isLoading, error } = useMeme()
  const { mutate: vote } = useVote()

  if (isLoading) {
    return (
      <Card title="🎉 Fun Crypto Meme">
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
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
      <Card title="🎉 Fun Crypto Meme">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Failed to load meme</p>
        </div>
      </Card>
    )
  }

  if (!meme) {
    return (
      <Card title="🎉 Fun Crypto Meme">
        <div className="text-center py-8">
          <p className="text-muted-foreground">No meme available</p>
        </div>
      </Card>
    )
  }

  return (
    <Card title="🎉 Fun Crypto Meme">
      <div className="space-y-4">
        <div className="relative">
          <img
            src={meme.imageUrl}
            alt={meme.title}
            className="w-full h-48 object-cover rounded-lg"
            loading="lazy"
          />
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-1">{meme.title}</h3>
          <p className="text-sm text-muted-foreground">{meme.caption}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Source: {meme.source}</span>
          <a
            href={meme.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            View full size
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            Daily crypto humor
          </span>

          <VoteButtons
            upVotes={meme.votes.up}
            downVotes={meme.votes.down}
            userVote={meme.userVote}
            onVote={(voteType) => vote({ section: 'meme', itemId: meme.id, vote: voteType })}
          />
        </div>
      </div>
    </Card>
  )
}
