/**
 * Dashboard Page Example
 *
 * Template for overview/summary pages with:
 * - Key metrics cards
 * - Charts and visualizations
 * - Recent activity or lists
 *
 * Consistency rules applied:
 * - Spacing: 8px scale (gap-4, gap-6, p-6)
 * - Layout: Fixed grid structure (metrics → charts → tables)
 * - Components: Only from components/common
 */

import { PageLayout } from '@/components/common'
import { Users, Activity, TrendingUp, AlertCircle } from 'lucide-react'

export function DashboardPage() {
  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Page Header - FIXED STRUCTURE */}
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of system metrics and activity
          </p>
        </div>

        {/* Metrics Cards - FIXED GRID STRUCTURE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Users"
            value="2,543"
            change="+12.5%"
            icon={<Users className="w-4 h-4" />}
            trend="up"
          />
          <MetricCard
            title="Active Sessions"
            value="1,234"
            change="+5.2%"
            icon={<Activity className="w-4 h-4" />}
            trend="up"
          />
          <MetricCard
            title="Success Rate"
            value="98.4%"
            change="+0.8%"
            icon={<TrendingUp className="w-4 h-4" />}
            trend="up"
          />
          <MetricCard
            title="Active Alerts"
            value="3"
            change="-2"
            icon={<AlertCircle className="w-4 h-4" />}
            trend="down"
          />
        </div>

        {/* Charts Section - FIXED STRUCTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">User Growth</h2>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart placeholder
            </div>
          </div>
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Activity by Type</h2>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart placeholder
            </div>
          </div>
        </div>

        {/* Recent Activity - FIXED STRUCTURE */}
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { user: 'John Doe', action: 'Created new user', time: '2 minutes ago' },
              { user: 'Jane Smith', action: 'Updated profile', time: '15 minutes ago' },
              { user: 'Bob Johnson', action: 'Deleted record', time: '1 hour ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium">{activity.user}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

// Metric Card Component (example of feature-specific component)
function MetricCard({
  title,
  value,
  change,
  icon,
  trend,
}: {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  trend: 'up' | 'down'
}) {
  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <div>
        <p className="text-2xl font-semibold">{value}</p>
        <p className={`text-sm mt-1 ${trend === 'up' ? 'text-success' : 'text-destructive'}`}>
          {change} from last month
        </p>
      </div>
    </div>
  )
}
