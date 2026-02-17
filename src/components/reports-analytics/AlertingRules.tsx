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
import { Badge } from '@/components/ui/badge'
import { Bell, Mail, Smartphone, Plus, Trash2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AlertingRule, ReportMetricId } from '@/types/reports-analytics'
import { REPORT_METRIC_OPTIONS } from '@/types/reports-analytics'
import {
  useAlertingRules,
  useSaveAlertingRule,
  useDeleteAlertingRule,
} from '@/hooks/use-reports-analytics'

const OPERATORS: { value: AlertingRule['operator']; label: string }[] = [
  { value: 'gt', label: 'Greater than' },
  { value: 'gte', label: 'Greater than or equal' },
  { value: 'lt', label: 'Less than' },
  { value: 'lte', label: 'Less than or equal' },
  { value: 'eq', label: 'Equal to' },
]

const METRIC_LABELS: Record<ReportMetricId, string> = Object.fromEntries(
  REPORT_METRIC_OPTIONS.map((o) => [o.id, o.label])
) as Record<ReportMetricId, string>

export interface AlertingRulesProps {
  className?: string
}

export function AlertingRules({ className }: AlertingRulesProps) {
  const { data: rules = [], isLoading, isError } = useAlertingRules()
  const saveMutation = useSaveAlertingRule()
  const deleteMutation = useDeleteAlertingRule()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    metric: 'pending_approvals' as ReportMetricId,
    operator: 'gt' as AlertingRule['operator'],
    threshold: 7,
    email: true,
    in_app: true,
  })

  const resetForm = () => {
    setForm({
      name: '',
      metric: 'pending_approvals',
      operator: 'gt',
      threshold: 7,
      email: true,
      in_app: true,
    })
    setShowForm(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const name = form.name.trim() || `Approvals ${form.operator} ${form.threshold}`
    saveMutation.mutate(
      {
        name,
        metric: form.metric,
        operator: form.operator,
        threshold: form.threshold,
        channels: [
          ...(form.email ? (['email'] as const) : []),
          ...(form.in_app ? (['in_app'] as const) : []),
        ],
        enabled: true,
      },
      { onSuccess: resetForm }
    )
  }

  if (isError) {
    return (
      <Card className={cn('animate-fade-in', className)}>
        <CardContent className="py-8 text-center text-sm text-destructive">
          Failed to load alerting rules. Please try again.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('animate-fade-in transition-shadow duration-200 hover:shadow-card-hover', className)}>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" aria-hidden />
              Alerting rules
            </CardTitle>
            <CardDescription>
              Email and in-app alerts when metrics cross thresholds (e.g. approvals &gt; 7 days).
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={() => setShowForm((v) => !v)}
            className="gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add rule
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-border bg-muted/30 p-4 space-y-4 animate-fade-in"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="alert-name">Rule name (optional)</Label>
                <Input
                  id="alert-name"
                  placeholder="e.g. Approvals over 7 days"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alert-metric">Metric</Label>
                <Select
                  value={form.metric}
                  onValueChange={(v) => setForm((f) => ({ ...f, metric: v as ReportMetricId }))}
                >
                  <SelectTrigger id="alert-metric">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_METRIC_OPTIONS.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alert-operator">Condition</Label>
                <Select
                  value={form.operator}
                  onValueChange={(v) => setForm((f) => ({ ...f, operator: v as AlertingRule['operator'] }))}
                >
                  <SelectTrigger id="alert-operator">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPERATORS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alert-threshold">Threshold</Label>
                <Input
                  id="alert-threshold"
                  type="number"
                  min={0}
                  value={form.threshold}
                  onChange={(e) => setForm((f) => ({ ...f, threshold: Number(e.target.value) || 0 }))}
                  className="focus:border-primary"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.checked }))}
                  className="h-4 w-4 rounded border border-input accent-primary"
                />
                <Mail className="h-4 w-4 text-muted-foreground" aria-hidden />
                <span className="text-sm">Email</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.in_app}
                  onChange={(e) => setForm((f) => ({ ...f, in_app: e.target.checked }))}
                  className="h-4 w-4 rounded border border-input accent-primary"
                />
                <Smartphone className="h-4 w-4 text-muted-foreground" aria-hidden />
                <span className="text-sm">In-app</span>
              </label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden />}
                Save rule
              </Button>
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : rules.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center">
            <Bell className="mx-auto h-10 w-10 text-muted-foreground/60" aria-hidden />
            <p className="mt-3 text-sm font-medium text-foreground">No alerting rules yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a rule to get email or in-app alerts when metrics cross your thresholds.
            </p>
            {!showForm && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setShowForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" aria-hidden />
                Add rule
              </Button>
            )}
          </div>
        ) : (
          <ul className="space-y-3" role="list">
            {rules.map((rule) => (
              <li
                key={rule.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-accent/30"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{rule.name}</span>
                  <Badge variant={rule.enabled ? 'default' : 'secondary'} className="text-xs">
                    {rule.enabled ? 'On' : 'Off'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {METRIC_LABELS[rule.metric]} {rule.operator} {rule.threshold}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    {rule.channels.includes('email') && (
                      <Mail className="h-3.5 w-3" aria-hidden />
                    )}
                    {rule.channels.includes('in_app') && (
                      <Smartphone className="h-3.5 w-3" aria-hidden />
                    )}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteMutation.mutate(rule.id)}
                  disabled={deleteMutation.isPending}
                  aria-label={`Delete rule ${rule.name}`}
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
  )
}
