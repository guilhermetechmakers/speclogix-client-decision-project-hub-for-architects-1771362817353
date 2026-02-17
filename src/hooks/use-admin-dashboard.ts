import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as api from '@/api/admin-dashboard'
import type { InvitePayload, SecuritySettings, UserRole } from '@/types/admin-dashboard'

const KEYS = {
  list: () => ['admin-dashboard', 'list'] as const,
  users: () => ['admin-dashboard', 'users'] as const,
  seats: () => ['admin-dashboard', 'seats'] as const,
  subscription: () => ['admin-dashboard', 'subscription'] as const,
  plans: () => ['admin-dashboard', 'plans'] as const,
  invoices: () => ['admin-dashboard', 'invoices'] as const,
  security: () => ['admin-dashboard', 'security'] as const,
  templates: () => ['admin-dashboard', 'templates'] as const,
  archived: () => ['admin-dashboard', 'archived'] as const,
  audit: (params?: Record<string, unknown>) =>
    ['admin-dashboard', 'audit', params ?? {}] as const,
}

export function useAdminDashboardList() {
  return useQuery({
    queryKey: KEYS.list(),
    queryFn: api.fetchAdminDashboardList,
  })
}

export function useAdminUsers() {
  return useQuery({
    queryKey: KEYS.users(),
    queryFn: api.fetchAdminUsers,
  })
}

export function useSeatUsage() {
  return useQuery({
    queryKey: KEYS.seats(),
    queryFn: api.fetchSeatUsage,
  })
}

export function useInviteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: InvitePayload) => api.inviteUser(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.users() })
      qc.invalidateQueries({ queryKey: KEYS.seats() })
      toast.success('Invitation sent')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to send invitation')
    },
  })
}

export function useUpdateUserRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      api.updateUserRole(userId, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.users() })
      toast.success('Role updated')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to update role')
    },
  })
}

export function useDeactivateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => api.deactivateUser(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.users() })
      qc.invalidateQueries({ queryKey: KEYS.seats() })
      toast.success('User deactivated')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to deactivate user')
    },
  })
}

export function useSubscription() {
  return useQuery({
    queryKey: KEYS.subscription(),
    queryFn: api.fetchSubscription,
  })
}

export function usePlans() {
  return useQuery({
    queryKey: KEYS.plans(),
    queryFn: api.fetchPlans,
  })
}

export function useInvoices() {
  return useQuery({
    queryKey: KEYS.invoices(),
    queryFn: api.fetchInvoices,
  })
}

export function useChangePlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (planId: string) => api.changePlan(planId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.subscription() })
      toast.success('Plan updated')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to change plan')
    },
  })
}

export function useSecuritySettings() {
  return useQuery({
    queryKey: KEYS.security(),
    queryFn: api.fetchSecuritySettings,
  })
}

export function useUpdateSecuritySettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<SecuritySettings>) =>
      api.updateSecuritySettings(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.security() })
      toast.success('Security settings saved')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to save settings')
    },
  })
}

export function useGlobalTemplates() {
  return useQuery({
    queryKey: KEYS.templates(),
    queryFn: api.fetchGlobalTemplates,
  })
}

export function useArchivedProjects() {
  return useQuery({
    queryKey: KEYS.archived(),
    queryFn: api.fetchArchivedProjects,
  })
}

export function useAuditLogs(params?: {
  event_type?: string
  from?: string
  to?: string
  limit?: number
}) {
  return useQuery({
    queryKey: KEYS.audit(params),
    queryFn: () => api.fetchAuditLogs(params),
  })
}
