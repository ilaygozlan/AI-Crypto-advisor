import { createContext, useContext, ReactNode } from 'react'
import { useAuthController } from '@/state/useAuth'

type User = { 
  id: string; 
  email: string; 
  firstName?: string; 
  lastName?: string;
  preferences?: {
    investorType: string;
    selectedAssets: string[];
    selectedContentTypes: string[];
    completedAt: string;
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  doLogin: (email: string, password: string) => Promise<User>
  doSignup: (payload: {
    email: string; password: string; firstName?: string; lastName?: string;
    data: { investorType: string; selectedAssets: string[]; selectedContentTypes: string[]; completedAt: string; }
  }) => Promise<User>
  doLogout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuthController()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
