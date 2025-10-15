export interface OnboardingStep {
  id: number
  title: string
  component: React.ComponentType
}

export interface OnboardingData {
  assets: string[]
  investorType: string
  contentTypes: string[]
}
