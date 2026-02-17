import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileDown, FileSpreadsheet, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  REPORT_METRIC_OPTIONS,
  type ReportMetricId,
  type CustomReportFilters,
} from '@/types/reports-analytics'
import { exportReportCsv, exportReportPdf } from '@/api/reports-analytics'
import { toast } from 'sonner'

export interface CustomReportBuilderProps {
  projectOptions?: { id: string; name: string }[]
  onExportStart?: () => void
  onExportEnd?: () => void
  className?: string
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'overdue', label: 'Overdue' },
]

export function CustomReportBuilder({
  projectOptions = [],
  onExportStart,
  onExportEnd,
  className,
}: CustomReportBuilderProps) {
  const [metrics, setMetrics] = useState<ReportMetricId[]>([
    'pending_approvals',
    'approval_turnaround',
    'overdue_tasks',
  ])
  const [filters, setFilters] = useState<CustomReportFilters>({
    projectId: '',
    status: 'all',
    dateFrom: '',
    dateTo: '',
  })
  const [csvLoading, setCsvLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)

  const toggleMetric = (id: ReportMetricId) => {
    setMetrics((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  const handleExportCsv = async () => {
    if (metrics.length === 0) {
      toast.error('Select at least one metric')
      return
    }
    onExportStart?.()
    setCsvLoading(true)
    try {
      const blob = await exportReportCsv({
        metrics,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        projectId: filters.projectId || undefined,
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('CSV exported')
    } catch {
      toast.error('Export failed. Try again or check your connection.')
    } finally {
      setCsvLoading(false)
      onExportEnd?.()
    }
  }

  const handleExportPdf = async () => {
    if (metrics.length === 0) {
      toast.error('Select at least one metric')
      return
    }
    onExportStart?.()
    setPdfLoading(true)
    try {
      const blob = await exportReportPdf({
        metrics,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
        projectId: filters.projectId || undefined,
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report-${new Date().toISOString().slice(0, 10)}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('PDF exported')
    } catch {
      toast.error('Export failed. Try again or check your connection.')
    } finally {
      setPdfLoading(false)
      onExportEnd?.()
    }
  }

  return (
    <Card className={cn('animate-fade-in transition-shadow duration-200 hover:shadow-card-hover', className)}>
      <CardHeader>
        <CardTitle>Custom report builder</CardTitle>
        <CardDescription>
          Select metrics, apply filters and date range, then export as CSV or PDF.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Metrics</Label>
          <div className="grid gap-2 sm:grid-cols-2">
            {REPORT_METRIC_OPTIONS.map((opt) => (
              <label
                key={opt.id}
                className={cn(
                  'flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 cursor-pointer',
                  'transition-colors hover:bg-accent/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'
                )}
              >
                <Checkbox
                  checked={metrics.includes(opt.id)}
                  onChange={() => toggleMetric(opt.id)}
                  aria-label={opt.label}
                />
                <span className="text-sm font-medium">{opt.label}</span>
                {opt.description && (
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {opt.description}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {projectOptions.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="report-project">Project</Label>
              <Select
                value={filters.projectId || 'all'}
                onValueChange={(v) => setFilters((f) => ({ ...f, projectId: v === 'all' ? undefined : v }))}
              >
                <SelectTrigger id="report-project">
                  <SelectValue placeholder="All projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All projects</SelectItem>
                  {projectOptions.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="report-status">Status</Label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(v) => setFilters((f) => ({ ...f, status: v }))}
            >
              <SelectTrigger id="report-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="report-date-from">From date</Label>
            <Input
              id="report-date-from"
              type="date"
              value={filters.dateFrom ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value || undefined }))}
              className="transition-colors focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="report-date-to">To date</Label>
            <Input
              id="report-date-to"
              type="date"
              value={filters.dateTo ?? ''}
              onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value || undefined }))}
              className="transition-colors focus:border-primary"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            onClick={handleExportCsv}
            disabled={csvLoading || pdfLoading || metrics.length === 0}
            className="gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {csvLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <FileSpreadsheet className="h-4 w-4" aria-hidden />
            )}
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPdf}
            disabled={csvLoading || pdfLoading || metrics.length === 0}
            className="gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {pdfLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <FileDown className="h-4 w-4" aria-hidden />
            )}
            Export PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
