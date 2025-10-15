import { motion } from 'framer-motion'
import { Card } from '@/components/common/Card'
import { usePrefsStore, type ContentType } from '@/lib/state/prefs.store'

const contentTypes: {
  value: ContentType
  title: string
  description: string
  icon: string
}[] = [
  {
    value: 'Market News',
    title: 'Market News',
    description: 'Latest cryptocurrency news and market updates',
    icon: '📰',
  },
  {
    value: 'Charts',
    title: 'Charts',
    description: 'Technical analysis and price charts',
    icon: '📊',
  },
  {
    value: 'Social',
    title: 'Social',
    description: 'Social media sentiment and community insights',
    icon: '💬',
  },
  {
    value: 'Fun',
    title: 'Fun',
    description: 'Memes, jokes, and entertaining crypto content',
    icon: '🎉',
  },
]

export function StepContentTypes() {
  const { contentTypes: selectedTypes, setContentTypes } = usePrefsStore()

  const toggleContentType = (type: ContentType) => {
    if (selectedTypes.includes(type)) {
      setContentTypes(selectedTypes.filter(t => t !== type))
    } else {
      setContentTypes([...selectedTypes, type])
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">What content interests you?</h3>
        <p className="text-muted-foreground">
          Choose the types of content you'd like to see in your dashboard.
        </p>
      </div>

      <div className="grid gap-4">
        {contentTypes.map((type, index) => (
          <motion.div
            key={type.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-200 ${
                selectedTypes.includes(type.value)
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
                    selectedTypes.includes(type.value)
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  }`}
                >
                  {selectedTypes.includes(type.value) && (
                    <div className="w-full h-full rounded-full bg-primary-foreground scale-50" />
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedTypes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-muted-foreground"
        >
          Selected: {selectedTypes.join(', ')}
        </motion.div>
      )}
    </div>
  )
}
