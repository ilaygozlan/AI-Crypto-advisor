import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { EnhancedSignupForm } from '../components/EnhancedSignupForm'
import { useAuthLockout } from '@/hooks/useAuthLockout'

export function SignupPage() {
  const { lockout, isDisabled, formattedTime } = useAuthLockout()

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

            <EnhancedSignupForm />

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
