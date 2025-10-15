import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/common/SectionHeader'
import { NewsSection } from '../components/NewsSection'
import { PricesSection } from '../components/PricesSection'
import { AIInsightSection } from '../components/AIInsightSection'
import { MemeSection } from '../components/MemeSection'

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Your Crypto Dashboard"
        subtitle="Stay updated with the latest insights and market trends"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <NewsSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <PricesSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <AIInsightSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <MemeSection />
        </motion.div>
      </div>
    </div>
  )
}
