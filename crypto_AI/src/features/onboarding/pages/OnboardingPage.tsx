import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/common/SectionHeader'
import { StepAssets } from '../components/StepAssets'
import { StepInvestorType } from '../components/StepInvestorType'
import { StepContentTypes } from '../components/StepContentTypes'
import { usePrefsStore } from '@/lib/state/prefs.store'

const steps = [
  { id: 1, title: 'Assets', component: StepAssets },
  { id: 2, title: 'Investor Type', component: StepInvestorType },
  { id: 3, title: 'Content Types', component: StepContentTypes },
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const { assets, investorType, contentTypes, setHasCompletedOnboarding } = usePrefsStore()

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return assets.length > 0
      case 1:
        return investorType !== null
      case 2:
        return contentTypes.length > 0
      default:
        return false
    }
  }

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Mark onboarding as completed and redirect to dashboard
      setIsSaving(true)
      try {
        setHasCompletedOnboarding(true)
        navigate('/dashboard')
      } catch (error) {
        console.error('Error completing onboarding:', error)
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className="max-w-4xl mx-auto">
      <SectionHeader
        title="Welcome to AI Crypto Advisor"
        subtitle="Let's personalize your experience in just a few steps"
        className="text-center mb-12"
      />

      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                index <= currentStep ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index < currentStep ? '✓' : step.id}
              </div>
              <span className="ml-2 text-sm font-medium">{step.title}</span>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-4 ${
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <motion.div
        className="min-h-[400px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStepComponent />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between mt-12">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed() || isSaving}
          className="flex items-center space-x-2"
        >
          <span>
            {isSaving
              ? 'Saving...'
              : currentStep === steps.length - 1
              ? 'Complete Setup'
              : 'Next'}
          </span>
          {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
