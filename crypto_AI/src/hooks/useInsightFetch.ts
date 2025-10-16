import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { insightsApi } from '@/lib/api/newEndpoints'
import { useToast } from '@/hooks/useToast'

export function useInsightFetch() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const fetchInsightAndNavigate = useCallback(async (userId: string, redirectTo: string = '/dashboard?tab=ai') => {
    try {
      // Fetch the insight in the background
      await insightsApi.getTodayInsight(userId)
      
      // Show success message
      toast({
        title: 'AI Insight Generated!',
        description: 'Your personalized crypto insight is ready.',
      })
      
      // Navigate to dashboard with AI tab selected
      navigate(redirectTo)
    } catch (error) {
      console.error('Failed to fetch insight:', error)
      
      // Still navigate to dashboard if insight fetch fails
      toast({
        title: 'Welcome!',
        description: 'Your account is ready. AI insights will be available shortly.',
      })
      
      navigate('/dashboard')
    }
  }, [navigate, toast])

  return { fetchInsightAndNavigate }
}
