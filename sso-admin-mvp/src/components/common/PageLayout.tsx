import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Users, Settings } from 'lucide-react'

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
      {header ? header : <DefaultHeader />}

      <div className="flex">
        {/* Sidebar */}
        {sidebar ? (
          <aside className="w-64 border-r border-border bg-card">
            <div className="sticky top-0 h-screen overflow-y-auto p-6">
              {sidebar}
            </div>
          </aside>
        ) : (
          <DefaultSidebar />
        )}

        {/* Main Content */}
        <main className="flex-1">
          <div className="container mx-auto p-6 space-y-6">{children}</div>
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
          <span className="text-lg font-semibold">SSO Admin</span>
        </div>
      </div>
    </header>
  )
}

function DefaultSidebar() {
  const location = useLocation()

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: 'Users',
      path: '/users',
      icon: <Users className="w-4 h-4" />,
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ]

  return (
    <aside className="w-64 border-r border-border bg-card">
      <nav className="sticky top-16 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
                          (item.path === '/users' && location.pathname.startsWith('/users/'))

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-4 px-4 py-2 rounded-md transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
