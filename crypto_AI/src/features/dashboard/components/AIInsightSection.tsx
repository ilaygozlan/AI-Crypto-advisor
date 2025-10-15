import { Card } from '@/components/common/Card'
import { Skeleton } from '@/components/common/Skeleton'
import { VoteButtons } from '@/components/common/VoteButtons'
import { Button } from '@/components/ui/button'
import { useAIInsight } from '../hooks/useAIInsight'
import { useVote } from '../hooks/useVote'
import { RefreshCw } from 'lucide-react'

export function AIInsightSection() {
  const { data: insight, isLoading, error, refetch } = useAIInsight()
  const { mutate: vote } = useVote()

  if (isLoading) {
    return (
      <Card title="🤖 AI Insight of the Day">
        <div className="space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
          <div className="flex justify-between items-center pt-4">
            <Skeleton className="h-8 w-24" />
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
      <Card title="🤖 AI Insight of the Day">
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Failed to load AI insight</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </Card>
    )
  }

  if (!insight) {
    return (
      <Card title="🤖 AI Insight of the Day">
        <div className="text-center py-8">
          <p className="text-muted-foreground">No insight available</p>
        </div>
      </Card>
    )
  }

  return (
    <Card title="🤖 AI Insight of the Day">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-sm mb-2">{insight.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {insight.content}
          </p>
        </div>

        <div className="text-xs text-muted-foreground">
          Generated {new Date(insight.generatedAt).toLocaleDateString()}
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Regenerate
          </Button>

          <VoteButtons
            upVotes={insight.votes.up}
            downVotes={insight.votes.down}
            userVote={insight.userVote}
            onVote={(voteType) => vote({ section: 'ai', itemId: insight.id, vote: voteType })}
          />
        </div>
      </div>
    </Card>
  )
}
