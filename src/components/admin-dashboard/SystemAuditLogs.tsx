import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { FileText, FileDown, Loader2, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AuditEventType } from '@/types/admin-dashboard'
import { useAuditLogs } from '@/hooks/use-admin-dashboard'

const EVENT_LABELS: Record<AuditEventType, string> = {
  login: 'Login',
  logout: 'Logout',
  user_invited: 'User invited',
  user_deactivated: 'User deactivated',
  role_changed: 'Role changed',
  approval_created: 'Approval created',
  approval_signed: 'Approval signed',
  settings_changed: 'Settings changed',
  export: 'Export',
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export interface SystemAuditLogsProps {
  className?: string
}

export function SystemAuditLogs({ className }: SystemAuditLogsProps) {
  const [eventFilter, setEventFilter] = useState<string>('all')
  const { data: logs = [], isLoading, isError } = useAuditLogs({
    event_type: eventFilter === 'all' ? undefined : eventFilter,
    limit: 100,
  })
  const [exporting, setExporting] = useState<'csv' | 'json' | null>(null)

  const handleExport = async (format: 'csv' | 'json') => {
    setExporting(format)
    try {
      const { exportAuditLog } = await import('@/api/admin-dashboard')
      const blob = await exportAuditLog({ format })
      downloadBlob(blob, `audit-log.${format}`)
    } catch {
      // toast handled by caller or show inline
    } finally {
      setExporting(null)
    }
  }

  if (isError) {
    return (
      <Card className={cn('animate-fade-in border-destructive/30', className)}>
        <CardContent className="py-8 text-center text-sm text-destructive">
          Failed to load audit logs. Please try again.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-6 animate-fade-in', className)}>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" aria-hidden />
                Security events & approvals
              </CardTitle>
              <CardDescription>
                View security events, approvals, and export for compliance
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All events</SelectItem>
                  {(Object.keys(EVENT_LABELS) as AuditEventType[]).map(
                    (type) => (
                      <SelectItem key={type} value={type}>
                        {EVENT_LABELS[type]}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => handleExport('csv')}
                disabled={!!exporting}
              >
                {exporting === 'csv' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="h-4 w-4" />
                )}
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => handleExport('json')}
                disabled={!!exporting}
              >
                {exporting === 'json' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                Export JSON
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
              <p className="text-muted-foreground font-medium">No audit events</p>
              <p className="text-sm text-muted-foreground mt-1">
                Security events and approvals will appear here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
              <table className="w-full text-sm" role="table">
                <thead className="sticky top-0 bg-muted/95 border-b border-border z-10">
                  <tr>
                    <th className="text-left font-medium p-3">Time</th>
                    <th className="text-left font-medium p-3">Event</th>
                    <th className="text-left font-medium p-3 hidden sm:table-cell">Actor</th>
                    <th className="text-left font-medium p-3 hidden md:table-cell">Target</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-border hover:bg-accent/50 transition-colors"
                    >
                      <td className="p-3 text-muted-foreground whitespace-nowrap">
                        {formatDateTime(entry.created_at)}
                      </td>
                      <td className="p-3 font-medium">
                        {EVENT_LABELS[entry.event_type] ?? entry.event_type}
                      </td>
                      <td className="p-3 text-muted-foreground hidden sm:table-cell">
                        {entry.actor_email ?? '—'}
                      </td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">
                        {entry.target_type && entry.target_id
                          ? `${entry.target_type} ${entry.target_id.slice(0, 8)}`
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
