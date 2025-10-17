
interface BrainLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function BrainLoader({ size = 'md', className = '' }: BrainLoaderProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Brain outline */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-purple-200 dark:text-purple-800"
        >
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-4.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-4.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
        </svg>
      </div>
      
      {/* Filling animation */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full bg-gradient-to-t from-purple-500 to-purple-300 dark:from-purple-400 dark:to-purple-600 rounded-full animate-pulse">
          <div className="w-full h-full bg-gradient-to-t from-purple-600 to-purple-400 dark:from-purple-500 dark:to-purple-700 rounded-full animate-bounce">
            <div className="w-full h-full bg-gradient-to-t from-purple-700 to-purple-500 dark:from-purple-600 dark:to-purple-800 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>
      </div>
      
      {/* Brain icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3/4 h-3/4 text-white dark:text-purple-100"
        >
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-4.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-4.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
        </svg>
      </div>
    </div>
  )
}
