/** Performance, Caching & Backup – policies and configuration records */

export interface PerformanceCachingBackup {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export type PerformanceCachingBackupStatus = 'active' | 'paused' | 'archived'

export interface PerformanceCachingBackupCreateInput {
  title: string
  description?: string
  status?: string
}

export interface PerformanceCachingBackupUpdateInput {
  title?: string
  description?: string
  status?: string
}

/** Overview stats for CDN, cache, backups, monitoring (optional from API) */
export interface PerformanceCachingBackupStats {
  cdnHitRate?: number
  cacheHitRate?: number
  lastBackupAt?: string
  backupRetentionDays?: number
  monitoringStatus?: 'healthy' | 'degraded' | 'critical'
}
