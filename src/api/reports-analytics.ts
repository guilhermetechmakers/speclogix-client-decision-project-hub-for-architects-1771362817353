import { api } from '@/lib/api'
import type {
  ReportsAnalyticsRecord,
  ReportDashboardStats,
  AlertingRule,
  ScheduledReportConfig,
} from '@/types/reports-analytics'

const BASE = '/reports-analytics'

/** Dashboard stats – pre-built widgets data */
export async function fetchReportDashboardStats(): Promise<ReportDashboardStats> {
  try {
    return await api.get<ReportDashboardStats>(`${BASE}/dashboard/stats`)
  } catch {
    return {
      pendingApprovals: 0,
      approvalTurnaroundDays: 0,
      overdueTasks: 0,
      turnaroundTrend: [],
    }
  }
}

/** List saved reports (reports_&_analytics table) */
export async function fetchReportsList(): Promise<ReportsAnalyticsRecord[]> {
  try {
    return await api.get<ReportsAnalyticsRecord[]>(BASE)
  } catch {
    return []
  }
}

export async function createReport(data: {
  title: string
  description?: string
}): Promise<ReportsAnalyticsRecord> {
  return api.post<ReportsAnalyticsRecord>(BASE, data)
}

export async function updateReport(
  id: string,
  data: { title?: string; description?: string; status?: string }
): Promise<ReportsAnalyticsRecord> {
  return api.patch<ReportsAnalyticsRecord>(`${BASE}/${id}`, data)
}

export async function deleteReport(id: string): Promise<void> {
  return api.delete(`${BASE}/${id}`)
}

/** Alerting rules */
export async function fetchAlertingRules(): Promise<AlertingRule[]> {
  try {
    return await api.get<AlertingRule[]>(`${BASE}/alerting-rules`)
  } catch {
    return []
  }
}

export async function saveAlertingRule(
  data: Omit<AlertingRule, 'id' | 'created_at'>
): Promise<AlertingRule> {
  return api.post<AlertingRule>(`${BASE}/alerting-rules`, data)
}

export async function updateAlertingRule(
  id: string,
  data: Partial<Omit<AlertingRule, 'id'>>
): Promise<AlertingRule> {
  return api.patch<AlertingRule>(`${BASE}/alerting-rules/${id}`, data)
}

export async function deleteAlertingRule(id: string): Promise<void> {
  return api.delete(`${BASE}/alerting-rules/${id}`)
}

/** Scheduled reports */
export async function fetchScheduledReports(): Promise<ScheduledReportConfig[]> {
  try {
    return await api.get<ScheduledReportConfig[]>(`${BASE}/scheduled`)
  } catch {
    return []
  }
}

export async function createScheduledReport(
  data: Omit<ScheduledReportConfig, 'id' | 'lastSentAt'>
): Promise<ScheduledReportConfig> {
  return api.post<ScheduledReportConfig>(`${BASE}/scheduled`, data)
}

export async function deleteScheduledReport(id: string): Promise<void> {
  return api.delete(`${BASE}/scheduled/${id}`)
}

/** Export CSV/PDF – returns blob URL or download */
export async function exportReportCsv(params: {
  metrics: string[]
  dateFrom?: string
  dateTo?: string
  projectId?: string
}): Promise<Blob> {
  const q = new URLSearchParams()
  params.metrics.forEach((m) => q.append('metrics', m))
  if (params.dateFrom) q.set('dateFrom', params.dateFrom)
  if (params.dateTo) q.set('dateTo', params.dateTo)
  if (params.projectId) q.set('projectId', params.projectId)
  const API_BASE = import.meta.env.VITE_API_URL ?? '/api'
  const token = localStorage.getItem('access_token')
  const headers: HeadersInit = {}
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${BASE}/export/csv?${q.toString()}`, { headers })
  if (!res.ok) throw new Error('Export failed')
  return res.blob()
}

export async function exportReportPdf(params: {
  metrics: string[]
  dateFrom?: string
  dateTo?: string
  projectId?: string
}): Promise<Blob> {
  const q = new URLSearchParams()
  params.metrics.forEach((m) => q.append('metrics', m))
  if (params.dateFrom) q.set('dateFrom', params.dateFrom)
  if (params.dateTo) q.set('dateTo', params.dateTo)
  if (params.projectId) q.set('projectId', params.projectId)
  const API_BASE = import.meta.env.VITE_API_URL ?? '/api'
  const token = localStorage.getItem('access_token')
  const headers: HeadersInit = {}
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${BASE}/export/pdf?${q.toString()}`, { headers })
  if (!res.ok) throw new Error('Export failed')
  return res.blob()
}
