import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
  className?: string
}

/**
 * Loading Component
 *
 * Loading spinner component
 * Consistency rules:
 * - All loading states use this component
 * - Sizes follow 8px scale
 * - Optional text label
 * - Can be fullscreen or inline
 */
export function Loading({
  size = 'md',
  text,
  fullScreen = false,
  className,
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  const spinner = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        fullScreen && 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50',
        className
      )}
    >
      <Loader2
        className={cn(
          'animate-spin text-primary',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  )

  return spinner
}
