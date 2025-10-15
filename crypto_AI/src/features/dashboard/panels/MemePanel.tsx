import { Skeleton } from '@/components/common/Skeleton'
import { VoteButtons } from '@/components/common/VoteButtons'
import { useMeme } from '../hooks/useMeme'
import { useVote } from '../hooks/useVote'
import { PartyPopper, ExternalLink } from 'lucide-react'

export default function MemePanel() {
  const { data: meme, isLoading, error } = useMeme()
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
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
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
        <p className="text-muted-foreground">Failed to load meme</p>
      </div>
    )
  }

  if (!meme) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No meme available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
          <PartyPopper className="h-5 w-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Fun Crypto Meme</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Community's favorite crypto humor</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <img
            src={meme.imageUrl}
            alt={meme.title}
            className="w-full h-64 object-cover rounded-xl shadow-sm"
          />
          <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium">
            {meme.source}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-slate-100">
            {meme.title}
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {meme.caption}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>From {meme.source}</span>
            <span>•</span>
            <span>{new Date(meme.createdAt).toLocaleDateString()}</span>
          </div>
          <a
            href={meme.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            View full size
            <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            How funny is this meme?
          </div>

          <VoteButtons
            upVotes={meme.votes.up}
            downVotes={meme.votes.down}
            userVote={meme.userVote}
            onVote={(voteType) => vote({ section: 'meme', itemId: meme.id, vote: voteType })}
          />
        </div>
      </div>
    </div>
  )
}
