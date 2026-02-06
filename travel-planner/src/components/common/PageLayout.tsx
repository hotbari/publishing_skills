import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface PageLayoutProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
}

export function PageLayout({ children, className, maxWidth = 'xl' }: PageLayoutProps) {
  return (
    <div className={cn('container mx-auto p-6', maxWidthClasses[maxWidth], className)}>
      {children}
    </div>
  )
}

export interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        {description && <p className="text-muted-foreground mt-2">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export interface CardProps {
  children: ReactNode
  title?: string
  className?: string
}

export function Card({ children, title, className }: CardProps) {
  return (
    <div className={cn('border rounded-lg p-6 bg-card', className)}>
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      {children}
    </div>
  )
}
