import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar, Users, FileText, ChevronRight, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MeetingWithDetails, MeetingStatus } from '@/types/meetings-agendas'

const STATUS_LABELS: Record<MeetingStatus, string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  active: 'Active',
}

const STATUS_VARIANT: Record<MeetingStatus, 'secondary' | 'default' | 'success' | 'destructive'> = {
  draft: 'secondary',
  scheduled: 'default',
  completed: 'success',
  cancelled: 'destructive',
  active: 'default',
}

export interface MeetingListProps {
  meetings: MeetingWithDetails[]
  isLoading?: boolean
  onSelectMeeting?: (id: string) => void
  emptyMessage?: string
  className?: string
}

function formatDate(iso?: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function MeetingCard({
  meeting,
  onSelect,
}: {
  meeting: MeetingWithDetails
  onSelect?: (id: string) => void
}) {
  const attendeeCount = meeting.attendees?.length ?? 0
  const items = meeting.agenda_items ?? meeting.agenda_topics ?? []
  const linkedCount =
    (items.filter((a) => a.linked_decision_id || ((a as { linked_file_ids?: string[] }).linked_file_ids?.length ?? 0) > 0).length ?? 0) +
    (items.reduce((acc, a) => acc + ((a as { linked_file_ids?: string[] }).linked_file_ids?.length ?? 0), 0) ?? 0)

  return (
    <Card
      className={cn(
        'transition-all duration-200 hover:shadow-card-hover hover:border-primary/20',
        onSelect && 'cursor-pointer'
      )}
      onClick={onSelect ? () => onSelect(meeting.id) : undefined}
      role={onSelect ? 'button' : undefined}
      aria-label={onSelect ? `Open meeting: ${meeting.title}` : undefined}
    >
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-lg">{meeting.title}</CardTitle>
          <Badge variant={STATUS_VARIANT[meeting.status]} className="shrink-0">
            {STATUS_LABELS[meeting.status]}
          </Badge>
        </div>
        {meeting.description && (
          <CardDescription className="line-clamp-2">{meeting.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {meeting.scheduled_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" aria-hidden />
            <span>{formatDate(meeting.scheduled_at)}</span>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" aria-hidden />
            {attendeeCount} attendee{attendeeCount !== 1 ? 's' : ''}
          </span>
          {linkedCount > 0 && (
            <span className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" aria-hidden />
              {linkedCount} linked item{linkedCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {onSelect && (
          <div className="flex justify-end pt-2">
            <Button variant="ghost" size="sm" className="gap-1">
              Open <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function MeetingListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function MeetingList({
  meetings,
  isLoading,
  onSelectMeeting,
  emptyMessage = 'No meetings yet. Create one to get started.',
  className,
}: MeetingListProps) {
  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <MeetingListSkeleton />
      </div>
    )
  }

  if (!meetings.length) {
    return (
      <Card className={cn('animate-fade-in', className)}>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
          <p className="text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    )
  }

  const upcoming = meetings.filter(
    (m) =>
      (m.status === 'scheduled' || m.status === 'draft') &&
      (!m.scheduled_at || new Date(m.scheduled_at) >= new Date())
  )
  const past = meetings.filter(
    (m) =>
      m.status === 'completed' ||
      (m.scheduled_at && new Date(m.scheduled_at) < new Date())
  )

  return (
    <div className={cn('space-y-8 animate-fade-in', className)}>
      {upcoming.length > 0 && (
        <section aria-labelledby="upcoming-meetings-heading">
          <h2 id="upcoming-meetings-heading" className="text-lg font-semibold mb-4">
            Upcoming meetings
          </h2>
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {upcoming.map((m) => (
              <MeetingCard
                key={m.id}
                meeting={m}
                onSelect={onSelectMeeting}
              />
            ))}
          </div>
        </section>
      )}
      {past.length > 0 && (
        <section aria-labelledby="past-meetings-heading">
          <h2 id="past-meetings-heading" className="text-lg font-semibold mb-4">
            Past meetings
          </h2>
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {past.map((m) => (
              <MeetingCard
                key={m.id}
                meeting={m}
                onSelect={onSelectMeeting}
              />
            ))}
          </div>
        </section>
      )}
      {upcoming.length === 0 && past.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
            <p className="text-muted-foreground">{emptyMessage}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
