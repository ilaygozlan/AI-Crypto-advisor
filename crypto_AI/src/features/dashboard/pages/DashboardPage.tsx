import { SectionHeader } from '@/components/common/SectionHeader'
import DashboardView from '../DashboardView'

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Your Crypto Dashboard"
        subtitle="Stay updated with the latest insights and market trends"
      />

      <DashboardView />
    </div>
  )
}
