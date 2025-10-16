import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { usePrefsStore } from '@/lib/state/prefs.store'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * Route guard component that handles authentication and onboarding redirects
 * Ensures users are properly authenticated and have completed onboarding
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const { hasCompletedOnboarding } = usePrefsStore()
  const location = useLocation()

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
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
