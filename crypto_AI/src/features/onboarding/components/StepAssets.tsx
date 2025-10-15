import { motion } from 'framer-motion'
import { Card } from '@/components/common/Card'
import { usePrefsStore, type Asset } from '@/lib/state/prefs.store'

const availableAssets: { value: Asset; label: string; icon: string }[] = [
  { value: 'BTC', label: 'Bitcoin', icon: '₿' },
  { value: 'ETH', label: 'Ethereum', icon: 'Ξ' },
  { value: 'SOL', label: 'Solana', icon: '◎' },
  { value: 'ADA', label: 'Cardano', icon: '₳' },
  { value: 'DOT', label: 'Polkadot', icon: '●' },
  { value: 'MATIC', label: 'Polygon', icon: '⬟' },
  { value: 'AVAX', label: 'Avalanche', icon: '🔺' },
  { value: 'LINK', label: 'Chainlink', icon: '🔗' },
]

export function StepAssets() {
  const { assets, setAssets } = usePrefsStore()

  const toggleAsset = (asset: Asset) => {
    if (assets.includes(asset)) {
      setAssets(assets.filter(a => a !== asset))
    } else {
      setAssets([...assets, asset])
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2">Which cryptocurrencies interest you?</h3>
        <p className="text-muted-foreground">
          Select all the assets you'd like to track and receive insights about.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {availableAssets.map((asset, index) => (
          <motion.div
            key={asset.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-200 ${
                assets.includes(asset.value)
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
          </motion.div>
        ))}
      </div>

      {assets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-muted-foreground"
        >
          Selected: {assets.join(', ')}
        </motion.div>
      )}
    </div>
  )
}
