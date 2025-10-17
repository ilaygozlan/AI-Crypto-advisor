import { useState } from 'react'
import { ExternalLink, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react'
import { request } from '@/lib/api'
import type { MemeItem } from '@/types/dashboard'

// API function for setting meme reactions
async function setReaction(meme: MemeItem, next: 'like' | 'dislike' | null) {
  const body = {
    contentType: 'meme',
    externalId: meme.id,
    reaction: next ?? 'none',
    content: next ? {
      title: meme.title,
      permalink: meme.permalink,
      source_url: meme.source_url,
      subreddit: meme.subreddit,
      created_utc: meme.created_utc,
    } : undefined
  };
  
  console.log(`📤 Sending reaction to server:`, {
    memeId: meme.id,
    memeTitle: meme.title,
    reaction: next ?? 'none',
    hasContent: !!body.content
  });
  
  const response = await request('/api/reactions', {
    method: 'POST',
    body: JSON.stringify(body)
  });
  
  return response;
}

interface MemeCardProps {
  meme: MemeItem
  onVote?: (memeId: string, reaction: 'like' | 'dislike' | null) => void
}

export function MemeCard({ meme, onVote }: MemeCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isVoting, setIsVoting] = useState(false)

  // Use server-side user reaction state
  const userReaction = meme.user_reaction
  const isLiked = userReaction === 'like'
  const isDisliked = userReaction === 'dislike'

  const handleVote = async (reaction: 'like' | 'dislike' | null) => {
    if (isVoting) return

    setIsVoting(true)
    const previousReaction = userReaction
    const action = reaction === 'like' ? 'liked' : reaction === 'dislike' ? 'disliked' : 'removed reaction from'
    
    console.log(`🔄 Attempting to ${action} meme: "${meme.title}" (ID: ${meme.id})`)
    
    try {
      // Optimistic update
      onVote?.(meme.id, reaction)

      // Send reaction to server
      const responseData = await setReaction(meme, reaction)
      
      console.log(`✅ Successfully ${action} meme: "${meme.title}" - Reaction saved to database`)
      console.log(`📊 Reaction change: ${previousReaction || 'none'} → ${reaction || 'none'}`)
      console.log(`📋 Server response:`, responseData)
    } catch (error) {
      console.error(`❌ Failed to ${action} meme: "${meme.title}"`, error)
      console.log(`🔄 Reverting reaction back to: ${previousReaction || 'none'}`)
      // Revert optimistic update on error
      onVote?.(meme.id, userReaction)
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

  const formatScore = (score: number) => {
    if (score >= 1000) {
      return `${(score / 1000).toFixed(1)}k`
    }
    return score.toString()
  }

  const formatComments = (comments: number) => {
    if (comments >= 1000) {
      return `${(comments / 1000).toFixed(1)}k`
    }
    return comments.toString()
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-64 bg-slate-100 dark:bg-slate-700">
        {!imageError ? (
          <img
            src={meme.source_url}
            alt={meme.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
            <div className="text-center">
              <div className="text-4xl mb-2">🖼️</div>
              <div className="text-sm">Image unavailable</div>
            </div>
          </div>
        )}
        
        {/* Subreddit badge */}
        <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
          {meme.subreddit}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight">
          {meme.title}
        </h3>

        {/* Metadata */}
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <span className="text-slate-500">↑</span>
              <span>{formatScore(meme.score)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-3 w-3" />
              <span>{formatComments(meme.num_comments)}</span>
            </div>
          </div>
          
          <a
            href={meme.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <span className="text-xs">Open on Reddit</span>
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {new Date(meme.created_utc).toLocaleDateString()}
          </div>
          
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
  )
}
