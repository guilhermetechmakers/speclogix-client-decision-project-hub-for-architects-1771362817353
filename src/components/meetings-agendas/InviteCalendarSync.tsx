import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Mail, Calendar, Download, UserPlus, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MeetingWithDetails, MeetingAttendee, CreateAttendeeInput } from '@/types/meetings-agendas'
import { buildIcsBlob } from '@/api/meetings-agendas'

export interface InviteCalendarSyncProps {
  meeting: MeetingWithDetails | null
  attendees: MeetingAttendee[]
  isLoading?: boolean
  onInvite?: (data: CreateAttendeeInput) => void
  onRemoveAttendee?: (attendeeId: string) => void
  className?: string
}

function downloadIcs(meeting: MeetingWithDetails) {
  const blob = buildIcsBlob(meeting)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `meeting-${meeting.id}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

export function InviteCalendarSync({
  meeting,
  attendees,
  isLoading,
  onInvite,
  onRemoveAttendee,
  className,
}: InviteCalendarSyncProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  const handleInvite = () => {
    const trimmed = email.trim()
    if (!trimmed || !meeting || !onInvite) return
    onInvite({
      meeting_id: meeting.id,
      email: trimmed,
      name: name.trim() || undefined,
    })
    setEmail('')
    setName('')
  }

  if (isLoading) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!meeting) {
    return (
      <Card className={cn(className)}>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
          <p className="text-muted-foreground">Select a meeting to invite participants and export to calendar.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('animate-fade-in', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" aria-hidden />
          Invite & calendar
        </CardTitle>
        <CardDescription>
          Invite participants and export to calendar (ICS). Optional calendar integration.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="ics-export" className="sr-only">
            Export to calendar
          </Label>
          <Button
            id="ics-export"
            variant="outline"
            className="w-full sm:w-auto gap-2 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => downloadIcs(meeting)}
          >
            <Download className="h-4 w-4" aria-hidden />
            Export ICS
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Add to Outlook, Google Calendar, or Apple Calendar.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" aria-hidden />
            Participants
          </h4>
          <ul className="space-y-2">
            {attendees.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="truncate">{a.name || a.email}</span>
                  {a.name && (
                    <span className="text-muted-foreground truncate">({a.email})</span>
                  )}
                </div>
                {onRemoveAttendee && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemoveAttendee(a.id)}
                    aria-label={`Remove ${a.email}`}
                  >
                    Remove
                  </Button>
                )}
              </li>
            ))}
          </ul>

          {onInvite && (
            <div className="flex flex-wrap gap-2 pt-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 min-w-[180px]"
                aria-label="Participant email"
              />
              <Input
                type="text"
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 min-w-[140px]"
                aria-label="Participant name"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleInvite}
                disabled={!email.trim()}
                className="gap-1 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <UserPlus className="h-4 w-4" />
                Invite
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
