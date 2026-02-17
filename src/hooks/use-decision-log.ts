import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { DecisionListFilters, CreateDecisionInput, UpdateDecisionInput } from '@/types/decision-log'
import * as api from '@/api/decision-log'

const KEYS = {
  list: (f: DecisionListFilters) => ['decisions', f] as const,
  detail: (id: string) => ['decisions', id] as const,
}

export function useDecisions(filters: DecisionListFilters) {
  return useQuery({
    queryKey: KEYS.list(filters),
    queryFn: () => api.fetchDecisions(filters),
  })
}

export function useDecision(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: KEYS.detail(id ?? ''),
    queryFn: () => api.fetchDecision(id!),
    enabled: Boolean(id) && enabled,
  })
}

export function useCreateDecision() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateDecisionInput) => api.createDecision(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['decisions'] })
      toast.success('Decision created')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to create decision')
    },
  })
}

export function useUpdateDecision(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateDecisionInput) => api.updateDecision(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['decisions'] })
      qc.invalidateQueries({ queryKey: KEYS.detail(id) })
      toast.success('Decision updated')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to update decision')
    },
  })
}

export function useDeleteDecision() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteDecision(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['decisions'] })
      toast.success('Decision deleted')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to delete decision')
    },
  })
}

export function useApproveDecision(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (selectedOptionId: string) => api.approveDecision(id, selectedOptionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['decisions'] })
      qc.invalidateQueries({ queryKey: KEYS.detail(id) })
      toast.success('Decision approved')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to approve')
    },
  })
}

export function useRequestChangesDecision(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (comment: string) => api.requestChangesDecision(id, comment),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.detail(id) })
      toast.success('Changes requested')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to request changes')
    },
  })
}

export function useAddComment(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: string) => api.addComment(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.detail(id) })
      toast.success('Comment added')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to add comment')
    },
  })
}

export function useSignDecision(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload?: { signerName: string; signedAt: string }) =>
      api.signDecision(id, payload ? { signer_name: payload.signerName, signed_at: payload.signedAt } : undefined),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['decisions'] })
      qc.invalidateQueries({ queryKey: KEYS.detail(id) })
      toast.success('Decision signed')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to sign')
    },
  })
}

export function useBulkRemindApprovers() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => api.bulkRemindApprovers(ids),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['decisions'] })
      toast.success(`Reminder sent to ${data.sent} approver(s)`)
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to send reminders')
    },
  })
}

export function useBulkChangePhase() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, phase }: { ids: string[]; phase: string }) => api.bulkChangePhase(ids, phase),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['decisions'] })
      toast.success(`${data.updated} decision(s) updated`)
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to change phase')
    },
  })
}
