/**
 * Admin Dashboard Page
 *
 * Template: Dashboard Page (from page-templates.md)
 *
 * Structure:
 * - Page header: "Admin Dashboard"
 * - Metrics cards grid (4 columns): Total Users, Total Files, Active Jobs, Failed Jobs
 * - Charts row (2 columns): Job Status Distribution, Upload Trends
 * - Recent Activity table
 *
 * Consistency rules applied:
 * - Spacing: 8px scale (gap-6, p-6)
 * - Layout: Fixed grid structure per template
 * - Components: Only from components/common
 * - Typography: text-3xl for titles, text-xl for sections
 *
 * PRD Reference: Section 12 (UI-005) - Admin Console
 */

import { PageLayout } from '@/components/common'
import {
  Users,
  FileText,
  Activity,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react'

export function AdminDashboard() {
  return (
    <PageLayout>
      <div className="space-y-6">
        {/* 1. Page Header - FIXED STRUCTURE */}
        <div>
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            System overview and monitoring dashboard
          </p>
        </div>

        {/* 2. Metrics Cards - FIXED GRID: grid-cols-4 gap-6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Users"
            value="1,247"
            change="+18.2%"
            icon={<Users className="w-4 h-4" />}
            trend="up"
            subtitle="Active users"
          />
          <MetricCard
            title="Total Files"
            value="12,548"
            change="+245"
            icon={<FileText className="w-4 h-4" />}
            trend="up"
            subtitle="Uploaded this month"
          />
          <MetricCard
            title="Active Jobs"
            value="34"
            change="12 pending"
            icon={<Activity className="w-4 h-4" />}
            trend="neutral"
            subtitle="Currently processing"
          />
          <MetricCard
            title="Failed Jobs"
            value="8"
            change="-3 from yesterday"
            icon={<AlertCircle className="w-4 h-4" />}
            trend="down"
            subtitle="Requires attention"
          />
        </div>

        {/* 3. Charts Row - FIXED GRID: grid-cols-2 gap-6 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Job Status Distribution Chart */}
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Job Status Distribution</h2>
            <div className="space-y-4">
              <JobStatusBar
                label="Completed"
                count={1247}
                percentage={82}
                color="bg-success"
                icon={<CheckCircle className="w-4 h-4 text-success" />}
              />
              <JobStatusBar
                label="Processing"
                count={34}
                percentage={2}
                color="bg-primary"
                icon={<Clock className="w-4 h-4 text-primary" />}
              />
              <JobStatusBar
                label="Pending"
                count={195}
                percentage={13}
                color="bg-warning"
                icon={<Activity className="w-4 h-4 text-warning" />}
              />
              <JobStatusBar
                label="Failed"
                count={45}
                percentage={3}
                color="bg-destructive"
                icon={<XCircle className="w-4 h-4 text-destructive" />}
              />
            </div>
          </div>

          {/* Upload Trends Chart */}
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Upload Trends</h2>
            <div className="space-y-4">
              <TrendItem period="Today" count={127} change="+15%" trend="up" />
              <TrendItem period="This Week" count={845} change="+23%" trend="up" />
              <TrendItem period="This Month" count={3240} change="+18%" trend="up" />
              <TrendItem period="Last Month" count={2748} change="-5%" trend="down" />
            </div>
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Average per day</span>
                <span className="font-semibold">108 files</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Recent Activity Table - FIXED STRUCTURE */}
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    User
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Action
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Resource
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity, index) => (
                  <tr
                    key={index}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {activity.user
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        </div>
                        <span className="text-sm font-medium">{activity.user}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{activity.action}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {activity.resource}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={activity.status} />
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {activity.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

// Metric Card Component - Feature-specific, follows design system
interface MetricCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  trend: 'up' | 'down' | 'neutral'
  subtitle: string
}

function MetricCard({ title, value, change, icon, trend, subtitle }: MetricCardProps) {
  const getTrendColor = () => {
    if (trend === 'neutral') return 'text-muted-foreground'
    return trend === 'up' ? 'text-success' : 'text-destructive'
  }

  const getTrendIcon = () => {
    if (trend === 'neutral') return null
    return trend === 'up' ? (
      <TrendingUp className="w-3 h-3" />
    ) : (
      <TrendingDown className="w-3 h-3" />
    )
  }

  return (
    <div className="border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <div>
        <p className="text-2xl font-semibold mb-1">{value}</p>
        <p className="text-xs text-muted-foreground mb-2">{subtitle}</p>
        <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
          {getTrendIcon()}
          <span>{change}</span>
        </div>
      </div>
    </div>
  )
}

// Job Status Bar Component
interface JobStatusBarProps {
  label: string
  count: number
  percentage: number
  color: string
  icon: React.ReactNode
}

function JobStatusBar({ label, count, percentage, color, icon }: JobStatusBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{count} jobs</span>
          <span className="text-sm font-semibold">{percentage}%</span>
        </div>
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Trend Item Component
interface TrendItemProps {
  period: string
  count: number
  change: string
  trend: 'up' | 'down'
}

function TrendItem({ period, count, change, trend }: TrendItemProps) {
  const trendColor = trend === 'up' ? 'text-success' : 'text-destructive'
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium">{period}</span>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{count.toLocaleString()} files</span>
        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon className="w-3 h-3" />
          <span className="text-sm font-semibold">{change}</span>
        </div>
      </div>
    </div>
  )
}

// Status Badge Component
interface StatusBadgeProps {
  status: 'success' | 'processing' | 'failed' | 'pending'
}

function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    success: {
      label: 'Success',
      className: 'bg-success/10 text-success border-success/20',
    },
    processing: {
      label: 'Processing',
      className: 'bg-primary/10 text-primary border-primary/20',
    },
    failed: {
      label: 'Failed',
      className: 'bg-destructive/10 text-destructive border-destructive/20',
    },
    pending: {
      label: 'Pending',
      className: 'bg-warning/10 text-warning border-warning/20',
    },
  }

  const { label, className } = config[status]

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${className}`}
    >
      {label}
    </span>
  )
}

// Sample data for recent activities
const recentActivities = [
  {
    user: 'John Smith',
    action: 'Triggered OCR extraction',
    resource: 'document_2024_report.pdf',
    status: 'success' as const,
    time: '2 minutes ago',
  },
  {
    user: 'Sarah Johnson',
    action: 'Uploaded file',
    resource: 'invoice_march.pdf',
    status: 'processing' as const,
    time: '5 minutes ago',
  },
  {
    user: 'Mike Wilson',
    action: 'Downloaded images',
    resource: 'presentation_slides.pdf',
    status: 'success' as const,
    time: '12 minutes ago',
  },
  {
    user: 'Emily Davis',
    action: 'Triggered image extraction',
    resource: 'brochure_2024.pdf',
    status: 'failed' as const,
    time: '18 minutes ago',
  },
  {
    user: 'Robert Brown',
    action: 'Uploaded file',
    resource: 'contract_draft.pdf',
    status: 'pending' as const,
    time: '25 minutes ago',
  },
  {
    user: 'Lisa Anderson',
    action: 'Viewed OCR results',
    resource: 'annual_report_2023.pdf',
    status: 'success' as const,
    time: '34 minutes ago',
  },
  {
    user: 'David Martinez',
    action: 'Retried failed job',
    resource: 'scanned_document.pdf',
    status: 'processing' as const,
    time: '45 minutes ago',
  },
  {
    user: 'Jennifer Taylor',
    action: 'Downloaded text file',
    resource: 'meeting_notes.pdf',
    status: 'success' as const,
    time: '1 hour ago',
  },
]

export default AdminDashboard
