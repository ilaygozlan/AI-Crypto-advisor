import { Skeleton } from '@/components/common/Skeleton'
import { VoteButtons } from '@/components/common/VoteButtons'
import { useAIInsight } from '../hooks/useAIInsight'
import { useVote } from '../hooks/useVote'
import { Brain, Clock } from 'lucide-react'

export default function AiInsightPanel() {
  const { data: insight, isLoading, error } = useAIInsight()
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
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
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
        <p className="text-muted-foreground">Failed to load AI insight</p>
      </div>
    )
  }

  if (!insight) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No AI insight available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">AI Insight</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">AI-powered market analysis</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-3 text-slate-900 dark:text-slate-100">
            {insight.title}
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {insight.content}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Generated {new Date(insight.generatedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Confidence:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              insight.confidence >= 80 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : insight.confidence >= 60
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {insight.confidence}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            How helpful is this insight?
          </div>

          <VoteButtons
            upVotes={insight.votes.up}
            downVotes={insight.votes.down}
            userVote={insight.userVote}
            onVote={(voteType) => vote({ section: 'ai', itemId: insight.id, vote: voteType })}
          />
        </div>
      </div>
    </div>
  )
}
