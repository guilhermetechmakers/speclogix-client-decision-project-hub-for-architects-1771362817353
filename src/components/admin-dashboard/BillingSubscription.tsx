import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  useSubscription,
  usePlans,
  useInvoices,
  useChangePlan,
} from '@/hooks/use-admin-dashboard'
import type { BillingPlan } from '@/types/admin-dashboard'
import {
  CreditCard,
  FileText,
  TrendingUp,
  Loader2,
  Check,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export interface BillingSubscriptionProps {
  className?: string
}

export function BillingSubscription({ className }: BillingSubscriptionProps) {
  const { data: subscription, isLoading: subLoading, isError: subError } = useSubscription()
  const { data: plans = [], isLoading: plansLoading } = usePlans()
  const { data: invoices = [], isLoading: invLoading } = useInvoices()
  const changePlanMutation = useChangePlan()
  const [planDialogOpen, setPlanDialogOpen] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  const handleUpgradeDowngrade = (planId: string) => {
    setSelectedPlanId(planId)
    setPlanDialogOpen(true)
  }

  const confirmChangePlan = () => {
    if (!selectedPlanId) return
    changePlanMutation.mutate(selectedPlanId, {
      onSuccess: () => {
        setPlanDialogOpen(false)
        setSelectedPlanId(null)
      },
    })
  }

  if (subError) {
    return (
      <Card className={cn('animate-fade-in border-destructive/30', className)}>
        <CardContent className="py-8 text-center text-sm text-destructive">
          Failed to load billing. Please try again.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-6 animate-fade-in', className)}>
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:border-primary/20">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <CreditCard className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <CardTitle className="text-base">Current plan</CardTitle>
                <CardDescription>Subscription and usage</CardDescription>
              </div>
            </div>
            {subLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : subscription ? (
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    subscription.status === 'active'
                      ? 'default'
                      : subscription.status === 'past_due'
                        ? 'destructive'
                        : 'secondary'
                  }
                >
                  {subscription.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {subscription.plan_name}
                </span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">No subscription</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {subLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : subscription ? (
            <>
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Seats
                  </p>
                  <p className="text-lg font-semibold">
                    {subscription.seats_used} / {subscription.seats_total} used
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Renews
                  </p>
                  <p className="text-lg font-semibold">
                    {formatDate(subscription.current_period_end)}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => setPlanDialogOpen(true)}
              >
                <TrendingUp className="h-4 w-4 mr-2" aria-hidden />
                Change plan
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CreditCard className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No active subscription</p>
              <Button className="mt-4" onClick={() => setPlanDialogOpen(true)}>
                View plans
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" aria-hidden />
            Invoices
          </CardTitle>
          <CardDescription>Billing history and past invoices</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {invLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-medium">No invoices yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Invoices will appear here after your first billing cycle
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left font-medium p-3">Invoice</th>
                    <th className="text-left font-medium p-3">Amount</th>
                    <th className="text-left font-medium p-3">Due date</th>
                    <th className="text-left font-medium p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-b border-border hover:bg-accent/50 transition-colors"
                    >
                      <td className="p-3 font-medium">{inv.number}</td>
                      <td className="p-3">{formatCurrency(inv.amount_cents)}</td>
                      <td className="p-3 text-muted-foreground">
                        {formatDate(inv.due_date)}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant={
                            inv.status === 'paid'
                              ? 'default'
                              : inv.status === 'open'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {inv.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change plan</DialogTitle>
            <DialogDescription>
              Upgrade or downgrade your subscription. Changes apply at the next
              billing cycle.
            </DialogDescription>
          </DialogHeader>
          {plansLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {plans.map((plan: BillingPlan) => (
                <div
                  key={plan.id}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-lg border transition-colors',
                    selectedPlanId === plan.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-accent/50'
                  )}
                >
                  <div>
                    <p className="font-medium capitalize">{plan.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {plan.seats_included} seats ·{' '}
                      {formatCurrency(plan.price_cents)}/{plan.interval}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={
                      subscription?.plan_id === plan.id ? 'secondary' : 'default'
                    }
                    disabled={subscription?.plan_id === plan.id}
                    onClick={() =>
                      subscription?.plan_id === plan.id
                        ? undefined
                        : handleUpgradeDowngrade(plan.id)
                    }
                  >
                    {subscription?.plan_id === plan.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      'Select'
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}
          {selectedPlanId && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={confirmChangePlan}
                disabled={changePlanMutation.isPending}
                className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {changePlanMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Confirm change'
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
