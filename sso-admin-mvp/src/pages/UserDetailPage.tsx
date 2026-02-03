import { useParams, useNavigate } from 'react-router-dom'
import { Button, PageLayout } from '@/components/common'
import {
  ArrowLeft,
  Edit,
  Trash,
  Shield,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'viewer'
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastLogin: string
  mfaEnabled: boolean
  emailVerified: boolean
  loginCount: number
}

export function UserDetailPage() {
  const { userId } = useParams()
  const navigate = useNavigate()

  // Mock user data
  const user: User = {
    id: userId || '1',
    name: 'Alice Johnson',
    email: 'alice@company.com',
    role: 'admin',
    status: 'active',
    createdAt: '2025-12-01',
    lastLogin: '2026-02-03 14:30',
    mfaEnabled: true,
    emailVerified: true,
    loginCount: 247,
  }

  const recentActivity = [
    { action: 'Logged in from new device', time: '2 hours ago', type: 'login' },
    { action: 'Updated profile settings', time: '1 day ago', type: 'update' },
    { action: 'Changed password', time: '3 days ago', type: 'security' },
    { action: 'Enabled MFA', time: '1 week ago', type: 'security' },
  ]

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

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Back Navigation */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/users')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Users
        </Button>

        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold">{user.name}</h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {user.email}
            </p>
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

        {/* Content Sections */}
        <div className="grid gap-6">
          {/* Account Information */}
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Role
                </dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-primary/10 text-primary">
                    {user.role}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="mt-1">
                  <span className={`font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Created At
                </dt>
                <dd className="mt-1">{user.createdAt}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Last Login
                </dt>
                <dd className="mt-1">{user.lastLogin}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Total Logins</dt>
                <dd className="mt-1 font-semibold">{user.loginCount}</dd>
              </div>
            </dl>
          </div>

          {/* Security Settings */}
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-4">
                  {user.mfaEnabled ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">Multi-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      {user.mfaEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
                {!user.mfaEnabled && (
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-4">
                  {user.emailVerified ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">Email Verified</p>
                    <p className="text-sm text-muted-foreground">
                      {user.emailVerified ? 'Verified' : 'Not verified'}
                    </p>
                  </div>
                </div>
                {!user.emailVerified && (
                  <Button variant="outline" size="sm">
                    Send Verification
                  </Button>
                )}
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" size="sm">
                  Force Password Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
