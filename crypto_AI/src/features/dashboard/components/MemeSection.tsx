import { useEffect, useRef } from 'react'
import { Skeleton } from '@/components/common/Skeleton'
import { MemeCard } from './MemeCard'
import type { MemeItem } from '@/types/dashboard'

interface MemeSectionProps {
  memes: MemeItem[]
  isLoading?: boolean
  isLoadingMore?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  onVote?: (memeId: string, reaction: 'like' | 'dislike' | null) => void
}

export function MemeSection({ 
  memes, 
  isLoading = false, 
  isLoadingMore = false, 
  hasMore = false, 
  onLoadMore,
  onVote
}: MemeSectionProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!onLoadMore || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          onLoadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => observer.disconnect()
  }, [onLoadMore, hasMore, isLoadingMore])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <Skeleton className="h-64 w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-1/3" />
                <div className="flex space-x-2">
                  <Skeleton className="h-6 w-12 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (memes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😔</div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          No memes found
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Try adjusting your filter or check back later for new content.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Meme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {memes.map((meme) => (
          <MemeCard key={meme.id} meme={meme} onVote={onVote} />
        ))}
      </div>

      {/* Loading More Skeleton */}
      {isLoadingMore && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`loading-${i}`} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <Skeleton className="h-64 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 w-1/3" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-12 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Infinite Scroll Sentinel */}
      {hasMore && (
        <div ref={sentinelRef} className="h-4" />
      )}

      {/* End of content */}
      {!hasMore && memes.length > 0 && (
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            You've reached the end! 🎉
          </p>
        </div>
      )}
    </div>
  )
}
