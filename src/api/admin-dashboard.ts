import { api } from '@/lib/api'
import type {
  AdminDashboard,
  AdminUser,
  SeatUsage,
  InvitePayload,
  Subscription,
  Invoice,
  BillingPlan,
  SecuritySettings,
  GlobalTemplate,
  ArchivedProject,
  AuditLogEntry,
} from '@/types/admin-dashboard'

const BASE = '/admin-dashboard'

export async function fetchAdminDashboardList(): Promise<AdminDashboard[]> {
  try {
    return await api.get<AdminDashboard[]>(BASE)
  } catch {
    return []
  }
}

/** User management */
export async function fetchAdminUsers(): Promise<AdminUser[]> {
  try {
    return await api.get<AdminUser[]>(`${BASE}/users`)
  } catch {
    return []
  }
}

export async function fetchSeatUsage(): Promise<SeatUsage> {
  try {
    return await api.get<SeatUsage>(`${BASE}/seats`)
  } catch {
    return { used: 0, total: 0, available: 0 }
  }
}

export async function inviteUser(payload: InvitePayload): Promise<AdminUser> {
  return api.post<AdminUser>(`${BASE}/users/invite`, payload)
}

export async function updateUserRole(
  userId: string,
  role: AdminUser['role']
): Promise<AdminUser> {
  return api.patch<AdminUser>(`${BASE}/users/${userId}/role`, { role })
}

export async function deactivateUser(userId: string): Promise<void> {
  return api.post<void>(`${BASE}/users/${userId}/deactivate`, {})
}

/** Billing & subscription */
export async function fetchSubscription(): Promise<Subscription | null> {
  try {
    return await api.get<Subscription | null>(`${BASE}/billing/subscription`)
  } catch {
    return null
  }
}

export async function fetchPlans(): Promise<BillingPlan[]> {
  try {
    return await api.get<BillingPlan[]>(`${BASE}/billing/plans`)
  } catch {
    return []
  }
}

export async function fetchInvoices(): Promise<Invoice[]> {
  try {
    return await api.get<Invoice[]>(`${BASE}/billing/invoices`)
  } catch {
    return []
  }
}

export async function changePlan(planId: string): Promise<Subscription> {
  return api.post<Subscription>(`${BASE}/billing/change-plan`, { plan_id: planId })
}

/** Security settings */
export async function fetchSecuritySettings(): Promise<SecuritySettings> {
  try {
    return await api.get<SecuritySettings>(`${BASE}/security`)
  } catch {
    return {
      sso_enabled: false,
      password_min_length: 8,
      password_require_special: true,
      two_fa_required: false,
      two_fa_enforced_for_admins: false,
    }
  }
}

export async function updateSecuritySettings(
  data: Partial<SecuritySettings>
): Promise<SecuritySettings> {
  return api.patch<SecuritySettings>(`${BASE}/security`, data)
}

/** Templates & projects */
export async function fetchGlobalTemplates(): Promise<GlobalTemplate[]> {
  try {
    return await api.get<GlobalTemplate[]>(`${BASE}/templates`)
  } catch {
    return []
  }
}

export async function fetchArchivedProjects(): Promise<ArchivedProject[]> {
  try {
    return await api.get<ArchivedProject[]>(`${BASE}/archived-projects`)
  } catch {
    return []
  }
}

/** Audit logs */
export async function fetchAuditLogs(params?: {
  event_type?: string
  from?: string
  to?: string
  limit?: number
}): Promise<AuditLogEntry[]> {
  try {
    const q = new URLSearchParams()
    if (params?.event_type) q.set('event_type', params.event_type)
    if (params?.from) q.set('from', params.from)
    if (params?.to) q.set('to', params.to)
    if (params?.limit) q.set('limit', String(params.limit))
    const query = q.toString()
    return await api.get<AuditLogEntry[]>(
      `${BASE}/audit${query ? `?${query}` : ''}`
    )
  } catch {
    return []
  }
}

export async function exportAuditLog(params: {
  format: 'csv' | 'json'
  from?: string
  to?: string
}): Promise<Blob> {
  const q = new URLSearchParams({ format: params.format })
  if (params.from) q.set('from', params.from)
  if (params.to) q.set('to', params.to)
  const API_BASE = import.meta.env.VITE_API_URL ?? '/api'
  const token = localStorage.getItem('access_token')
  const headers: HeadersInit = {}
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${BASE}/audit/export?${q.toString()}`, {
    headers,
  })
  if (!res.ok) throw new Error('Export failed')
  return res.blob()
}
