import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { EnhancedSignupForm } from '../components/EnhancedSignupForm'

export function SignupPage() {

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
            <div className="mb-8">
              <img 
                src="https://crypto-ai-photos.s3.us-east-1.amazonaws.com/ChatGPT+Image+Oct+17%2C+2025%2C+04_13_44+PM.png"
                alt="Start Your Crypto Journey"
                className="h-80 w-80 mx-auto object-contain rounded-full border-4 border-primary/20 shadow-lg"
              />
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
