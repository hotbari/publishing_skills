import React from 'react'
import { cn } from '@/lib/utils'

interface PageLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  header?: React.ReactNode
}

/**
 * PageLayout Component
 *
 * Consistency rules:
 * - All pages use this layout wrapper
 * - Spacing follows 8px scale
 * - Header and sidebar are optional
 * - Main content area is standardized
 */
export function PageLayout({ children, sidebar, header }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {header ? (
        header
      ) : (
        <DefaultHeader />
      )}

      <div className="flex">
        {/* Sidebar */}
        {sidebar && (
          <aside className="w-64 border-r border-border bg-card">
            <div className="sticky top-0 h-screen overflow-y-auto p-6">
              {sidebar}
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1">
          <div className="container mx-auto p-6 space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function DefaultHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center px-6">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <span className="text-lg font-semibold">App</span>
        </div>
      </div>
    </header>
  )
}
