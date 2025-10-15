import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/lib/api/endpoints'
import { useAuthStore } from '@/lib/state/auth.store'
import { usePrefsStore } from '@/lib/state/prefs.store'
import type { LoginRequest } from '@/types/auth'

/**
 * Hook for handling user login
 * Manages authentication state and redirects based on onboarding status
 */
export function useLogin() {
  const navigate = useNavigate()
  const { setUser, setToken } = useAuthStore()
  const { setHasCompletedOnboarding } = usePrefsStore()

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      console.log('🔐 Login attempt with data:', data)
      console.log('🔐 Using authApi:', authApi)
      const response = await authApi.login(data)
      console.log('🔐 Login response:', response)
      return response.data
    },
    onSuccess: (response) => {
      console.log('🔐 onSuccess called with response:', response)
      if (response && typeof response === 'object' && response !== null) {
        const data = response as any
        if (data.user && data.accessToken) {
          console.log('🔐 Setting user and token, redirecting...')
          setUser(data.user)
          setToken(data.accessToken)
          setHasCompletedOnboarding(data.user.hasCompletedOnboarding || false)
          
          // Redirect based on onboarding completion status
          if (data.user.hasCompletedOnboarding) {
            console.log('🔐 Redirecting to dashboard')
            navigate('/dashboard')
          } else {
            console.log('🔐 Redirecting to onboarding')
            navigate('/onboarding')
          }
        } else {
          console.log('🔐 Missing user or accessToken in response:', data)
        }
      } else {
        console.log('🔐 Invalid response structure:', response)
      }
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })
}
