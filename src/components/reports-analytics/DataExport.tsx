import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { FileDown, CalendarClock, Trash2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ScheduledReportConfig } from '@/types/reports-analytics'
import {
  useScheduledReports,
  useCreateScheduledReport,
  useDeleteScheduledReport,
} from '@/hooks/use-reports-analytics'
import { toast } from 'sonner'

const FREQUENCY_OPTIONS: { value: ScheduledReportConfig['frequency']; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

export interface DataExportProps {
  onExportCsv?: () => void
  onExportPdf?: () => void
  className?: string
}

export function DataExport({
  onExportCsv,
  onExportPdf,
  className,
}: DataExportProps) {
  const { data: scheduled = [], isLoading, isError } = useScheduledReports()
  const createMutation = useCreateScheduledReport()
  const deleteMutation = useDeleteScheduledReport()
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [scheduleForm, setScheduleForm] = useState({
    title: '',
    frequency: 'weekly' as ScheduledReportConfig['frequency'],
    recipients: '',
    format: 'pdf' as 'csv' | 'pdf',
  })

  const handleCreateScheduled = (e: React.FormEvent) => {
    e.preventDefault()
    const recipients = scheduleForm.recipients
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter(Boolean)
    if (recipients.length === 0) {
      toast.error('Enter at least one email address')
      return
    }
    createMutation.mutate(
      {
        title: scheduleForm.title.trim() || 'Scheduled report',
        frequency: scheduleForm.frequency,
        recipients,
        format: scheduleForm.format,
      },
      {
        onSuccess: () => {
          setScheduleForm({
            title: '',
            frequency: 'weekly',
            recipients: '',
            format: 'pdf',
          })
          setShowScheduleForm(false)
        },
      }
    )
  }

  if (isError) {
    return (
      <Card className={cn('animate-fade-in', className)}>
        <CardContent className="py-8 text-center text-sm text-destructive">
          Failed to load scheduled reports.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-6 animate-fade-in', className)}>
      <Card className="transition-shadow duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-primary" aria-hidden />
            Export now
          </CardTitle>
          <CardDescription>
            Download CSV or PDF from the Custom report builder tab, or use quick actions below.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {onExportCsv && (
            <Button
              variant="outline"
              className="gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              onClick={onExportCsv}
            >
              Export CSV
            </Button>
          )}
          {onExportPdf && (
            <Button
              variant="outline"
              className="gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              onClick={onExportPdf}
            >
              Export PDF
            </Button>
          )}
          {!onExportCsv && !onExportPdf && (
            <p className="text-sm text-muted-foreground">
              Use the Custom report builder to select metrics and export.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="transition-shadow duration-200 hover:shadow-card-hover">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-primary" aria-hidden />
                Scheduled email reports
              </CardTitle>
              <CardDescription>
                CSV or PDF reports sent by email on a schedule.
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowScheduleForm((v) => !v)}
              className="gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Schedule report
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showScheduleForm && (
            <form
              onSubmit={handleCreateScheduled}
              className="rounded-xl border border-border bg-muted/30 p-4 space-y-4 animate-fade-in"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sched-title">Report title</Label>
                  <Input
                    id="sched-title"
                    placeholder="e.g. Weekly project health"
                    value={scheduleForm.title}
                    onChange={(e) => setScheduleForm((f) => ({ ...f, title: e.target.value }))}
                    className="focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sched-frequency">Frequency</Label>
                  <Select
                    value={scheduleForm.frequency}
                    onValueChange={(v) =>
                      setScheduleForm((f) => ({ ...f, frequency: v as ScheduledReportConfig['frequency'] }))
                    }
                  >
                    <SelectTrigger id="sched-frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FREQUENCY_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="sched-recipients">Recipients (comma or space separated emails)</Label>
                  <Input
                    id="sched-recipients"
                    type="text"
                    placeholder="team@example.com, pm@example.com"
                    value={scheduleForm.recipients}
                    onChange={(e) => setScheduleForm((f) => ({ ...f, recipients: e.target.value }))}
                    className="focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sched-format">Format</Label>
                  <Select
                    value={scheduleForm.format}
                    onValueChange={(v) => setScheduleForm((f) => ({ ...f, format: v as 'csv' | 'pdf' }))}
                  >
                    <SelectTrigger id="sched-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden />
                  )}
                  Create schedule
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowScheduleForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
            </div>
          ) : scheduled.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center">
              <CalendarClock className="mx-auto h-10 w-10 text-muted-foreground/60" aria-hidden />
              <p className="mt-3 text-sm font-medium text-foreground">No scheduled reports</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Schedule CSV or PDF reports to be sent by email on a recurring basis.
              </p>
              {!showScheduleForm && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setShowScheduleForm(true)}
                >
                  Schedule report
                </Button>
              )}
            </div>
          ) : (
            <ul className="space-y-3" role="list">
              {scheduled.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-accent/30"
                >
                  <div>
                    <p className="font-medium">{s.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {s.frequency} · {s.format.toUpperCase()}
                      {s.lastSentAt && ` · Last sent ${new Date(s.lastSentAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteMutation.mutate(s.id)}
                    disabled={deleteMutation.isPending}
                    aria-label={`Remove scheduled report ${s.title}`}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                      <Trash2 className="h-4 w-4" aria-hidden />
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
