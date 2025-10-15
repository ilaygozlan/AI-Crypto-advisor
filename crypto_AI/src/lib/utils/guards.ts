import type { User } from '@/lib/state/auth.store'

export function isAuthenticated(user: User | null): boolean {
  return user !== null
}

export function hasCompletedOnboarding(user: User | null): boolean {
  return user?.hasCompletedOnboarding ?? false
}

export function canAccessDashboard(user: User | null): boolean {
  return isAuthenticated(user) && hasCompletedOnboarding(user)
}

export function shouldRedirectToOnboarding(user: User | null): boolean {
  return isAuthenticated(user) && !hasCompletedOnboarding(user)
}

export function shouldRedirectToLogin(user: User | null): boolean {
  return !isAuthenticated(user)
}
