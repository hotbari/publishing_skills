/**
 * List Page Example
 *
 * Template for displaying collections of data with:
 * - Search and filtering
 * - Sortable table
 * - Pagination
 * - Bulk actions (optional)
 *
 * Consistency rules applied:
 * - Spacing: 8px scale (gap-4, gap-6, p-6)
 * - Layout: Fixed structure (search bar → filters → table → pagination)
 * - Components: Only from components/common
 */

import { useState } from 'react'
import { Button, Input, PageLayout } from '@/components/common'
import { Search, Plus, Filter } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

export function UsersListPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Mock data
  const users: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive' },
  ]

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Page Header - FIXED STRUCTURE */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Users</h1>
            <p className="text-muted-foreground mt-2">
              Manage user accounts and permissions
            </p>
          </div>
          <Button size="md">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Search and Filters - FIXED STRUCTURE */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Table - FIXED STRUCTURE */}
        <div className="border rounded-lg">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Role</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-4">{user.name}</td>
                  <td className="p-4 text-muted-foreground">{user.email}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4">
                    <span
                      className={
                        user.status === 'active'
                          ? 'text-success'
                          : 'text-muted-foreground'
                      }
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination - FIXED STRUCTURE */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing 1-3 of 3 users
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
