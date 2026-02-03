import { PageLayout } from '@/components/common'
import {
  Users,
  UserCheck,
  ShieldAlert,
  Activity,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

export function DashboardPage() {
  const metrics = [
    {
      title: 'Total Users',
      value: '2,543',
      change: '+12.5%',
      trend: 'up',
      icon: <Users className="w-4 h-4" />,
    },
    {
      title: 'Active Sessions',
      value: '1,234',
      change: '+5.2%',
      trend: 'up',
      icon: <Activity className="w-4 h-4" />,
    },
    {
      title: 'MFA Enabled',
      value: '78.4%',
      change: '+3.1%',
      trend: 'up',
      icon: <UserCheck className="w-4 h-4" />,
    },
    {
      title: 'Security Alerts',
      value: '3',
      change: '-2',
      trend: 'down',
      icon: <ShieldAlert className="w-4 h-4" />,
    },
  ]

  const recentLogins = [
    {
      user: 'Alice Johnson',
      email: 'alice@company.com',
      time: '2 minutes ago',
      location: 'San Francisco, CA',
    },
    {
      user: 'Bob Smith',
      email: 'bob@company.com',
      time: '15 minutes ago',
      location: 'New York, NY',
    },
    {
      user: 'Carol Davis',
      email: 'carol@company.com',
      time: '1 hour ago',
      location: 'Austin, TX',
    },
    {
      user: 'David Lee',
      email: 'david@company.com',
      time: '2 hours ago',
      location: 'Seattle, WA',
    },
  ]

  const securityEvents = [
    {
      type: 'warning',
      message: 'Failed login attempt detected',
      user: 'unknown@external.com',
      time: '5 minutes ago',
    },
    {
      type: 'info',
      message: 'New device login',
      user: 'alice@company.com',
      time: '2 hours ago',
    },
    {
      type: 'success',
      message: 'MFA enabled',
      user: 'bob@company.com',
      time: '1 day ago',
    },
  ]

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-semibold">SSO Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of authentication and user activity
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="border rounded-lg p-6 bg-card">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </p>
                <div className="text-muted-foreground">{metric.icon}</div>
              </div>
              <div>
                <p className="text-2xl font-semibold">{metric.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-success" />
                  )}
                  <p className="text-sm text-success">{metric.change}</p>
                  <p className="text-sm text-muted-foreground">from last month</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Logins */}
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Recent Logins</h2>
            <div className="space-y-4">
              {recentLogins.map((login, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{login.user}</p>
                    <p className="text-xs text-muted-foreground">{login.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {login.location}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">{login.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security Events */}
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Security Events</h2>
            <div className="space-y-4">
              {securityEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div
                    className={`w-2 h-2 mt-2 rounded-full ${
                      event.type === 'warning'
                        ? 'bg-warning'
                        : event.type === 'success'
                        ? 'bg-success'
                        : 'bg-primary'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{event.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.user} • {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Statistics */}
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-3xl font-semibold">2,543</p>
              <p className="text-sm text-muted-foreground mt-2">Total Users</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-3xl font-semibold">1,994</p>
              <p className="text-sm text-muted-foreground mt-2">Active Users</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-3xl font-semibold">549</p>
              <p className="text-sm text-muted-foreground mt-2">Inactive Users</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
