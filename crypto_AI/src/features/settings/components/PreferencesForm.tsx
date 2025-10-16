import { Card } from '@/components/common/Card'
import { usePrefsStore } from '@/lib/state/prefs.store'
import { Badge } from '@/components/ui/badge'

export function PreferencesForm() {
  const { assets, investorType, contentTypes } = usePrefsStore()

  return (
    <Card title="⚙️ Preferences">
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-sm mb-3">Selected Assets</h4>
          <div className="flex flex-wrap gap-2">
            {assets.length > 0 ? (
              assets.map((asset) => (
                <Badge key={asset} variant="secondary">
                  {asset}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No assets selected</p>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3">Investor Type</h4>
          <div>
            {investorType ? (
              <Badge variant="outline">{investorType}</Badge>
            ) : (
              <p className="text-sm text-muted-foreground">Not selected</p>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3">Content Types</h4>
          <div className="flex flex-wrap gap-2">
            {contentTypes.length > 0 ? (
              contentTypes.map((type) => (
                <Badge key={type} variant="secondary">
                  {type}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No content types selected</p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            To change your preferences, complete the onboarding process again.
          </p>
        </div>
      </div>
    </Card>
  )
}
