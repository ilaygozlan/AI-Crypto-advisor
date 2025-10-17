import { Skeleton } from '@/components/common/Skeleton'
import { BrainLoader } from '@/components/common/BrainLoader'
import { useTodayInsight } from '../hooks/useTodayInsight'
import { Brain, RefreshCw, TrendingUp, Compass, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { request } from '@/lib/api'
import type { TodayInsight } from '@/types/dashboard'

// API function for setting AI insight reactions
async function setInsightReaction(insight: TodayInsight, next: 'like' | 'dislike' | null) {
  const body = {
    contentType: 'ai_insight',
    externalId: insight.id,
    reaction: next ?? 'none',
    content: next ? {
      title: insight.title,
      generated_at: insight.generated_at,
      user_id: insight.user_id,
      date_key: insight.date_key,
    } : undefined
  };
  
  console.log(`📤 Sending AI insight reaction to server`);
  
  const response = await request('/api/reactions', {
    method: 'POST',
    body: JSON.stringify(body)
  });
  
  return response;
}

interface AiInsightPanelProps {
  autoFetch?: boolean
}

export default function AiInsightPanel({ autoFetch = false }: AiInsightPanelProps) {
  const [shouldFetch, setShouldFetch] = useState(false)
  const { data: insight, isLoading, error, refetch, isRefetching } = useTodayInsight(shouldFetch)
  const [isVoting, setIsVoting] = useState(false)

  // Auto-fetch when the panel is mounted with autoFetch prop
  useEffect(() => {
    if (autoFetch && !shouldFetch) {
      setShouldFetch(true)
    }
  }, [autoFetch, shouldFetch])

  const handleRefresh = () => {
    refetch()
  }

  const handleInitialFetch = () => {
    setShouldFetch(true)
  }

  // Use server-side user reaction state
  const userReaction = insight?.user_reaction
  const isLiked = userReaction === 'like'
  const isDisliked = userReaction === 'dislike'

  const handleVote = async (reaction: 'like' | 'dislike' | null) => {
    if (isVoting || !insight) return

    setIsVoting(true)
    const previousReaction = userReaction
    const action = reaction === 'like' ? 'liked' : reaction === 'dislike' ? 'disliked' : 'removed reaction from'
    
    console.log(`🔄 Attempting to ${action} AI insight`)
    
    try {
      // Send reaction to server
      const responseData = await setInsightReaction(insight, reaction)
      
      console.log(`✅ Successfully ${action} AI insight - Reaction saved to database`)
      console.log(`📊 Reaction change: ${previousReaction || 'none'} → ${reaction || 'none'}`)
      console.log(`📋 Server response received`)
      
      // Refetch the insight to get updated voting data
      refetch()
    } catch (error) {
      console.error(`❌ Failed to ${action} AI insight`, error)
    } finally {
      setIsVoting(false)
    }
  }

  const handleLike = () => {
    const newReaction = isLiked ? null : 'like'
    handleVote(newReaction)
  }

  const handleDislike = () => {
    const newReaction = isDisliked ? null : 'dislike'
    handleVote(newReaction)
  }

  // Show initial state when no fetch has been initiated
  if (!shouldFetch && !insight) {
    return (
      <div className="text-center py-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">AI Insight</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Get your personalized AI-powered crypto insights</p>
        <Button onClick={handleInitialFetch} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Brain className="h-4 w-4 mr-2" />
          Generate AI Insight
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <BrainLoader size="sm" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">AI Insight</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Generating your personalized analysis...</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="h-8 w-8 text-purple-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">AI Insight</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-4">Failed to load AI insight</p>
        <Button onClick={handleRefresh} disabled={isRefetching} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
          Try Again
        </Button>
      </div>
    )
  }

  if (!insight && shouldFetch) {
    return (
      <div className="text-center py-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="h-8 w-8 text-purple-500" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">AI Insight</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mb-4">No insights available yet. Check back later!</p>
        <Button onClick={handleRefresh} disabled={isRefetching}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
    )
  }

  const { content_json } = insight!

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">AI Insight</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">AI-powered market analysis</p>
          </div>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={isRefetching}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Title */}
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {content_json.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            {content_json.tl_dr}
          </p>
        </div>

        {/* Detail Bullets */}
        {content_json.detail_bullets && content_json.detail_bullets.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Key Points
            </h4>
            <ul className="space-y-2">
              {content_json.detail_bullets.map((bullet: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actionable Items */}
        {content_json.actionable && content_json.actionable.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <Compass className="h-5 w-5 text-green-500" />
              Actionable Steps
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              {content_json.actionable.map((action: any, index: number) => (
                <a
                  key={index}
                  href={action.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {action.what}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {action.why}
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Sources */}
        {content_json.sources && content_json.sources.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-purple-500" />
              Sources
            </h4>
            <div className="flex flex-wrap gap-2">
              {content_json.sources.map((source: any, index: number) => (
                <a
                  key={index}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 rounded-lg text-sm transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  {source.title || source.source_name || 'Source'}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Generated on {new Date(insight!.generated_at).toLocaleDateString()} at {new Date(insight!.generated_at).toLocaleTimeString()}
            </div>
            
            {/* Voting buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                disabled={isVoting}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isLiked
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
                } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-pressed={isLiked}
              >
                <ThumbsUp className="h-3 w-3" />
                <span>Like</span>
              </button>
              
              <button
                onClick={handleDislike}
                disabled={isVoting}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isDisliked
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
                } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-pressed={isDisliked}
              >
                <ThumbsDown className="h-3 w-3" />
                <span>Dislike</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
