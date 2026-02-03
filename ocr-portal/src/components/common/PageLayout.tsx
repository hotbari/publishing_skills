import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from './Button';

interface NavItem {
  label: string;
  path: string;
  roles: ('USER' | 'ADMIN')[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Files', path: '/files', roles: ['USER', 'ADMIN'] },
  { label: 'Admin Dashboard', path: '/admin', roles: ['ADMIN'] },
  { label: 'Users', path: '/admin/users', roles: ['ADMIN'] },
  { label: 'Policies', path: '/admin/policies', roles: ['ADMIN'] },
  { label: 'Jobs', path: '/admin/jobs', roles: ['ADMIN'] },
  { label: 'Audit Logs', path: '/admin/audit-logs', roles: ['ADMIN'] },
];

interface PageLayoutProps {
  children: React.ReactNode;
}

/**
 * PageLayout Component
 *
 * Provides consistent layout structure across all pages:
 * - Header with logo and user menu
 * - Role-based sidebar navigation
 * - Responsive mobile menu
 * - Footer with system info
 * - Follows design tokens from design-system.md
 */
export function PageLayout({ children }: PageLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredNavItems = NAV_ITEMS.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false
  );

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            <Link to="/" className="text-xl font-semibold text-foreground">
              OCR Portal
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm text-muted-foreground">
              {user?.username} ({user?.role})
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside
          className={`
            w-64 border-r bg-card shadow-sm
            lg:block
            ${
              mobileMenuOpen
                ? 'fixed inset-y-0 left-0 z-40 mt-16'
                : 'hidden'
            }
          `}
        >
          <nav className="p-6">
            <ul className="space-y-4">
              {filteredNavItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      block px-4 py-2 rounded-md text-base font-medium
                      transition-colors
                      ${
                        isActive(item.path)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden mt-16"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="container mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>OCR Portal v1.0.0</div>
            <div>
              {new Date().getFullYear()} - Powered by WhaTap OCR Engine
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
