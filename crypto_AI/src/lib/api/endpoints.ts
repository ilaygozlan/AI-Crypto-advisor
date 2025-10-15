import { apiClient } from './client'
import type { LoginRequest, SignupRequest, AuthResponse } from '@/types/auth'
import type { ApiResponse } from '@/types/common'
import type { NewsItem, PriceData, AIInsight, MemeItem, VoteRequest, VoteResponse } from '@/types/dashboard'
import type { Asset, InvestorType, ContentType } from '@/lib/state/prefs.store'

// Auth endpoints
export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data),
  
  signup: (data: SignupRequest) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/signup', data),
}

// Onboarding endpoints
export const onboardingApi = {
  save: (data: {
    assets: Asset[]
    investorType: InvestorType
    contentTypes: ContentType[]
  }) =>
    apiClient.post<ApiResponse<{ success: boolean }>>('/onboarding', data),
}

// Dashboard endpoints
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
