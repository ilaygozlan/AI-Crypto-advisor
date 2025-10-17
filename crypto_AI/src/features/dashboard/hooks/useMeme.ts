import { useState, useEffect, useCallback } from 'react'
import { request } from '@/lib/api'
import type { MemeItem } from '@/types/dashboard'

interface UseMemeOptions {
  limit?: number
  sub?: string
}

interface UseMemeReturn {
  data: MemeItem[]
  isLoading: boolean
  isLoadingMore: boolean
  isError: boolean
  error: Error | null
  hasMore: boolean
  refetch: () => void
  loadMore: () => void
}

export function useMeme({ limit = 24, sub }: UseMemeOptions = {}): UseMemeReturn {
  const [data, setData] = useState<MemeItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState<string | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const fetchMemes = useCallback(async (cursorParam: string | null = null, append = false) => {
    try {
      if (append) {
        setIsLoadingMore(true)
      } else {
        setIsLoading(true)
      }
      setIsError(false)
      setError(null)

      const params = new URLSearchParams({
        limit: limit.toString(),
        ...(sub && sub !== 'all' && { sub }),
        ...(cursorParam && { cursor: cursorParam })
      })

      const memes = await request<MemeItem[]>(`/api/memes?${params}`)
      
      if (append) {
        setData(prev => [...prev, ...memes])
      } else {
        setData(memes)
      }

      // Update cursor and hasMore based on results
      if (memes.length > 0) {
        const lastMeme = memes[memes.length - 1]
        setCursor(lastMeme.created_utc)
        setHasMore(memes.length === limit)
      } else {
        setHasMore(false)
      }
    } catch (err) {
      setIsError(true)
      setError(err instanceof Error ? err : new Error('Failed to fetch memes'))
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [limit, sub])

  const refetch = useCallback(() => {
    setData([])
    setCursor(null)
    setHasMore(true)
    fetchMemes(null, false)
  }, [fetchMemes])

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && cursor) {
      fetchMemes(cursor, true)
    }
  }, [fetchMemes, isLoadingMore, hasMore, cursor])

  // Initial load
  useEffect(() => {
    fetchMemes(null, false)
  }, [fetchMemes])

  return {
    data,
    isLoading,
    isLoadingMore,
    isError,
    error,
    hasMore,
    refetch,
    loadMore
  }
}
