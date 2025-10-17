import { request } from '../api'
import type { NewsItem, PriceData, AIInsight, VoteRequest, VoteResponse, TodayInsight } from '@/types/dashboard'

/**
 * Dashboard API endpoints using the new fetch-based API client
 * Provides content for the main dashboard including news, prices, AI insights, and memes
 */
export const newDashboardApi = {
  getNews: () =>
    request<NewsItem[]>('/dashboard/news'),
  
  getPrices: () =>
    request<PriceData[]>('/dashboard/prices'),
  
  getAIInsight: () =>
    request<AIInsight>('/dashboard/ai-insight'),
  
  getNewsReactions: (newsIds: string[]) =>
    request<{ userReactions: Record<string, 'up' | 'down' | null>, voteCounts: Record<string, { up: number, down: number }> }>('/dashboard/news/reactions', {
      method: 'POST',
      body: JSON.stringify({ newsIds })
    }),
  
  vote: (data: VoteRequest) =>
    request<VoteResponse>('/dashboard/vote', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
}

/**
 * Insights API endpoints
 * Provides AI-generated insights for users
 */
export const insightsApi = {
  getTodayInsight: (userId: string) =>
    request<TodayInsight>(`/api/insights/today?user_id=${userId}`),
}
