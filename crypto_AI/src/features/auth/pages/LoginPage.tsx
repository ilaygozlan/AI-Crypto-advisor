import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { AuthForm } from '../components/AuthForm'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'
import { useAuthLockout } from '@/hooks/useAuthLockout'
import { registerFailedAttempt, registerSuccess, shouldIncrementAttempt } from '@/lib/authLockout'
import { useState } from 'react'

export function LoginPage() {
  const { doLogin } = useAuth()
  const { toast } = useToast()
  const { lockout, isDisabled, formattedTime, updateLockoutState } = useAuthLockout()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)


  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true)
    try {
      await doLogin(data.email, data.password)
      
      // Reset lockout on successful login
      registerSuccess()
      updateLockoutState()
      
      // Navigate to dashboard
      navigate('/dashboard')
    } catch (error: any) {
      console.error('Login failed:', error)
      
      // Check if it's a rate limit error (HTTP 429)
      if (error?.status === 429) {
        registerFailedAttempt()
        updateLockoutState()
        
        toast({
          variant: 'destructive',
          title: '🛑 Login Attempts Exceeded',
          description: "You've reached the maximum of 3 login attempts. Please wait 15 minutes before trying again.",
        })
      } else if (shouldIncrementAttempt(error)) {
        // Increment attempt counter for 4xx errors (client errors)
        registerFailedAttempt()
        updateLockoutState()
        
        // Show professional error alert
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: "Wrong email or password",
        })
      } else {
        // Don't increment for 5xx errors (server errors)
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: "Server error. Please try again later.",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 flex">
        {/* Left side - Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
          <motion.div
            className="max-w-md w-full space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <h1 className="apple-heading text-4xl font-bold text-foreground">
                Welcome back
              </h1>
              <p className="apple-body mt-4 text-lg text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>

            <AuthForm
              onSubmit={handleLogin}
              isPending={isLoading}
              disabled={isDisabled}
            />

            {/* Login attempts counter */}
            {lockout.count > 0 && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {lockout.count} / 3 login attempts used
                </p>
                {isDisabled && (
                  <p className="text-xs text-destructive mt-1">
                    Locked for: {formattedTime}
                  </p>
                )}
                {!isDisabled && lockout.count >= 3 && (
                  <p className="text-xs text-green-600 mt-1">
                    You can now try logging in again
                  </p>
                )}
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  to="/auth/signup"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right side - Visual */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-muted/20">
          <motion.div
            className="max-w-md text-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-8">
              <img 
                src="https://crypto-ai-photos.s3.us-east-1.amazonaws.com/ChatGPT+Image+Oct+17%2C+2025%2C+04_16_17+PM.png"
                alt="AI-Powered Crypto Insights"
                className="h-80 w-80 mx-auto object-contain rounded-full border-4 border-primary/20 shadow-lg"
              />
            </div>
            <h2 className="apple-heading text-2xl font-semibold text-foreground mb-4">
              AI-Powered Crypto Insights
            </h2>
            <p className="apple-body text-muted-foreground">
              Get personalized cryptocurrency advice powered by artificial intelligence
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
