import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/lib/state/auth.store'
import { usePrefsStore } from '@/lib/state/prefs.store'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * Route guard component that handles authentication and onboarding redirects
 * Ensures users are properly authenticated and have completed onboarding
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()
  const { hasCompletedOnboarding } = usePrefsStore()
  const location = useLocation()

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  // Redirect to onboarding if not completed
  if (!hasCompletedOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  // Redirect to dashboard if onboarding is complete but user is on onboarding page
  if (hasCompletedOnboarding && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
