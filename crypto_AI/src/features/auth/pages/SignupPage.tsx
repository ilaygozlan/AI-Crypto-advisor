import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { AuthForm } from '../components/AuthForm'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'
import { useAuthLockout } from '@/hooks/useAuthLockout'
import { registerFailedAttempt, registerSuccess, shouldIncrementAttempt } from '@/lib/authLockout'
import { useState } from 'react'
import type { SignupRequest, LoginRequest } from '@/types/auth'

export function SignupPage() {
  const navigate = useNavigate()
  const { doSignup } = useAuth()
  const { toast } = useToast()
  const { lockout, isDisabled, formattedTime, updateLockoutState } = useAuthLockout()
  const [isLoading, setIsLoading] = useState(false)


  const handleSignup = async (data: SignupRequest | LoginRequest) => {
    setIsLoading(true)
    try {
      // Type guard to ensure we have a SignupRequest
      if (!('name' in data)) {
        throw new Error('Invalid signup data: name is required')
      }
      
      // Split name into firstName and lastName
      const nameParts = data.name.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      // Create signup payload with default preferences
      const signupPayload = {
        email: data.email,
        password: data.password,
        firstName,
        lastName,
        data: {
          investorType: 'investor', // Default investor type
          selectedAssets: ['BTC', 'ETH', 'SOL'], // Default assets
          selectedContentTypes: ['articles', 'charts'], // Default content types
          completedAt: new Date().toISOString()
        }
      }

      await doSignup(signupPayload)
      
      // Reset lockout on successful signup
      registerSuccess()
      updateLockoutState()
      
      // Show success message
      toast({
        title: 'Account created successfully!',
        description: 'Welcome to AI Crypto Advisor. You can update your preferences in settings.',
      })
      
      navigate('/dashboard')
    } catch (error: any) {
      console.error('Signup failed:', error)
      
      // Check if it's a rate limit error (HTTP 429)
      if (error?.status === 429) {
        registerFailedAttempt()
        updateLockoutState()
        
        toast({
          variant: 'destructive',
          title: '🛑 Signup Attempts Exceeded',
          description: "You've reached the maximum of 3 signup attempts. Please wait 15 minutes before trying again.",
        })
      } else if (shouldIncrementAttempt(error)) {
        // Increment attempt counter for 4xx errors (client errors)
        registerFailedAttempt()
        updateLockoutState()
        
        // Show professional error alert with actual server message
        const errorMessage = error instanceof Error ? error.message : 'Signup failed'
        
        toast({
          variant: 'destructive',
          title: 'Signup Failed',
          description: errorMessage,
        })
      } else {
        // Don't increment for 5xx errors (server errors)
        toast({
          variant: 'destructive',
          title: 'Signup Failed',
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
            className="max-w-2xl w-full space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <h1 className="apple-heading text-4xl font-bold text-foreground">
                Create account
              </h1>
              <p className="apple-body mt-4 text-lg text-muted-foreground">
                Join the future of crypto investing
              </p>
            </div>

            <AuthForm
              type="signup"
              onSubmit={handleSignup}
              isPending={isLoading}
              disabled={isDisabled}
            />

            {/* Signup attempts counter */}
            {lockout.count > 0 && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {lockout.count} / 3 signup attempts used
                </p>
                {isDisabled && (
                  <p className="text-xs text-destructive mt-1">
                    Locked for: {formattedTime}
                  </p>
                )}
                {!isDisabled && lockout.count >= 3 && (
                  <p className="text-xs text-green-600 mt-1">
                    You can now try signing up again
                  </p>
                )}
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Sign in
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
            <div className="h-64 w-64 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-8">
              <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-4xl">💎</span>
              </div>
            </div>
            <h2 className="apple-heading text-2xl font-semibold text-foreground mb-4">
              Start Your Crypto Journey
            </h2>
            <p className="apple-body text-muted-foreground">
              Get personalized insights, market analysis, and AI-powered recommendations
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
