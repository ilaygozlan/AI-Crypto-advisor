import axios from 'axios'
import { useAuthStore } from '@/lib/state/auth.store'
import { createMockApiClient } from './mock'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
const isMockMode = import.meta.env.VITE_USE_MOCK_API === 'true'

// Use mock API client in standalone mode
export const apiClient = isMockMode 
  ? createMockApiClient()
  : axios.create({
      baseURL,
      timeout: 10000,
      withCredentials: true, // Enable cookies for refresh token
      headers: {
        'Content-Type': 'application/json',
      },
    })

if (isMockMode) {
  console.log('🎭 Using Mock API for standalone development')
}

// Only add interceptors for real axios client (not mock)
if (!isMockMode && apiClient.interceptors) {
  // Request interceptor to add auth token (except for refresh endpoint)
  apiClient.interceptors.request.use(
    (config) => {
      // Don't add Authorization header for refresh endpoint (uses cookie)
      if (config.url?.includes('/auth/refresh')) {
        return config
      }
      
      const { accessToken } = useAuthStore.getState()
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor for error handling and token refresh
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        
        try {
          // Attempt to refresh token using cookie
          const refreshResponse = await axios.post(
            `${baseURL}/auth/refresh`,
            {},
            { withCredentials: true }
          )
          
          const { accessToken } = refreshResponse.data.data
          useAuthStore.getState().setToken(accessToken)
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return apiClient(originalRequest)
        } catch (refreshError) {
          // Refresh failed, logout user
          useAuthStore.getState().logout()
          window.location.href = '/auth/login'
          return Promise.reject(refreshError)
        }
      }
      
      return Promise.reject(error)
    }
  )
}
