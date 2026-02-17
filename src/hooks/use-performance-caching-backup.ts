import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import * as api from '@/api/performance-caching-backup'
import type { PerformanceCachingBackupCreateInput } from '@/types/performance-caching-backup'

const KEYS = {
  list: () => ['performance-caching-backup', 'list'] as const,
  detail: (id: string) => ['performance-caching-backup', 'detail', id] as const,
  stats: () => ['performance-caching-backup', 'stats'] as const,
}

export function usePerformanceCachingBackupList() {
  return useQuery({
    queryKey: KEYS.list(),
    queryFn: api.fetchPerformanceCachingBackupList,
  })
}

export function usePerformanceCachingBackupDetail(id: string | null) {
  return useQuery({
    queryKey: KEYS.detail(id ?? ''),
    queryFn: () => (id ? api.fetchPerformanceCachingBackupById(id) : Promise.resolve(null)),
    enabled: Boolean(id),
  })
}

export function usePerformanceCachingBackupStats() {
  return useQuery({
    queryKey: KEYS.stats(),
    queryFn: api.fetchPerformanceCachingBackupStats,
  })
}

export function useCreatePerformanceCachingBackup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: PerformanceCachingBackupCreateInput) =>
      api.createPerformanceCachingBackup(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.list() })
      qc.invalidateQueries({ queryKey: KEYS.stats() })
      toast.success('Policy created')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to create policy')
    },
  })
}

export function useUpdatePerformanceCachingBackup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: { title?: string; description?: string; status?: string }
    }) => api.updatePerformanceCachingBackup(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: KEYS.list() })
      qc.invalidateQueries({ queryKey: KEYS.detail(id) })
      qc.invalidateQueries({ queryKey: KEYS.stats() })
      toast.success('Policy updated')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to update policy')
    },
  })
}

export function useDeletePerformanceCachingBackup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deletePerformanceCachingBackup(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.list() })
      qc.invalidateQueries({ queryKey: KEYS.stats() })
      toast.success('Policy removed')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to remove policy')
    },
  })
}
