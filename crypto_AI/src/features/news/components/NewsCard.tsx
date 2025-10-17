import { useState } from 'react'
import { ThumbsUp, ThumbsDown, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/common/Card'
import { extractHostname, formatPublishedDate } from '@/lib/utils/cryptoPanic'
import { extractTags } from '@/lib/utils/cryptoPanic'
import type { ScoredPost } from '@/lib/utils/scoring'
import type { ReactionType } from '@/lib/utils/cryptoPrefs'

interface NewsCardProps {
  post: ScoredPost
  onReaction: (postId: string, reaction: ReactionType | null) => void
  isReacting?: boolean
}

export function NewsCard({ post, onReaction, isReacting = false }: NewsCardProps) {
  const [isOptimisticReacting, setIsOptimisticReacting] = useState(false)

  const handleReaction = async (reaction: ReactionType) => {
    if (isReacting || isOptimisticReacting) return
    
    setIsOptimisticReacting(true)
    try {
      // Toggle reaction if same, otherwise set new reaction
      const newReaction = post.userReaction === reaction ? null : reaction
      await onReaction(String(post.id), newReaction)
    } finally {
      setIsOptimisticReacting(false)
    }
  }

  const hostname = extractHostname(post.url ?? '')
  const publishedDate = formatPublishedDate(post.published_at)
  const tags = extractTags(post)
  const assets = post.currencies?.map(c => c.code) || []

  const getSentimentColor = () => {
    const total = (post.votes?.positive ?? 0) + (post.votes?.negative ?? 0)
    if (total === 0) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    
    const positiveRatio = (post.votes?.positive ?? 0) / total
    if (positiveRatio > 0.6) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    if (positiveRatio < 0.4) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
  }

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Header with title and date */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-semibold text-lg leading-tight text-slate-900 dark:text-slate-100 line-clamp-2 flex-1">
            {post.title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 flex-shrink-0">
            <Clock className="h-3 w-3" />
            <span>{publishedDate}</span>
          </div>
        </div>

        {/* Source and like/dislike buttons */}
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <span className="font-medium">{hostname}</span>
          </div>
          
          {/* Like/Dislike buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant={post.userReaction === 'like' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleReaction('like')}
              disabled={isReacting || isOptimisticReacting}
              className="flex items-center gap-1 h-7 px-2"
              aria-label={`Like ${post.title}`}
            >
              <ThumbsUp className="h-3 w-3" />
              {(post.votes?.positive ?? 0) + (post.votes?.liked ?? 0)}
            </Button>
            
            <Button
              variant={post.userReaction === 'dislike' ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => handleReaction('dislike')}
              disabled={isReacting || isOptimisticReacting}
              className="flex items-center gap-1 h-7 px-2"
              aria-label={`Dislike ${post.title}`}
            >
              <ThumbsDown className="h-3 w-3" />
              {(post.votes?.negative ?? 0) + (post.votes?.disliked ?? 0)}
            </Button>
          </div>
        </div>

        {/* Asset badges */}
        {assets.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {assets.map((asset) => (
              <Badge 
                key={asset} 
                variant="secondary" 
                className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {asset}
              </Badge>
            ))}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs bg-slate-50 dark:bg-slate-800"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Community sentiment */}
        <div className="flex items-center gap-4">
          <Badge 
            variant="secondary" 
            className={`${getSentimentColor()} text-xs`}
          >
            {(post.votes?.positive ?? 0) + (post.votes?.negative ?? 0) > 0 
              ? `${Math.round(((post.votes?.positive ?? 0) / ((post.votes?.positive ?? 0) + (post.votes?.negative ?? 0))) * 100)}% positive`
              : 'No votes'
            }
          </Badge>
          
          {(post.votes?.important ?? 0) > 0 && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-xs">
              Important
            </Badge>
          )}
        </div>

        {/* Personalization score indicator */}
        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Score: {Math.round(post.personalizationScore)}
          </div>
        </div>
      </div>
    </Card>
  )
}