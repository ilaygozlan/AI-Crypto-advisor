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
      const response = await authApi.login(data)
      return response.data
    },
    onSuccess: (response) => {
      if ('data' in response && typeof response.data === 'object' && response.data !== null) {
        const data = response.data as any
        if (data.user && data.accessToken) {
          setUser(data.user)
          setToken(data.accessToken)
          setHasCompletedOnboarding(data.user.hasCompletedOnboarding || false)
          
          // Redirect based on onboarding completion status
          if (data.user.hasCompletedOnboarding) {
            navigate('/dashboard')
          } else {
            navigate('/onboarding')
          }
        }
      }
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })
}
