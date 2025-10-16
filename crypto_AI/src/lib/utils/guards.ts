type User = { id: string; email: string; firstName?: string; lastName?: string }

export function isAuthenticated(user: User | null): boolean {
  return user !== null
}

export function hasCompletedOnboarding(user: User | null): boolean {
  // For now, assume onboarding is completed if user exists
  // This can be enhanced when we add onboarding completion tracking
  return user !== null
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
