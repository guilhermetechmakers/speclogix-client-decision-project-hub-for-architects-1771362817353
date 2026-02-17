import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  CreateTemplateInput,
  UpdateTemplateInput,
  ApplyTemplateInput,
} from '@/types/templates-workflow-library'
import * as api from '@/api/templates-workflow-library'

const KEYS = {
  list: ['templates-workflow-library'] as const,
  detail: (id: string) => ['templates-workflow-library', id] as const,
}

export function useTemplates() {
  return useQuery({
    queryKey: KEYS.list,
    queryFn: api.fetchTemplates,
  })
}

export function useTemplate(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: KEYS.detail(id ?? ''),
    queryFn: () => api.fetchTemplate(id!),
    enabled: Boolean(id) && enabled,
  })
}

export function useCreateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTemplateInput) => api.createTemplate(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.list })
      toast.success('Template created')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to create template')
    },
  })
}

export function useUpdateTemplate(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateTemplateInput) => api.updateTemplate(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.list })
      qc.invalidateQueries({ queryKey: KEYS.detail(id) })
      toast.success('Template updated')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to update template')
    },
  })
}

export function useDeleteTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteTemplate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.list })
      toast.success('Template deleted')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to delete template')
    },
  })
}

export function useDuplicateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.duplicateTemplate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.list })
      toast.success('Template duplicated')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to duplicate template')
    },
  })
}

export function useApplyTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: ApplyTemplateInput) => api.applyTemplate(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.list })
      qc.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project created from template')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to apply template')
    },
  })
}

export function useShareTemplate(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { firm_id?: string; user_ids?: string[] }) =>
      api.shareTemplate(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.detail(id) })
      toast.success('Template shared')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to share template')
    },
  })
}
