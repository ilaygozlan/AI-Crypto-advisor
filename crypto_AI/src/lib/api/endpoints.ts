import { apiClient } from './client'
import type { LoginRequest, SignupRequest, AuthResponse } from '@/types/auth'
import type { ApiResponse } from '@/types/common'
import type { NewsItem, PriceData, AIInsight, MemeItem, VoteRequest, VoteResponse } from '@/types/dashboard'
import type { Asset, InvestorType, ContentType } from '@/lib/state/prefs.store'

/**
 * Authentication API endpoints
 * Handles user login, signup, and session management
 */
export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data),
  
  signup: (data: SignupRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/signup', data),
}

/**
 * Onboarding API endpoints
 * Handles user preference setup and onboarding completion
 */
export const onboardingApi = {
  save: (data: {
    assets: Asset[]
    investorType: InvestorType
    contentTypes: ContentType[]
  }) =>
    apiClient.post<ApiResponse<{ success: boolean }>>('/onboarding', data),
}

/**
 * Dashboard API endpoints
 * Provides content for the main dashboard including news, prices, AI insights, and memes
 */
export const dashboardApi = {
  getNews: () =>
    apiClient.get<ApiResponse<NewsItem[]>>('/dashboard/news'),
  
  getPrices: () =>
    apiClient.get<ApiResponse<PriceData[]>>('/dashboard/prices'),
  
  getAIInsight: () =>
    apiClient.get<ApiResponse<AIInsight>>('/dashboard/ai-insight'),
  
  getMeme: () =>
    apiClient.get<ApiResponse<MemeItem>>('/dashboard/meme'),
  
  vote: (data: VoteRequest) =>
    apiClient.post<ApiResponse<VoteResponse>>('/dashboard/vote', data),
}
