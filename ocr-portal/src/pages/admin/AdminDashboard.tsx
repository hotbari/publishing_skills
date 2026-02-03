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
          <h1 className="text-3xl font-semibold">관리자 대시보드</h1>
          <p className="text-muted-foreground mt-2">
            시스템 개요 및 모니터링 대시보드
          </p>
        </div>

        {/* 2. Metrics Cards - FIXED GRID: grid-cols-4 gap-6 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="총 사용자 수"
            value="1,247"
            change="+18.2%"
            icon={<Users className="w-4 h-4" />}
            trend="up"
            subtitle="활성 사용자"
          />
          <MetricCard
            title="총 파일 수"
            value="12,548"
            change="+245"
            icon={<FileText className="w-4 h-4" />}
            trend="up"
            subtitle="이번 달 업로드됨"
          />
          <MetricCard
            title="활성 작업"
            value="34"
            change="12개 대기 중"
            icon={<Activity className="w-4 h-4" />}
            trend="neutral"
            subtitle="현재 처리 중"
          />
          <MetricCard
            title="실패한 작업"
            value="8"
            change="어제보다 -3"
            icon={<AlertCircle className="w-4 h-4" />}
            trend="down"
            subtitle="조치 필요"
          />
        </div>

        {/* 3. Charts Row - FIXED GRID: grid-cols-2 gap-6 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Job Status Distribution Chart */}
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">작업 상태 분포</h2>
            <div className="space-y-4">
              <JobStatusBar
                label="완료됨"
                count={1247}
                percentage={82}
                color="bg-success"
                icon={<CheckCircle className="w-4 h-4 text-success" />}
              />
              <JobStatusBar
                label="처리 중"
                count={34}
                percentage={2}
                color="bg-primary"
                icon={<Clock className="w-4 h-4 text-primary" />}
              />
              <JobStatusBar
                label="대기 중"
                count={195}
                percentage={13}
                color="bg-warning"
                icon={<Activity className="w-4 h-4 text-warning" />}
              />
              <JobStatusBar
                label="실패"
                count={45}
                percentage={3}
                color="bg-destructive"
                icon={<XCircle className="w-4 h-4 text-destructive" />}
              />
            </div>
          </div>

          {/* Upload Trends Chart */}
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">업로드 동향</h2>
            <div className="space-y-4">
              <TrendItem period="오늘" count={127} change="+15%" trend="up" />
              <TrendItem period="이번 주" count={845} change="+23%" trend="up" />
              <TrendItem period="이번 달" count={3240} change="+18%" trend="up" />
              <TrendItem period="지난 달" count={2748} change="-5%" trend="down" />
            </div>
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">일평균</span>
                <span className="font-semibold">108개 파일</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Recent Activity Table - FIXED STRUCTURE */}
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">최근 활동</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    사용자
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    작업
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    리소스
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    상태
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    시간
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
          <span className="text-sm text-muted-foreground">{count}개 작업</span>
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
        <span className="text-sm text-muted-foreground">{count.toLocaleString()}개 파일</span>
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
      label: '성공',
      className: 'bg-success/10 text-success border-success/20',
    },
    processing: {
      label: '처리 중',
      className: 'bg-primary/10 text-primary border-primary/20',
    },
    failed: {
      label: '실패',
      className: 'bg-destructive/10 text-destructive border-destructive/20',
    },
    pending: {
      label: '대기 중',
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
    action: 'OCR 추출 트리거',
    resource: 'document_2024_report.pdf',
    status: 'success' as const,
    time: '2분 전',
  },
  {
    user: 'Sarah Johnson',
    action: '파일 업로드',
    resource: 'invoice_march.pdf',
    status: 'processing' as const,
    time: '5분 전',
  },
  {
    user: 'Mike Wilson',
    action: '이미지 다운로드',
    resource: 'presentation_slides.pdf',
    status: 'success' as const,
    time: '12분 전',
  },
  {
    user: 'Emily Davis',
    action: '이미지 추출 트리거',
    resource: 'brochure_2024.pdf',
    status: 'failed' as const,
    time: '18분 전',
  },
  {
    user: 'Robert Brown',
    action: '파일 업로드',
    resource: 'contract_draft.pdf',
    status: 'pending' as const,
    time: '25분 전',
  },
  {
    user: 'Lisa Anderson',
    action: 'OCR 결과 조회',
    resource: 'annual_report_2023.pdf',
    status: 'success' as const,
    time: '34분 전',
  },
  {
    user: 'David Martinez',
    action: '실패한 작업 재시도',
    resource: 'scanned_document.pdf',
    status: 'processing' as const,
    time: '45분 전',
  },
  {
    user: 'Jennifer Taylor',
    action: '텍스트 파일 다운로드',
    resource: 'meeting_notes.pdf',
    status: 'success' as const,
    time: '1시간 전',
  },
]

export default AdminDashboard
