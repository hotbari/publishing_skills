import * as React from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

export interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

export interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

/**
 * Modal Component
 *
 * Dialog component for overlays
 * Consistency rules:
 * - All modals/dialogs use this component
 * - Backdrop closes on click
 * - ESC key closes modal
 * - Spacing follows 8px scale
 */
export function Modal({ open, onOpenChange, children, className }: ModalProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      {/* Content */}
      <div
        className={cn(
          'relative bg-background rounded-lg shadow-lg max-w-lg w-full mx-4',
          'max-h-[90vh] overflow-y-auto',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export function ModalHeader({ children, className, ...props }: ModalContentProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-6 border-b border-border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function ModalTitle({ children, className, ...props }: ModalContentProps) {
  return (
    <h2
      className={cn('text-xl font-semibold text-foreground', className)}
      {...props}
    >
      {children}
    </h2>
  )
}

export function ModalClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      <X className="h-6 w-6" />
      <span className="sr-only">Close</span>
    </button>
  )
}

export function ModalBody({ children, className, ...props }: ModalContentProps) {
  return (
    <div className={cn('p-6 space-y-4', className)} {...props}>
      {children}
    </div>
  )
}

export function ModalFooter({ children, className, ...props }: ModalContentProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-4 p-6 border-t border-border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
