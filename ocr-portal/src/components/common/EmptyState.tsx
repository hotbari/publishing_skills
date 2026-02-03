import * as React from 'react'
import { cn } from '@/lib/utils'
import { FileX, Search, Inbox } from 'lucide-react'
import { Button } from './Button'

export interface EmptyStateProps {
  icon?: 'file' | 'search' | 'inbox' | React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

/**
 * EmptyState Component
 *
 * Empty state placeholder
 * Consistency rules:
 * - All empty states use this component
 * - Consistent iconography
 * - Optional action button
 * - Spacing follows 8px scale
 */
export function EmptyState({
  icon = 'inbox',
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    file: FileX,
    search: Search,
    inbox: Inbox,
  }

  const IconComponent = typeof icon === 'string' && icon in iconMap ? iconMap[icon] : null

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center',
        className
      )}
    >
      {/* Icon */}
      <div className="mb-6 p-6 bg-muted/50 rounded-full">
        {IconComponent ? (
          <IconComponent className="h-12 w-12 text-muted-foreground" />
        ) : (
          icon
        )}
      </div>

      {/* Content */}
      <div className="space-y-2 mb-6 max-w-md">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Action */}
      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </div>
  )
}
