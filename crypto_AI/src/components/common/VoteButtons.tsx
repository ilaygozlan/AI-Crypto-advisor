import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface VoteButtonsProps {
  upVotes: number
  downVotes: number
  userVote?: 'up' | 'down'
  onVote: (vote: 'up' | 'down' | null) => void
  disabled?: boolean
  className?: string
}

export function VoteButtons({
  upVotes,
  downVotes,
  userVote,
  onVote,
  disabled = false,
  className,
}: VoteButtonsProps) {
  return (
    <TooltipProvider>
      <div className={cn('flex items-center space-x-2', className)}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-8 w-8 focus-ring',
                userVote === 'up' && 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              )}
              onClick={() => onVote(userVote === 'up' ? null : 'up')}
              disabled={disabled}
              aria-label={`Vote up (${upVotes} votes)`}
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Vote up ({upVotes} votes)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-8 w-8 focus-ring',
                userVote === 'down' && 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              )}
              onClick={() => onVote(userVote === 'down' ? null : 'down')}
              disabled={disabled}
              aria-label={`Vote down (${downVotes} votes)`}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Vote down ({downVotes} votes)</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
