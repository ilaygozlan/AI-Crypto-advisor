import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { onboardingApi } from '@/lib/api/endpoints'
import { usePrefsStore } from '@/lib/state/prefs.store'
import type { Asset, InvestorType, ContentType } from '@/lib/state/prefs.store'

interface OnboardingData {
  assets: Asset[]
  investorType: InvestorType
  contentTypes: ContentType[]
}

export function useSaveOnboarding() {
  const navigate = useNavigate()
  const { setHasCompletedOnboarding } = usePrefsStore()

  return useMutation({
    mutationFn: async (data: OnboardingData) => {
      const response = await onboardingApi.save(data)
      return response.data
    },
    onSuccess: () => {
      setHasCompletedOnboarding(true)
      navigate('/dashboard')
    },
    onError: (error) => {
      console.error('Failed to save onboarding:', error)
    },
  })
}
