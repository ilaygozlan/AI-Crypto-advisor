import React, { useState } from 'react'
import { Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/common/Card'
import { useAuth } from '@/contexts/AuthContext'
import { usePrefsStore } from '@/lib/state/prefs.store'
import { useToast } from '@/hooks/useToast'
import { useNavigate } from 'react-router-dom'

const investorTypes = [
  { value: 'HODLer', title: 'HODLer', description: 'Long-term investor', icon: '💎' },
  { value: 'Day Trader', title: 'Day Trader', description: 'Active trader', icon: '📈' },
  { value: 'NFT Collector', title: 'NFT Collector', description: 'Digital collectibles', icon: '🎨' },
]

const availableAssets = [
  { value: 'BTC', label: 'Bitcoin', icon: '₿' },
  { value: 'ETH', label: 'Ethereum', icon: 'Ξ' },
  { value: 'SOL', label: 'Solana', icon: '◎' },
  { value: 'ADA', label: 'Cardano', icon: '₳' },
  { value: 'DOT', label: 'Polkadot', icon: '●' },
  { value: 'MATIC', label: 'Polygon', icon: '⬟' },
  { value: 'AVAX', label: 'Avalanche', icon: '🔺' },
  { value: 'LINK', label: 'Chainlink', icon: '🔗' },
]

const contentTypes = [
  { value: 'Market News', title: 'Market News', description: 'Latest crypto news', icon: '📰' },
  { value: 'Charts', title: 'Coin Prices', description: 'Technical analysis', icon: '📊' },
  { value: 'Social', title: 'AI Insight', description: 'Social sentiment', icon: '🧠' },
  { value: 'Fun', title: 'Fun Crypto Meme', description: 'Memes and entertainment', icon: '🎉' },
]

export function EnhancedSignupForm() {
  const navigate = useNavigate()
  const { doSignup } = useAuth()
  const { toast } = useToast()
  const { assets, contentTypes: selectedContentTypes, setAssets, setContentTypes } = usePrefsStore()
  
  // Use local state for investor type during signup
  const [localInvestorType, setLocalInvestorType] = useState<string | null>(null)
  
  
  // Initialize preferences store for signup form
  React.useEffect(() => {
    // Don't clear preferences - let user make their selections
  }, [])
  
  const [currentStep, setCurrentStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const steps = [
    { title: 'Account Details', description: 'Create your account' },
    { title: 'Investor Type', description: 'Tell us about your investment style' },
    { title: 'Assets', description: 'Choose your interests' },
    { title: 'Content', description: 'Select content preferences' },
  ]

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 0) {
      if (!formData.email) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid'
      }

      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters'
      }

      if (!formData.firstName) {
        newErrors.firstName = 'First name is required'
      }
    } else if (step === 1) {
      if (!localInvestorType) {
        newErrors.investorType = 'Please select an investor type'
      }
    } else if (step === 2) {
      if (assets.length === 0) {
        newErrors.assets = 'Please select at least one asset'
      }
    } else if (step === 3) {
      if (selectedContentTypes.length === 0) {
        newErrors.contentTypes = 'Please select at least one content type'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsLoading(true)
    try {
      // Map display values to backend-expected values
      const mapInvestorType = (displayType: string | null) => {
        switch (displayType) {
          case 'Day Trader': return 'day_trader'
          case 'HODLer': return 'investor'
          case 'NFT Collector': return 'conservative'
          default: return 'investor'
        }
      }

      const mapContentTypes = (displayTypes: string[]) => {
        return displayTypes.map(type => {
          switch (type) {
            case 'Market News': return 'articles'
            case 'Charts': return 'charts'
            case 'Social': return 'social'
            case 'Fun': return 'memes'
            default: return type.toLowerCase()
          }
        })
      }

      const signupData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        data: {
          investorType: mapInvestorType(localInvestorType),
          selectedAssets: assets,
          selectedContentTypes: mapContentTypes(selectedContentTypes),
          completedAt: new Date().toISOString()
        }
      }
      
      console.log('Signup data being sent')
      await doSignup(signupData)
      
      // Clear form data after successful signup
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
      })
      setLocalInvestorType(null)
      setAssets([])
      setContentTypes([])
      setErrors({})
      setCurrentStep(0)
      
      // Navigate to dashboard
      navigate('/dashboard')
    } catch (error) {
      console.error('Signup failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Signup failed. Please try again.'
      
      // Show professional error alert with actual server message
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: errorMessage,
      })
      
      setErrors({ submit: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAsset = (asset: string) => {
    if (assets.includes(asset as any)) {
      setAssets(assets.filter(a => a !== asset))
    } else {
      setAssets([...assets, asset as any])
    }
  }

  const toggleContentType = (type: string) => {
    if (selectedContentTypes.includes(type as any)) {
      setContentTypes(selectedContentTypes.filter(t => t !== type))
    } else {
      setContentTypes([...selectedContentTypes, type as any])
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear existing error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    // Real-time validation
    if (field === 'email' && value) {
      if (!/\S+@\S+\.\S+/.test(value)) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }))
      }
    }
    
    if (field === 'password' && value) {
      if (value.length < 8) {
        setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters' }))
      } else if (value.length >= 8) {
        // Clear password error if it meets requirements
        setErrors(prev => ({ ...prev, password: '' }))
      }
    }
    
    if (field === 'firstName' && value) {
      if (value.length < 2) {
        setErrors(prev => ({ ...prev, firstName: 'First name must be at least 2 characters' }))
      } else {
        setErrors(prev => ({ ...prev, firstName: '' }))
      }
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={errors.firstName ? 'border-destructive' : ''}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                  placeholder="Enter your password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid gap-4">
              {investorTypes.map((type) => (
                <Card
                  key={type.value}
                  className={`cursor-pointer transition-all duration-200 ${
                    localInvestorType === type.value
                      ? 'ring-2 ring-primary bg-primary/5 border-primary'
                      : 'hover:bg-muted/50 border-border'
                  }`}
                  onClick={() => setLocalInvestorType(type.value)}
                  hover={false}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{type.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{type.title}</h4>
                      <p className="text-muted-foreground">{type.description}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        localInvestorType === type.value
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}
                    >
                      {localInvestorType === type.value && (
                        <div className="w-full h-full rounded-full bg-primary-foreground scale-50" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {errors.investorType && (
              <p className="text-sm text-destructive">{errors.investorType}</p>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableAssets.map((asset) => (
                <Card
                  key={asset.value}
                  className={`cursor-pointer transition-all duration-200 ${
                    assets.includes(asset.value as any)
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => toggleAsset(asset.value)}
                  hover={false}
                >
                  <div className="text-center space-y-3">
                    <div className="text-3xl">{asset.icon}</div>
                    <div>
                      <div className="font-semibold">{asset.label}</div>
                      <div className="text-sm text-muted-foreground">{asset.value}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {assets.length > 0 && (
              <div className="text-center text-sm text-muted-foreground">
                Selected: {assets.join(', ')}
              </div>
            )}
            {errors.assets && (
              <p className="text-sm text-destructive">{errors.assets}</p>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid gap-4">
              {contentTypes.map((type) => (
                <Card
                  key={type.value}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedContentTypes.includes(type.value as any)
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => toggleContentType(type.value)}
                  hover={false}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{type.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{type.title}</h4>
                      <p className="text-muted-foreground">{type.description}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        selectedContentTypes.includes(type.value as any)
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}
                    >
                      {selectedContentTypes.includes(type.value as any) && (
                        <div className="w-full h-full rounded-full bg-primary-foreground scale-50" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {selectedContentTypes.length > 0 && (
              <div className="text-center text-sm text-muted-foreground">
                Selected: {selectedContentTypes.join(', ')}
              </div>
            )}
            {errors.contentTypes && (
              <p className="text-sm text-destructive">{errors.contentTypes}</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{steps[currentStep].title}</h3>
              <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
            </div>
            <div className="text-sm text-muted-foreground">
              {currentStep + 1} of {steps.length}
            </div>
          </div>

          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* Step content */}
          {renderStep()}

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          )}
        </div>

        </div>
      </form>
    </Card>
  )
}
