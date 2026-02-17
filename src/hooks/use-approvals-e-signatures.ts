import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  CreateApprovalInput,
  UpdateApprovalInput,
  CreateApprovalWorkflowInput,
  SignatureCapture,
  ApprovalsListFilters,
} from '@/types/approvals-e-signatures'
import * as api from '@/api/approvals-e-signatures'

const KEYS = {
  list: (f: ApprovalsListFilters) => ['approvals-e-signatures', f] as const,
  detail: (id: string) => ['approvals-e-signatures', id] as const,
  workflow: (approvalId: string) => ['approvals-e-signatures', approvalId, 'workflow'] as const,
  pending: () => ['approvals-e-signatures', 'inbox', 'pending'] as const,
  signed: () => ['approvals-e-signatures', 'signed'] as const,
}

export function useApprovalsList(filters: ApprovalsListFilters) {
  return useQuery({
    queryKey: KEYS.list(filters),
    queryFn: () => api.fetchApprovals(filters),
  })
}

export function useApproval(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: KEYS.detail(id ?? ''),
    queryFn: () => api.fetchApproval(id!),
    enabled: Boolean(id) && enabled,
  })
}

export function useCreateApproval() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateApprovalInput) => api.createApproval(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['approvals-e-signatures'] })
      toast.success('Approval created')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to create approval')
    },
  })
}

export function useUpdateApproval(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateApprovalInput) => api.updateApproval(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['approvals-e-signatures'] })
      qc.invalidateQueries({ queryKey: KEYS.detail(id) })
      toast.success('Approval updated')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to update approval')
    },
  })
}

export function useDeleteApproval() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteApproval(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['approvals-e-signatures'] })
      toast.success('Approval removed')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to remove approval')
    },
  })
}

export function useWorkflow(approvalId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: KEYS.workflow(approvalId ?? ''),
    queryFn: () => api.fetchWorkflow(approvalId!),
    enabled: Boolean(approvalId) && enabled,
  })
}

export function useSaveWorkflow() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateApprovalWorkflowInput) => api.saveWorkflow(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['approvals-e-signatures'] })
      qc.invalidateQueries({ queryKey: KEYS.workflow(variables.approval_id) })
      qc.invalidateQueries({ queryKey: KEYS.pending() })
      toast.success('Workflow saved')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to save workflow')
    },
  })
}

export function usePendingItems() {
  return useQuery({
    queryKey: KEYS.pending(),
    queryFn: () => api.fetchPendingItems(),
  })
}

export function useSignedDocuments() {
  return useQuery({
    queryKey: KEYS.signed(),
    queryFn: () => api.fetchSignedDocuments(),
  })
}

export function useSubmitSignature(approvalId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: SignatureCapture) => api.submitSignature(approvalId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['approvals-e-signatures'] })
      qc.invalidateQueries({ queryKey: KEYS.pending() })
      qc.invalidateQueries({ queryKey: KEYS.signed() })
      toast.success('Signature captured')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to submit signature')
    },
  })
}

export function useSubmitCheckboxApproval(approvalId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.submitCheckboxApproval(approvalId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['approvals-e-signatures'] })
      qc.invalidateQueries({ queryKey: KEYS.pending() })
      qc.invalidateQueries({ queryKey: KEYS.signed() })
      toast.success('Approval recorded')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to submit approval')
    },
  })
}
