import type {
  PerformanceCachingBackup,
  PerformanceCachingBackupCreateInput,
  PerformanceCachingBackupStatus,
} from '@/types/performance-caching-backup'

const VALID_STATUSES: PerformanceCachingBackupStatus[] = [
  'active',
  'paused',
  'archived',
]

/**
 * Validates and normalizes status for create/update.
 * Defaults to 'active' if invalid or missing.
 */
export function normalizeStatus(status: string | undefined): PerformanceCachingBackupStatus {
  if (status && VALID_STATUSES.includes(status as PerformanceCachingBackupStatus)) {
    return status as PerformanceCachingBackupStatus
  }
  return 'active'
}

/**
 * Prepares create payload with validated status.
 */
export function prepareCreatePayload(
  input: PerformanceCachingBackupCreateInput
): { title: string; description?: string; status: string } {
  return {
    title: input.title.trim(),
    description: input.description?.trim() || undefined,
    status: normalizeStatus(input.status),
  }
}

/**
 * Human-readable status label for display.
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Active',
    paused: 'Paused',
    archived: 'Archived',
  }
  return labels[status] ?? status
}

/**
 * Format relative time for created_at / updated_at.
 */
export function formatRelativeTime(iso: string): string {
  try {
    const date = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  } catch {
    return iso
  }
}

/**
 * Sort records by updated_at descending (newest first).
 */
export function sortByUpdatedDesc(
  items: PerformanceCachingBackup[]
): PerformanceCachingBackup[] {
  return [...items].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )
}
