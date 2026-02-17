import { api } from '@/lib/api'
import type {
  ApprovalsESignaturesRecord,
  ApprovalWorkflowConfig,
  CreateApprovalInput,
  UpdateApprovalInput,
  CreateApprovalWorkflowInput,
  PendingApprovalItem,
  SignedDocumentItem,
  SignatureCapture,
  ApprovalsListFilters,
} from '@/types/approvals-e-signatures'

const BASE = '/approvals-e-signatures'

function buildQuery(filters: ApprovalsListFilters): string {
  const params = new URLSearchParams()
  if (filters.status && filters.status !== 'all') params.set('status', filters.status)
  if (filters.search?.trim()) params.set('q', filters.search.trim())
  const q = params.toString()
  return q ? `?${q}` : ''
}

export async function fetchApprovals(
  filters: ApprovalsListFilters = {}
): Promise<ApprovalsESignaturesRecord[]> {
  return api.get<ApprovalsESignaturesRecord[]>(`${BASE}${buildQuery(filters)}`)
}

export async function fetchApproval(id: string): Promise<ApprovalsESignaturesRecord> {
  return api.get<ApprovalsESignaturesRecord>(`${BASE}/${id}`)
}

export async function createApproval(data: CreateApprovalInput): Promise<ApprovalsESignaturesRecord> {
  return api.post<ApprovalsESignaturesRecord>(BASE, data)
}

export async function updateApproval(
  id: string,
  data: UpdateApprovalInput
): Promise<ApprovalsESignaturesRecord> {
  return api.patch<ApprovalsESignaturesRecord>(`${BASE}/${id}`, data)
}

export async function deleteApproval(id: string): Promise<void> {
  return api.delete(`${BASE}/${id}`)
}

export async function fetchWorkflow(approvalId: string): Promise<ApprovalWorkflowConfig | null> {
  try {
    return await api.get<ApprovalWorkflowConfig>(`${BASE}/${approvalId}/workflow`)
  } catch {
    return null
  }
}

export async function saveWorkflow(
  data: CreateApprovalWorkflowInput
): Promise<ApprovalWorkflowConfig> {
  return api.post<ApprovalWorkflowConfig>(`${BASE}/${data.approval_id}/workflow`, data)
}

export async function updateWorkflow(
  approvalId: string,
  data: Partial<CreateApprovalWorkflowInput>
): Promise<ApprovalWorkflowConfig> {
  return api.patch<ApprovalWorkflowConfig>(`${BASE}/${approvalId}/workflow`, data)
}

export async function fetchPendingItems(): Promise<PendingApprovalItem[]> {
  try {
    return await api.get<PendingApprovalItem[]>(`${BASE}/inbox/pending`)
  } catch {
    return []
  }
}

export async function submitSignature(
  approvalId: string,
  payload: SignatureCapture
): Promise<SignedDocumentItem> {
  return api.post<SignedDocumentItem>(`${BASE}/${approvalId}/sign`, payload)
}

export async function submitCheckboxApproval(approvalId: string): Promise<void> {
  return api.post(`${BASE}/${approvalId}/approve`, {})
}

export async function fetchSignedDocuments(): Promise<SignedDocumentItem[]> {
  try {
    return await api.get<SignedDocumentItem[]>(`${BASE}/signed`)
  } catch {
    return []
  }
}

export async function downloadSignedDocument(id: string): Promise<Blob> {
  const API_BASE = import.meta.env.VITE_API_URL ?? '/api'
  const token = localStorage.getItem('access_token')
  const headers: HeadersInit = { Accept: 'application/pdf' }
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${BASE}/signed/${id}/download`, { method: 'GET', headers })
  if (!res.ok) throw new Error(res.statusText)
  return res.blob()
}
