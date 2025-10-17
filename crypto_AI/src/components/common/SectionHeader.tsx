import { motion } from 'framer-motion'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="apple-heading text-3xl font-semibold tracking-tight text-foreground text-center">
        {title}
      </h2>
      {subtitle && (
        <p className="apple-body mt-2 text-lg text-muted-foreground text-center">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
