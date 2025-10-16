import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { SignupPage } from '@/features/auth/pages/SignupPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { NewsPage } from '@/features/news/pages/NewsPage'

export const router = createBrowserRouter([
  {
    path: '/auth/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/signup',
    element: <SignupPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'news',
        element: <NewsPage />,
      },
    ],
  },
])
