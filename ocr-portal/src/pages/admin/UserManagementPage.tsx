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
            <h1 className="text-3xl font-semibold">사용자</h1>
            <p className="text-muted-foreground mt-2">
              사용자 계정 및 권한 관리
            </p>
          </div>
          <Button size="md" onClick={handleCreateUser}>
            <Plus className="w-4 h-4 mr-2" />
            사용자 생성
          </Button>
        </div>

        {/* Search and Filters - FIXED STRUCTURE */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="사용자명 또는 이메일로 검색..."
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
              <option value="all">전체 역할</option>
              <option value="USER">사용자</option>
              <option value="ADMIN">관리자</option>
            </select>
          </div>
        </div>

        {/* Table - FIXED STRUCTURE */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">사용자명</th>
                <th className="text-left p-4 font-medium">이메일</th>
                <th className="text-left p-4 font-medium">역할</th>
                <th className="text-left p-4 font-medium">상태</th>
                <th className="text-left p-4 font-medium">생성일</th>
                <th className="text-left p-4 font-medium">작업</th>
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
                        {user.status === 'active' ? '활성' : '비활성'}
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
                    사용자를 찾을 수 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - FIXED STRUCTURE */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            전체 {filteredUsers.length}명 중 {paginatedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
            {Math.min(currentPage * itemsPerPage, filteredUsers.length)}명 표시
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              이전
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              다음
            </Button>
          </div>
        </div>
      </div>

      {/* Create/Edit User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-semibold mb-4">
              {editingUser ? '사용자 수정' : '사용자 생성'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">사용자명</label>
                <Input
                  placeholder="사용자명을 입력하세요"
                  defaultValue={editingUser?.username}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">이메일</label>
                <Input
                  type="email"
                  placeholder="이메일을 입력하세요"
                  defaultValue={editingUser?.email}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">역할</label>
                <select
                  defaultValue={editingUser?.role || 'USER'}
                  className="w-full px-4 py-2 mt-1 border border-input rounded-md bg-background text-sm"
                >
                  <option value="USER">사용자</option>
                  <option value="ADMIN">관리자</option>
                </select>
              </div>

              {!editingUser && (
                <div>
                  <label className="text-sm font-medium">비밀번호</label>
                  <Input
                    type="password"
                    placeholder="비밀번호를 입력하세요"
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
                취소
              </Button>
              <Button className="flex-1" onClick={handleSaveUser}>
                {editingUser ? '변경사항 저장' : '사용자 생성'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
