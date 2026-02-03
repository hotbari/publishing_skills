/**
 * Detail Page Example
 *
 * Template for displaying a single record with:
 * - Header with actions
 * - Structured information sections
 * - Related data (tabs or sections)
 *
 * Consistency rules applied:
 * - Spacing: 8px scale (gap-4, gap-6, p-6)
 * - Layout: Fixed structure (header → tabs → content sections)
 * - Components: Only from components/common
 */

import { Button, PageLayout } from '@/components/common'
import { ArrowLeft, Edit, Trash } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createdAt: string
  lastLogin: string
}

export function UserDetailPage() {
  // Mock data
  const user: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    createdAt: '2024-01-15',
    lastLogin: '2024-02-03',
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Back Navigation - FIXED STRUCTURE */}
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </Button>

        {/* Page Header - FIXED STRUCTURE */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold">{user.name}</h1>
            <p className="text-muted-foreground mt-2">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive">
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Content Sections - FIXED STRUCTURE */}
        <div className="grid gap-6">
          {/* Basic Information */}
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Role</dt>
                <dd className="mt-1">{user.role}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="mt-1">
                  <span
                    className={
                      user.status === 'active'
                        ? 'text-success'
                        : 'text-muted-foreground'
                    }
                  >
                    {user.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
                <dd className="mt-1">{user.createdAt}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Last Login</dt>
                <dd className="mt-1">{user.lastLogin}</dd>
              </div>
            </dl>
          </div>

          {/* Activity History (Example of related data) */}
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm">Updated profile information</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-muted" />
                <div className="flex-1">
                  <p className="text-sm">Logged in from new device</p>
                  <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
