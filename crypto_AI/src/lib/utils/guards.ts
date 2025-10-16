type User = { id: string; email: string; firstName?: string; lastName?: string }

export function isAuthenticated(user: User | null): boolean {
  return user !== null
}

export function canAccessDashboard(user: User | null): boolean {
  return isAuthenticated(user)
}

export function shouldRedirectToLogin(user: User | null): boolean {
  return !isAuthenticated(user)
}
