import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Inbox, AlertCircle, Clock, Bell, FileCheck } from 'lucide-react'
import type { PendingApprovalItem } from '@/types/approvals-e-signatures'

export interface ApprovalsInboxProps {
  items: PendingApprovalItem[]
  isLoading?: boolean
  onReview: (item: PendingApprovalItem) => void
  emptyMessage?: string
}

function formatDue(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    const now = new Date()
    const diff = d.getTime() - now.getTime()
    const days = Math.ceil(diff / (24 * 60 * 60 * 1000))
    if (days < 0) return 'Overdue'
    if (days === 0) return 'Due today'
    if (days === 1) return 'Due tomorrow'
    return `Due in ${days} days`
  } catch {
    return dateStr
  }
}

function StatusBadge({ status }: { status: PendingApprovalItem['status'] }) {
  const config = {
    pending: { label: 'Pending', className: 'bg-muted text-muted-foreground', icon: Clock },
    reminder: { label: 'Reminder', className: 'bg-warning/20 text-warning', icon: Bell },
    overdue: { label: 'Overdue', className: 'bg-destructive/20 text-destructive', icon: AlertCircle },
    signed: { label: 'Signed', className: 'bg-success/20 text-success', icon: FileCheck },
  }
  const { label, className, icon: Icon } = config[status] ?? config.pending
  return (
    <Badge variant="secondary" className={cn('gap-1 font-normal', className)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}

export function ApprovalsInbox({
  items,
  isLoading,
  onReview,
  emptyMessage = 'No pending approvals. Items requiring your signature or approval will appear here.',
}: ApprovalsInboxProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border transition-all duration-300">
        <CardHeader>
          <Skeleton className="h-6 w-40 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded-lg" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (items.length === 0) {
    return (
      <Card className="overflow-hidden border-border transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Inbox className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Approvals inbox</CardTitle>
              <CardDescription>Pending items, reminders, and overdue alerts</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-12 px-6 text-center">
            <Inbox className="h-12 w-12 text-muted-foreground/60" aria-hidden />
            <p className="mt-4 text-sm font-medium text-foreground">No pending approvals</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const overdueCount = items.filter((i) => i.status === 'overdue').length
  const reminderCount = items.filter((i) => i.status === 'reminder').length

  return (
    <Card className="overflow-hidden border-border transition-all duration-300 hover:shadow-card-hover">
      <CardHeader className="border-b border-border/50 bg-muted/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Inbox className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Approvals inbox</CardTitle>
              <CardDescription>Pending items, reminders, and overdue alerts</CardDescription>
            </div>
          </div>
          {(overdueCount > 0 || reminderCount > 0) && (
            <div className="flex gap-2">
              {overdueCount > 0 && (
                <Badge variant="secondary" className="bg-destructive/20 text-destructive">
                  {overdueCount} overdue
                </Badge>
              )}
              {reminderCount > 0 && (
                <Badge variant="secondary" className="bg-warning/20 text-warning">
                  {reminderCount} reminder{reminderCount > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li
              key={item.id}
              className={cn(
                'flex flex-wrap items-center justify-between gap-4 px-6 py-4 transition-colors',
                'hover:bg-muted/50',
                item.status === 'overdue' && 'bg-destructive/5'
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{item.title}</p>
                {item.description && (
                  <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{item.description}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{item.signer_email}</span>
                  <span aria-hidden>·</span>
                  <span>{formatDue(item.due_at)}</span>
                  <StatusBadge status={item.status} />
                </div>
              </div>
              {item.status !== 'signed' && (
                <Button
                  size="sm"
                  onClick={() => onReview(item)}
                  className="shrink-0 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Review & sign
                </Button>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
