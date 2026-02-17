import { api } from '@/lib/api'
import type {
  DecisionLog,
  DecisionListFilters,
  CreateDecisionInput,
  UpdateDecisionInput,
} from '@/types/decision-log'

const BASE = '/decisions'

function buildQuery(filters: DecisionListFilters): string {
  const params = new URLSearchParams()
  if (filters.phase && filters.phase !== 'all') params.set('phase', filters.phase)
  if (filters.status && filters.status !== 'all') params.set('status', filters.status)
  if (filters.approver_id && filters.approver_id !== 'all') params.set('approver_id', filters.approver_id)
  if (filters.due_date_from) params.set('due_date_from', filters.due_date_from)
  if (filters.due_date_to) params.set('due_date_to', filters.due_date_to)
  if (filters.search?.trim()) params.set('q', filters.search.trim())
  const q = params.toString()
  return q ? `?${q}` : ''
}

export async function fetchDecisions(filters: DecisionListFilters): Promise<DecisionLog[]> {
  const query = buildQuery(filters)
  return api.get<DecisionLog[]>(`${BASE}${query}`)
}

export async function fetchDecision(id: string): Promise<DecisionLog> {
  return api.get<DecisionLog>(`${BASE}/${id}`)
}

export async function createDecision(data: CreateDecisionInput): Promise<DecisionLog> {
  return api.post<DecisionLog>(BASE, data)
}

export async function updateDecision(id: string, data: UpdateDecisionInput): Promise<DecisionLog> {
  return api.patch<DecisionLog>(`${BASE}/${id}`, data)
}

export async function deleteDecision(id: string): Promise<void> {
  return api.delete(`${BASE}/${id}`)
}

export async function approveDecision(id: string, selectedOptionId: string): Promise<DecisionLog> {
  return api.post<DecisionLog>(`${BASE}/${id}/approve`, { selected_option_id: selectedOptionId })
}

export async function requestChangesDecision(id: string, comment: string): Promise<DecisionLog> {
  return api.post<DecisionLog>(`${BASE}/${id}/request-changes`, { comment })
}

export async function addComment(id: string, body: string): Promise<{ id: string; created_at: string }> {
  return api.post<{ id: string; created_at: string }>(`${BASE}/${id}/comments`, { body })
}

export interface SignDecisionPayload {
  signer_name?: string
  signed_at?: string
}

export async function signDecision(id: string, payload?: SignDecisionPayload): Promise<DecisionLog> {
  return api.post<DecisionLog>(`${BASE}/${id}/sign`, payload ?? {})
}

export async function bulkRemindApprovers(ids: string[]): Promise<{ sent: number }> {
  return api.post<{ sent: number }>(`${BASE}/bulk/remind`, { decision_ids: ids })
}

export async function bulkExportHistory(ids: string[]): Promise<Blob> {
  const API_BASE = import.meta.env.VITE_API_URL ?? '/api'
  const token = localStorage.getItem('access_token')
  const headers: HeadersInit = { Accept: 'application/pdf' }
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${BASE}/bulk/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ decision_ids: ids }),
  })
  if (!res.ok) throw new Error(res.statusText)
  return res.blob()
}

export async function bulkChangePhase(ids: string[], phase: string): Promise<{ updated: number }> {
  return api.post<{ updated: number }>(`${BASE}/bulk/phase`, { decision_ids: ids, phase })
}
