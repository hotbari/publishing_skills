/**
 * User Management Page
 *
 * Admin page for managing users (create, edit, deactivate).
 * Implements FR-100 requirement from PRD.
 *
 * Features:
 * - User list table with Username, Email, Role, Status, Actions
 * - Create User button opens modal with form
 * - Edit/Deactivate actions
 * - Search functionality
 * - Filter by role
 * - Pagination
 *
 * Uses ListPage template patterns:
 * - Spacing: 8px scale (gap-4, gap-6, p-6)
 * - Layout: Fixed structure (header → search/filters → table → pagination)
 * - Components: Only from components/common
 */

import { useState } from 'react'
import { Button, Input, PageLayout } from '@/components/common'
import { Search, Plus, Edit2, UserX } from 'lucide-react'

interface User {
  id: string
  username: string
  email: string
  role: 'USER' | 'ADMIN'
  status: 'active' | 'inactive'
  createdAt: string
}

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'USER' | 'ADMIN'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // Mock data
  const allUsers: User[] = [
    {
      id: '1',
      username: 'admin1',
      email: 'admin@example.com',
      role: 'ADMIN',
      status: 'active',
      createdAt: '2026-01-15',
    },
    {
      id: '2',
      username: 'john_doe',
      email: 'john@example.com',
      role: 'USER',
      status: 'active',
      createdAt: '2026-01-20',
    },
    {
      id: '3',
      username: 'jane_smith',
      email: 'jane@example.com',
      role: 'USER',
      status: 'active',
      createdAt: '2026-01-21',
    },
    {
      id: '4',
      username: 'bob_johnson',
      email: 'bob@example.com',
      role: 'USER',
      status: 'inactive',
      createdAt: '2026-01-10',
    },
    {
      id: '5',
      username: 'admin2',
      email: 'admin2@example.com',
      role: 'ADMIN',
      status: 'active',
      createdAt: '2026-01-18',
    },
  ]

  // Filter users by search query and role
  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  // Pagination
  const itemsPerPage = 5
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleCreateUser = () => {
    setEditingUser(null)
    setIsCreateModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsCreateModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
    setEditingUser(null)
  }

  const handleSaveUser = () => {
    // TODO: Implement API call to save user
    handleCloseModal()
  }

  const handleDeactivateUser = (userId: string) => {
    // TODO: Implement API call to deactivate user
    console.log('Deactivating user:', userId)
  }

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
          <Button size="md" onClick={handleCreateUser}>
            <Plus className="w-4 h-4 mr-2" />
            Create User
          </Button>
        </div>

        {/* Search and Filters - FIXED STRUCTURE */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by username or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value as 'all' | 'USER' | 'ADMIN')
                setCurrentPage(1)
              }}
              className="px-4 h-10 border border-input rounded-md bg-background text-sm"
            >
              <option value="all">All Roles</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        {/* Table - FIXED STRUCTURE */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Username</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Role</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Created</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b last:border-0 hover:bg-muted/50"
                  >
                    <td className="p-4 font-medium">{user.username}</td>
                    <td className="p-4 text-muted-foreground">{user.email}</td>
                    <td className="p-4">
                      <span
                        className={
                          user.role === 'ADMIN'
                            ? 'bg-primary/20 text-primary px-2 py-1 rounded text-sm'
                            : 'bg-secondary/20 text-secondary px-2 py-1 rounded text-sm'
                        }
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={
                          user.status === 'active'
                            ? 'text-success font-medium'
                            : 'text-muted-foreground'
                        }
                      >
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {user.createdAt}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        {user.status === 'active' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeactivateUser(user.id)}
                          >
                            <UserX className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - FIXED STRUCTURE */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {paginatedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
            {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{' '}
            {filteredUsers.length} users
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Create/Edit User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-semibold mb-4">
              {editingUser ? 'Edit User' : 'Create User'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Username</label>
                <Input
                  placeholder="Enter username"
                  defaultValue={editingUser?.username}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="Enter email"
                  defaultValue={editingUser?.email}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Role</label>
                <select
                  defaultValue={editingUser?.role || 'USER'}
                  className="w-full px-4 py-2 mt-1 border border-input rounded-md bg-background text-sm"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              {!editingUser && (
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    className="mt-1"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSaveUser}>
                {editingUser ? 'Save Changes' : 'Create User'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
