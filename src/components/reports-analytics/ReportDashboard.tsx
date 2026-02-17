import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ClipboardCheck, Clock, AlertCircle, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReportDashboardStats } from '@/types/reports-analytics'

export interface ReportDashboardProps {
  stats: ReportDashboardStats | undefined
  isLoading: boolean
  isError?: boolean
  className?: string
}

export function ReportDashboard({
  stats,
  isLoading,
  isError,
  className,
}: ReportDashboardProps) {
  if (isError) {
    return (
      <div
        className={cn(
          'rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-6 text-center text-sm text-destructive animate-fade-in',
          className
        )}
        role="alert"
      >
        <AlertCircle className="mx-auto h-10 w-10 mb-2" aria-hidden />
        <p>Unable to load report dashboard. Please try again later.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={cn('space-y-6 animate-fade-in', className)}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden transition-shadow duration-200">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[240px] w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const data = stats ?? {
    pendingApprovals: 0,
    approvalTurnaroundDays: 0,
    overdueTasks: 0,
    turnaroundTrend: [],
  }

  const trendData = data.turnaroundTrend?.length
    ? data.turnaroundTrend
    : [
        { date: 'This week', avgDays: data.approvalTurnaroundDays },
        { date: 'Last week', avgDays: Math.max(0, data.approvalTurnaroundDays - 1) },
      ]

  return (
    <div className={cn('space-y-6 animate-fade-in', className)}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:border-primary/20 group">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2 text-primary group-hover:bg-primary/20 transition-colors">
                <ClipboardCheck className="h-5 w-5" aria-hidden />
              </div>
              <CardTitle className="text-base">Pending approvals</CardTitle>
            </div>
            <CardDescription>Awaiting your sign-off</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {data.pendingApprovals}
            </p>
            {data.pendingApprovals > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Review in Approvals & E-sign
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:border-primary/20 group">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2 text-primary group-hover:bg-primary/20 transition-colors">
                <Clock className="h-5 w-5" aria-hidden />
              </div>
              <CardTitle className="text-base">Approval turnaround</CardTitle>
            </div>
            <CardDescription>Average days to approval</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {data.approvalTurnaroundDays}
              <span className="text-sm font-normal text-muted-foreground ml-1">days</span>
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:border-primary/20 group">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-destructive/10 p-2 text-destructive group-hover:bg-destructive/20 transition-colors">
                <AlertCircle className="h-5 w-5" aria-hidden />
              </div>
              <CardTitle className="text-base">Overdue tasks</CardTitle>
            </div>
            <CardDescription>Past due date</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {data.overdueTasks}
            </p>
            {data.overdueTasks > 0 && (
              <p className="text-xs text-destructive mt-1">Requires attention</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover border border-border">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" aria-hidden />
            <CardTitle>Approval turnaround trend</CardTitle>
          </div>
          <CardDescription>Average days over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="turnaroundGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area
                  type="monotone"
                  dataKey="avgDays"
                  name="Avg days"
                  stroke="hsl(var(--primary))"
                  fill="url(#turnaroundGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
