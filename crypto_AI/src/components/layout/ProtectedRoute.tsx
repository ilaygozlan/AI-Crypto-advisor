import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/lib/state/auth.store'
import { usePrefsStore } from '@/lib/state/prefs.store'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()
  const { hasCompletedOnboarding } = usePrefsStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  // If user hasn't completed onboarding, redirect to onboarding
  if (!hasCompletedOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  // If user has completed onboarding but is on onboarding page, redirect to dashboard
  if (hasCompletedOnboarding && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
