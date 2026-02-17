/** Reports & Analytics – project health reporting, custom builder, export, alerting */

export interface ReportsAnalyticsRecord {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface ReportDashboardStats {
  pendingApprovals: number
  approvalTurnaroundDays: number
  overdueTasks: number
  turnaroundTrend?: { date: string; avgDays: number }[]
}

export type ReportMetricId =
  | 'pending_approvals'
  | 'approval_turnaround'
  | 'overdue_tasks'
  | 'rfi_count'
  | 'change_requests'
  | 'workload'

export interface ReportMetricOption {
  id: ReportMetricId
  label: string
  description?: string
}

export interface CustomReportFilters {
  projectId?: string
  status?: string
  dateFrom?: string
  dateTo?: string
}

export interface CustomReportConfig {
  metrics: ReportMetricId[]
  filters: CustomReportFilters
}

export type AlertChannel = 'email' | 'in_app'

export interface AlertingRule {
  id: string
  name: string
  metric: ReportMetricId
  operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq'
  threshold: number
  channels: AlertChannel[]
  enabled: boolean
  created_at?: string
}

export interface ScheduledReportConfig {
  id: string
  title: string
  frequency: 'daily' | 'weekly' | 'monthly'
  recipients: string[]
  format: 'csv' | 'pdf'
  lastSentAt?: string
}
