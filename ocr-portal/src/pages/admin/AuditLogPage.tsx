import { useState, useMemo } from 'react'
import { Button, Input, PageLayout, Table, Modal, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter } from '@/components/common'
import { Search, Filter, Download } from 'lucide-react'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'

interface AuditLog {
  id: string
  timestamp: string
  user: string
  action: string
  target: string
  result: 'success' | 'failure'
  ipAddress: string
  userAgent: string
  details?: string
}

// Mock data - replace with API call
const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: '1',
    timestamp: '2026-02-03T10:30:00Z',
    user: 'john.doe@example.com',
    action: 'upload',
    target: 'document.pdf',
    result: 'success',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0...',
    details: 'File uploaded successfully: 5.2MB',
  },
  {
    id: '2',
    timestamp: '2026-02-03T10:25:15Z',
    user: 'admin@example.com',
    action: 'change_policy',
    target: 'ocr_settings',
    result: 'success',
    ipAddress: '192.168.1.50',
    userAgent: 'Mozilla/5.0...',
    details: 'Updated OCR language to ko',
  },
  {
    id: '3',
    timestamp: '2026-02-03T10:15:00Z',
    user: 'jane.smith@example.com',
    action: 'run_ocr',
    target: 'file_123',
    result: 'success',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0...',
    details: 'OCR extraction completed',
  },
  {
    id: '4',
    timestamp: '2026-02-03T10:00:00Z',
    user: 'john.doe@example.com',
    action: 'download_text',
    target: 'file_123',
    result: 'success',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0...',
    details: 'Downloaded OCR text result',
  },
  {
    id: '5',
    timestamp: '2026-02-03T09:45:00Z',
    user: 'admin@example.com',
    action: 'view_image',
    target: 'file_456',
    result: 'success',
    ipAddress: '192.168.1.50',
    userAgent: 'Mozilla/5.0...',
    details: 'Viewed extracted images',
  },
]

const ACTION_OPTIONS = [
  { value: 'all', label: 'All Actions' },
  { value: 'upload', label: 'Upload' },
  { value: 'run_ocr', label: 'OCR Extraction' },
  { value: 'run_image_extract', label: 'Image Extraction' },
  { value: 'view_text', label: 'View Text' },
  { value: 'download_text', label: 'Download Text' },
  { value: 'view_image', label: 'View Image' },
  { value: 'download_image', label: 'Download Image' },
  { value: 'delete_file', label: 'Delete File' },
  { value: 'change_policy', label: 'Change Policy' },
]

