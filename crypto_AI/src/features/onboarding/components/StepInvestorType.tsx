import { motion } from 'framer-motion'
import { Card } from '@/components/common/Card'
import { usePrefsStore, type InvestorType } from '@/lib/state/prefs.store'

const investorTypes: {
  value: InvestorType
  title: string
  description: string
  icon: string
}[] = [
  {
    value: 'HODLer',
    title: 'HODLer',
    description: 'Long-term investor focused on holding assets for extended periods',
    icon: '💎',
  },
  {
    value: 'Day Trader',
    title: 'Day Trader',
    description: 'Active trader looking for short-term opportunities and market movements',
    icon: '📈',
  },
  {
    value: 'NFT Collector',
    title: 'NFT Collector',
    description: 'Interested in digital collectibles and NFT market trends',
    icon: '🎨',
  },
]

export function StepInvestorType() {
  const { investorType, setInvestorType } = usePrefsStore()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">What type of investor are you?</h3>
        <p className="text-muted-foreground">
          This helps us personalize your content and recommendations.
        </p>
      </div>

      <div className="grid gap-4">
        {investorTypes.map((type, index) => (
          <motion.div
            key={type.value}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-200 ${
                investorType === type.value
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => setInvestorType(type.value)}
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
                    investorType === type.value
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  }`}
                >
                  {investorType === type.value && (
                    <div className="w-full h-full rounded-full bg-primary-foreground scale-50" />
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
