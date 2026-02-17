import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as api from '@/api/reports-analytics'
import type { AlertingRule, ScheduledReportConfig } from '@/types/reports-analytics'

const KEYS = {
  dashboardStats: () => ['reports-analytics', 'dashboard', 'stats'] as const,
  reportsList: () => ['reports-analytics', 'list'] as const,
  alertingRules: () => ['reports-analytics', 'alerting-rules'] as const,
  scheduled: () => ['reports-analytics', 'scheduled'] as const,
}

export function useReportDashboardStats() {
  return useQuery({
    queryKey: KEYS.dashboardStats(),
    queryFn: api.fetchReportDashboardStats,
  })
}

export function useReportsList() {
  return useQuery({
    queryKey: KEYS.reportsList(),
    queryFn: api.fetchReportsList,
  })
}

export function useCreateReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { title: string; description?: string }) => api.createReport(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.reportsList() })
      toast.success('Report saved')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to save report')
    },
  })
}

export function useAlertingRules() {
  return useQuery({
    queryKey: KEYS.alertingRules(),
    queryFn: api.fetchAlertingRules,
  })
}

export function useSaveAlertingRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<AlertingRule, 'id' | 'created_at'>) => api.saveAlertingRule(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.alertingRules() })
      toast.success('Alert rule saved')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to save alert rule')
    },
  })
}

export function useUpdateAlertingRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<AlertingRule, 'id'>> }) =>
      api.updateAlertingRule(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.alertingRules() })
      toast.success('Alert rule updated')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to update alert rule')
    },
  })
}

export function useDeleteAlertingRule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteAlertingRule(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.alertingRules() })
      toast.success('Alert rule removed')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to remove alert rule')
    },
  })
}

export function useScheduledReports() {
  return useQuery({
    queryKey: KEYS.scheduled(),
    queryFn: api.fetchScheduledReports,
  })
}

export function useCreateScheduledReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<ScheduledReportConfig, 'id' | 'lastSentAt'>) =>
      api.createScheduledReport(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.scheduled() })
      toast.success('Scheduled report created')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to create scheduled report')
    },
  })
}

export function useDeleteScheduledReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteScheduledReport(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.scheduled() })
      toast.success('Scheduled report removed')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to remove scheduled report')
    },
  })
}
