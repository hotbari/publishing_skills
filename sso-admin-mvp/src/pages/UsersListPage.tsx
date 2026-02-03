import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, PageLayout } from '@/components/common'
import { Search, Plus, Filter, CheckCircle, XCircle } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'viewer'
  status: 'active' | 'inactive' | 'suspended'
  lastLogin: string
  mfaEnabled: boolean
}

export function UsersListPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  // Mock SSO users data
  const users: User[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@company.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2026-02-03 14:30',
      mfaEnabled: true,
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@company.com',
      role: 'user',
      status: 'active',
      lastLogin: '2026-02-03 09:15',
      mfaEnabled: true,
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@company.com',
      role: 'user',
      status: 'inactive',
      lastLogin: '2026-01-28 16:45',
      mfaEnabled: false,
    },
    {
      id: '4',
      name: 'David Lee',
      email: 'david@company.com',
      role: 'viewer',
      status: 'suspended',
      lastLogin: '2026-01-25 11:20',
      mfaEnabled: false,
    },
  ]

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'text-success'
      case 'inactive':
        return 'text-muted-foreground'
      case 'suspended':
        return 'text-destructive'
    }
  }

  const getRoleBadgeColor = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-primary/10 text-primary'
      case 'user':
        return 'bg-secondary text-secondary-foreground'
      case 'viewer':
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Users</h1>
            <p className="text-muted-foreground mt-2">
              Manage SSO user accounts and permissions
            </p>
          </div>
          <Button size="md">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
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

        {/* Table */}
        <div className="border rounded-lg">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Email</th>
                <th className="text-left p-4 font-medium">Role</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">MFA</th>
                <th className="text-left p-4 font-medium">Last Login</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b last:border-0 hover:bg-muted/50 cursor-pointer"
                  onClick={() => navigate(`/users/${user.id}`)}
                >
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-muted-foreground">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.mfaEnabled ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <XCircle className="w-4 h-4 text-muted-foreground" />
                    )}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {user.lastLogin}
                  </td>
                  <td className="p-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/users/${user.id}`)
                      }}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing 1-{filteredUsers.length} of {users.length} users
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
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
