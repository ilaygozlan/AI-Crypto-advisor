import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { AuthForm } from '../components/AuthForm'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'
import { useState, useEffect } from 'react'

export function LoginPage() {
  const navigate = useNavigate()
  const { doLogin } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)

  // Load attempts from localStorage on component mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("loginAttempts") || "{}");
    if (stored.timestamp && Date.now() - stored.timestamp < 15 * 60 * 1000) {
      setAttempts(stored.count || 0);
      // Calculate remaining time
      const remaining = Math.max(0, 15 * 60 * 1000 - (Date.now() - stored.timestamp));
      setTimeRemaining(remaining);
    } else {
      localStorage.removeItem("loginAttempts");
      setAttempts(0);
      setTimeRemaining(0);
    }
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1000));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (attempts >= 3) {
      // Reset attempts when time expires
      setAttempts(0);
    }
  }, [timeRemaining, attempts]);

  // Save attempts to localStorage whenever attempts change
  useEffect(() => {
    if (attempts > 0) {
      localStorage.setItem("loginAttempts", JSON.stringify({
        count: attempts,
        timestamp: Date.now()
      }));
    } else {
      localStorage.removeItem("loginAttempts");
    }
  }, [attempts]);

  const handleLogin = async (data: { email: string; password: string }) => {
    // Increment attempts counter
    setAttempts(prev => prev + 1);
    setIsLoading(true)
    try {
      await doLogin(data.email, data.password)
      
      // Reset attempts counter on successful login
      setAttempts(0);
      
      // Show success message
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      })
      
      navigate('/dashboard')
    } catch (error: any) {
      console.error('Login failed:', error)
      
      // Check if it's a rate limit error (HTTP 429)
      if (error?.status === 429) {
        setTimeRemaining(15 * 60 * 1000); // Set 15 minutes countdown
        toast({
          variant: 'destructive',
          title: '🛑 Login Attempts Exceeded',
          description: "You've reached the maximum of 3 login attempts. Please wait 15 minutes before trying again.",
        })
      } else {
        // Show professional error alert
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: "Wrong email or password",
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
              type="login"
              onSubmit={handleLogin}
              isPending={isLoading}
              disabled={attempts >= 3 && timeRemaining > 0}
            />

            {/* Login attempts counter */}
            {attempts > 0 && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {attempts} / 3 login attempts used
                </p>
                {attempts >= 3 && timeRemaining > 0 && (
                  <p className="text-xs text-destructive mt-1">
                    Please wait {Math.ceil(timeRemaining / 60000)} minutes before trying again
                  </p>
                )}
                {attempts >= 3 && timeRemaining === 0 && (
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
            <div className="h-64 w-64 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-8">
              <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-4xl">🚀</span>
              </div>
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
