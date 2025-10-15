import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/common/SectionHeader'
import { ProfileForm } from '../components/ProfileForm'
import { PreferencesForm } from '../components/PreferencesForm'

export function SettingsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Settings"
        subtitle="Manage your profile and preferences"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <ProfileForm />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <PreferencesForm />
        </motion.div>
      </div>
    </div>
  )
}
