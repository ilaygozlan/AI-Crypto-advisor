import { Skeleton as UISkeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular' | 'card'
}

export function Skeleton({ className, variant = 'rectangular', ...props }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-muted'
  
  const variantClasses = {
    text: 'h-4 w-full rounded',
    rectangular: 'h-4 w-full rounded-md',
    circular: 'h-10 w-10 rounded-full',
    card: 'h-32 w-full rounded-lg',
  }

  return (
    <UISkeleton
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" className="h-12 w-12" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  )
}
