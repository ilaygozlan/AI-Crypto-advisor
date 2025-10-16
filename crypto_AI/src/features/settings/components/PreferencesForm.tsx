import { Card } from '@/components/common/Card'
import { useAuth } from '@/contexts/AuthContext'
import { Badge } from '@/components/ui/badge'

export function PreferencesForm() {
  const { user } = useAuth()
  
  // Get preferences from user auth context
  const assets = user?.preferences?.selectedAssets || []
  const investorType = user?.preferences?.investorType
  const contentTypes = user?.preferences?.selectedContentTypes || []
  const completedAt = user?.preferences?.completedAt

  // Helper function to format investor type display
  const formatInvestorType = (type: string | undefined) => {
    if (!type) return 'Not selected'
    switch (type) {
      case 'day_trader': return 'Day Trader'
      case 'investor': return 'HODLer'
      case 'conservative': return 'NFT Collector'
      default: return type
    }
  }

  // Helper function to format content types display
  const formatContentType = (type: string) => {
    switch (type) {
      case 'articles': return 'Market News'
      case 'charts': return 'Charts'
      case 'social': return 'Social'
      case 'memes': return 'Fun'
      default: return type
    }
  }

  return (
    <Card title="⚙️ Your Preferences">
      <div className="space-y-6">
        {/* Investor Type */}
        <div>
          <h4 className="font-semibold text-sm mb-3">Investment Style</h4>
          <div>
            {investorType ? (
              <Badge variant="outline" className="text-sm">
                {formatInvestorType(investorType)}
              </Badge>
            ) : (
              <p className="text-sm text-muted-foreground">Not selected</p>
            )}
          </div>
        </div>

        {/* Selected Assets */}
        <div>
          <h4 className="font-semibold text-sm mb-3">Crypto Assets ({assets.length})</h4>
          <div className="flex flex-wrap gap-2">
            {assets.length > 0 ? (
              assets.map((asset) => (
                <Badge key={asset} variant="secondary" className="text-sm">
                  {asset}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No assets selected</p>
            )}
          </div>
        </div>

        {/* Content Types */}
        <div>
          <h4 className="font-semibold text-sm mb-3">Content Interests ({contentTypes.length})</h4>
          <div className="flex flex-wrap gap-2">
            {contentTypes.length > 0 ? (
              contentTypes.map((type) => (
                <Badge key={type} variant="secondary" className="text-sm">
                  {formatContentType(type)}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No content types selected</p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            These preferences personalize your dashboard experience. They were set when you created your account.
          </p>
        </div>
      </div>
    </Card>
  )
}
