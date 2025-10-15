import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Card as UICard, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  children: React.ReactNode
  hover?: boolean
}

// Create MotionCard outside the component to prevent recreation on every render
const MotionCard = motion(UICard)

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, children, hover = true }, ref) => {
    return (
      <MotionCard
        ref={ref}
        className={cn(
          'border-border/50 shadow-sm',
          hover && 'card-hover',
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {title && (
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent className={title ? 'pt-0' : ''}>{children}</CardContent>
      </MotionCard>
    )
  }
)

Card.displayName = 'Card'
