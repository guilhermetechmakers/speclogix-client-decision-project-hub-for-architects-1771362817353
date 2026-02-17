import { api } from '@/lib/api'
import type {
  PerformanceCachingBackup,
  PerformanceCachingBackupStats,
} from '@/types/performance-caching-backup'

const BASE = '/performance-caching-backup'

export async function fetchPerformanceCachingBackupList(): Promise<
  PerformanceCachingBackup[]
> {
  try {
    return await api.get<PerformanceCachingBackup[]>(BASE)
  } catch {
    return []
  }
}

export async function fetchPerformanceCachingBackupById(
  id: string
): Promise<PerformanceCachingBackup | null> {
  try {
    return await api.get<PerformanceCachingBackup>(`${BASE}/${id}`)
  } catch {
    return null
  }
}

export async function createPerformanceCachingBackup(data: {
  title: string
  description?: string
  status?: string
}): Promise<PerformanceCachingBackup> {
  return api.post<PerformanceCachingBackup>(BASE, data)
}

export async function updatePerformanceCachingBackup(
  id: string,
  data: { title?: string; description?: string; status?: string }
): Promise<PerformanceCachingBackup> {
  return api.patch<PerformanceCachingBackup>(`${BASE}/${id}`, data)
}

export async function deletePerformanceCachingBackup(id: string): Promise<void> {
  return api.delete(`${BASE}/${id}`)
}

/** Overview stats for CDN, cache, backups, monitoring */
export async function fetchPerformanceCachingBackupStats(): Promise<PerformanceCachingBackupStats> {
  try {
    return await api.get<PerformanceCachingBackupStats>(`${BASE}/stats`)
  } catch {
    return {}
  }
}
