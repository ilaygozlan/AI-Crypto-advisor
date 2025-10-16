import { request } from '../api'
import type { NewsItem, PriceData, AIInsight, MemeItem, VoteRequest, VoteResponse } from '@/types/dashboard'

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
  
  getMeme: () =>
    request<MemeItem>('/dashboard/meme'),
  
  vote: (data: VoteRequest) =>
    request<VoteResponse>('/dashboard/vote', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
}
