import * as React from 'react'
import { cn } from '@/lib/utils'

export interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

export interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  className?: string
  onTabChange?: (tabId: string) => void
}

/**
 * Tabs Component
 *
 * Tab navigation component for file detail page
 * Consistency rules:
 * - All tabbed interfaces use this component
 * - Active state clearly visible
 * - Keyboard navigation supported
 * - Spacing follows 8px scale
 */
export function Tabs({ tabs, defaultTab, className, onTabChange }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content

  return (
    <div className={cn('w-full', className)}>
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex gap-6" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'px-1 py-4 text-sm font-medium transition-colors relative',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6" role="tabpanel">
        {activeTabContent}
      </div>
    </div>
  )
}