export default function AuditLogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAction, setSelectedAction] = useState('all')
  const [selectedUser, setSelectedUser] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Filter logs based on criteria
  const filteredLogs = useMemo(() => {
    return MOCK_AUDIT_LOGS.filter((log) => {
      const matchesSearch =
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.id.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesAction = selectedAction === 'all' || log.action === selectedAction

      const matchesUser = selectedUser === '' || log.user === selectedUser

      const matchesDateRange = true // TODO: implement date range filtering

      return matchesSearch && matchesAction && matchesUser && matchesDateRange
    })
  }, [searchQuery, selectedAction, selectedUser, startDate, endDate])

  // Get unique users for filter dropdown
  const uniqueUsers = useMemo(() => {
    return Array.from(new Set(MOCK_AUDIT_LOGS.map((log) => log.user))).sort()
  }, [])

  // Format timestamp for display
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  // Get result badge color
  const getResultColor = (result: 'success' | 'failure'): string => {
    return result === 'success' ? 'text-success' : 'text-destructive'
  }

  // Get action label
  const getActionLabel = (action: string): string => {
    const option = ACTION_OPTIONS.find((opt) => opt.value === action)
    return option?.label || action
  }

  // Export logs as CSV
  const handleExportLogs = () => {
    const headers = ['Timestamp', 'User', 'Action', 'Target', 'Result', 'IP Address']
    const rows = filteredLogs.map((log) => [
      formatTimestamp(log.timestamp),
      log.user,
      getActionLabel(log.action),
      log.target,
      log.result,
      log.ipAddress,
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  // Define table columns
  const columnHelper = createColumnHelper<AuditLog>()

  const columns: ColumnDef<AuditLog, any>[] = [
    columnHelper.accessor('timestamp', {
      header: 'Timestamp',
      cell: (info) => (
        <span className="text-sm">{formatTimestamp(info.getValue())}</span>
      ),
      size: 180,
    }),
    columnHelper.accessor('user', {
      header: 'User',
      cell: (info) => <span className="text-sm">{info.getValue()}</span>,
      size: 160,
    }),
    columnHelper.accessor('action', {
      header: 'Action',
      cell: (info) => (
        <span className="text-sm font-medium">{getActionLabel(info.getValue())}</span>
      ),
      size: 140,
    }),
    columnHelper.accessor('target', {
      header: 'Target',
      cell: (info) => (
        <span className="text-sm text-muted-foreground">{info.getValue()}</span>
      ),
      size: 140,
    }),
    columnHelper.accessor('result', {
      header: 'Result',
      cell: (info) => (
        <span className={`text-sm font-medium capitalize ${getResultColor(info.getValue())}`}>
          {info.getValue()}
        </span>
      ),
      size: 100,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedLog(info.row.original)}
        >
          View Details
        </Button>
      ),
      size: 140,
    }),
  ]

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Audit Logs</h1>
            <p className="text-muted-foreground mt-2">
              Monitor system activities and user actions
            </p>
          </div>
          <Button onClick={handleExportLogs}>
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, target, or log ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {(selectedAction !== 'all' || selectedUser !== '') && (
                <span className="ml-2 inline-flex items-center justify-center bg-primary text-primary-foreground text-xs rounded-full w-5 h-5">
                  {(selectedAction !== 'all' ? 1 : 0) + (selectedUser !== '' ? 1 : 0)}
                </span>
              )}
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Action Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Action
                  </label>
                  <select
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="w-full h-10 px-4 rounded-md border border-input bg-background text-sm"
                  >
                    {ACTION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* User Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    User
                  </label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full h-10 px-4 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">All Users</option>
                    {uniqueUsers.map((user) => (
                      <option key={user} value={user}>
                        {user}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range - Note: Simplified for this implementation */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Date Range
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Start date"
                  />
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex gap-2 justify-end pt-2 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedAction('all')
                    setSelectedUser('')
                    setStartDate('')
                    setEndDate('')
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredLogs.length} of {MOCK_AUDIT_LOGS.length} logs
        </div>

        {/* Table */}
        <Table<AuditLog>
          data={filteredLogs}
          columns={columns}
          pageSize={10}
        />
      </div>

      {/* Details Modal */}
      <Modal
        open={selectedLog !== null}
        onOpenChange={(open) => !open && setSelectedLog(null)}
        className="max-w-2xl"
      >
        <ModalHeader>
          <ModalTitle>Audit Log Details</ModalTitle>
          <ModalClose onClose={() => setSelectedLog(null)} />
        </ModalHeader>
        {selectedLog && (
          <>
            <ModalBody>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                      Timestamp
                    </p>
                    <p className="text-sm font-medium">
                      {formatTimestamp(selectedLog.timestamp)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                      User
                    </p>
                    <p className="text-sm font-medium">{selectedLog.user}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                      Action
                    </p>
                    <p className="text-sm font-medium">
                      {getActionLabel(selectedLog.action)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                      Target
                    </p>
                    <p className="text-sm font-medium">{selectedLog.target}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                      Result
                    </p>
                    <p className={`text-sm font-medium capitalize ${getResultColor(selectedLog.result)}`}>
                      {selectedLog.result}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                      IP Address
                    </p>
                    <p className="text-sm font-medium">{selectedLog.ipAddress}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                    User Agent
                  </p>
                  <p className="text-sm font-mono text-muted-foreground break-all">
                    {selectedLog.userAgent}
                  </p>
                </div>

                {selectedLog.details && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                      Details
                    </p>
                    <p className="text-sm">{selectedLog.details}</p>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={() => setSelectedLog(null)}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    </PageLayout>
  )
}
