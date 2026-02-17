import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DecisionList } from '@/components/decision-log/DecisionList'
import { DecisionCardGrid } from '@/components/decision-log/DecisionCardGrid'
import { CreateDecisionModal } from '@/components/decision-log/CreateDecisionModal'
import { DecisionDetailPanel } from '@/components/decision-log/DecisionDetailPanel'
import { VersioningView } from '@/components/decision-log/VersioningView'
import { BulkActions } from '@/components/decision-log/BulkActions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, ClipboardList, LayoutGrid, List } from 'lucide-react'
import type { DecisionListFilters } from '@/types/decision-log'
import {
  useDecisions,
  useDecision,
  useCreateDecision,
  useApproveDecision,
  useRequestChangesDecision,
  useAddComment,
  useSignDecision,
  useBulkRemindApprovers,
  useBulkChangePhase,
} from '@/hooks/use-decision-log'
import { bulkExportHistory } from '@/api/decision-log'

const defaultFilters: DecisionListFilters = {
  phase: 'all',
  status: 'all',
  approver_id: 'all',
  search: '',
}

export function DecisionLogPage() {
  const { decisionId } = useParams<{ decisionId: string }>()
  const navigate = useNavigate()
  const isNew = decisionId === 'new'
  const [filters, setFilters] = useState<DecisionListFilters>(defaultFilters)
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const { data: decisions = [], isLoading: listLoading, error: listError } = useDecisions(filters)
  const { data: decision, isLoading: detailLoading, error: detailError } = useDecision(
    decisionId && !isNew ? decisionId : undefined
  )

  const createMutation = useCreateDecision()
  const approveMutation = useApproveDecision(decisionId ?? '')
  const requestChangesMutation = useRequestChangesDecision(decisionId ?? '')
  const addCommentMutation = useAddComment(decisionId ?? '')
  const signMutation = useSignDecision(decisionId ?? '')
  const remindMutation = useBulkRemindApprovers()
  const changePhaseMutation = useBulkChangePhase()

  useEffect(() => {
    if (isNew) {
      document.title = 'New decision — Decision Log | SpecLogix'
    } else if (decision?.title) {
      document.title = `${decision.title} — Decision Log | SpecLogix`
    } else {
      document.title = 'Decision Log | SpecLogix'
    }
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      const value =
        decision?.title || decision?.summary
          ? `Decision: ${decision.title ?? ''}${decision.summary ? ` — ${decision.summary}` : ''}. SpecLogix client decision and project hub.`
          : 'Create and track client decision comparison cards, approvals, and e-sign. SpecLogix.'
      metaDesc.setAttribute('content', value)
    }
    return () => {
      document.title = 'SpecLogix'
    }
  }, [isNew, decision?.title, decision?.summary])

  const approverOptions = useMemo(() => {
    const seen = new Map<string, string>()
    decisions.forEach((d) => {
      if (d.approver_id && d.approver_name) seen.set(d.approver_id, d.approver_name)
    })
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }))
  }, [decisions])

  const handleCreateSubmit = (data: Parameters<typeof createMutation.mutate>[0]) => {
    createMutation.mutate(
      {
        title: data.title,
        description: data.description,
        summary: data.summary,
        phase: data.phase,
        approver_email: data.approver_email || undefined,
        due_date: data.due_date || undefined,
        options: data.options.map((o) => ({
          title: o.title,
          description: o.description,
          media_urls: o.media_urls,
          cost_impacts: o.cost_impacts,
        })),
        recommended_option_index: data.recommended_option_index,
      },
      {
        onSuccess: (created) => {
          setCreateOpen(false)
          navigate(`/dashboard/decisions/${created.id}`)
        },
      }
    )
  }

  const handleExportHistory = (ids: string[]) => {
    bulkExportHistory(ids)
      .then((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `decision-history-${Date.now()}.pdf`
        a.click()
        URL.revokeObjectURL(url)
      })
      .catch(() => {})
  }

  // Detail view: single decision
  if (decisionId && !isNew && (decision || detailLoading || detailError)) {
    return (
      <>
        {detailLoading && (
          <div className="space-y-4 animate-fade-in">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}
        {detailError && (
          <Card className="border-destructive/50">
            <CardContent className="py-8 text-center">
              <p className="text-destructive font-medium">Failed to load decision.</p>
              <Button variant="outline" className="mt-2" onClick={() => navigate('/dashboard/decisions')}>
                Back to list
              </Button>
            </CardContent>
          </Card>
        )}
        {decision && !detailLoading && (
          <div className="space-y-6">
            <DecisionDetailPanel
              decision={decision}
              onApprove={(optionId) => approveMutation.mutate(optionId)}
              onRequestChanges={(comment) => requestChangesMutation.mutate(comment)}
              onAddComment={(body) => addCommentMutation.mutate(body)}
              onSign={
                decision.status === 'approved' && !decision.signed_at
                  ? (payload) => signMutation.mutateAsync(payload)
                  : undefined
              }
              isApproving={approveMutation.isPending}
              isRequestingChanges={requestChangesMutation.isPending}
              isAddingComment={addCommentMutation.isPending}
              isSigning={signMutation.isPending}
            />
        {decision.versions && decision.versions.length > 0 && (
            <VersioningView
              versions={decision.versions}
              decisionId={decision.id}
              decisionTitle={decision.title}
              onExportPdf={(versionId) => {
                bulkExportHistory([decision.id])
                  .then((blob) => {
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `decision-${decision.title.replace(/\s+/g, '-')}-${versionId ?? 'current'}.pdf`
                    a.click()
                    URL.revokeObjectURL(url)
                  })
                  .catch(() => {})
              }}
            />
          )}
          </div>
        )}
      </>
    )
  }

  // New decision: open create modal and redirect after
  if (isNew) {
    return (
      <>
        <CreateDecisionModal
          open={true}
          onOpenChange={(open) => !open && navigate('/dashboard/decisions')}
          onSubmit={handleCreateSubmit}
          isSubmitting={createMutation.isPending}
        />
      </>
    )
  }

  // List view
  return (
    <>
      <div className="space-y-6 animate-fade-in [@media(prefers-reduced-motion:reduce)]:animate-none">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-foreground">
              Decision Log
            </h1>
            <p className="text-muted-foreground mt-1 text-[15px] leading-relaxed max-w-xl">
              Publish comparison cards for client choices. Track options, approvals, and e-sign.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border bg-muted/30 p-0.5" role="tablist" aria-label="View mode">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`rounded-md p-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  viewMode === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-pressed={viewMode === 'grid'}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`rounded-md p-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-w-[44px] min-h-[44px] flex items-center justify-center ${
                  viewMode === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-pressed={viewMode === 'list'}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <Button
              onClick={() => setCreateOpen(true)}
              className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" /> Create decision
            </Button>
          </div>
        </div>

        <DecisionList
          filters={filters}
          onFiltersChange={setFilters}
          approverOptions={approverOptions}
        />

        {selectedIds.length > 0 && (
          <BulkActions
            selectedIds={selectedIds}
            onClearSelection={() => setSelectedIds([])}
            onRemindApprovers={(ids) => remindMutation.mutate(ids)}
            onExportHistory={handleExportHistory}
            onChangePhase={(ids, phase) => changePhaseMutation.mutate({ ids, phase })}
            isReminding={remindMutation.isPending}
            isExporting={false}
            isChangingPhase={changePhaseMutation.isPending}
          />
        )}

        {listLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-border overflow-hidden shadow-sm animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <Skeleton className="h-2 w-full rounded-none" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-16 rounded-md" />
                    <Skeleton className="h-6 w-24 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {listError && (
          <Card className="border-destructive/50">
            <CardContent className="py-6 text-center">
              <p className="text-destructive font-medium">Failed to load decisions.</p>
              <p className="text-sm text-muted-foreground mt-1">You can still create a new decision.</p>
            </CardContent>
          </Card>
        )}

        {!listLoading && !listError && decisions.length > 0 && (
          <DecisionCardGrid
            decisions={decisions}
            viewMode={viewMode}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        )}

        {!listLoading && !listError && decisions.length === 0 && (
          <Card className="border-dashed border-2 rounded-2xl bg-card/50">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="rounded-2xl bg-muted/50 p-6 mb-4">
                <ClipboardList className="h-14 w-14 text-muted-foreground" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold">No decisions yet</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm leading-relaxed">
                Create your first decision to share options, attach media and cost impacts, and capture client approvals.
              </p>
              <Button
                className="mt-6 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => setCreateOpen(true)}
              >
                Create decision
              </Button>
            </CardContent>
          </Card>
        )}

        <CreateDecisionModal
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={handleCreateSubmit}
          isSubmitting={createMutation.isPending}
        />
      </div>
    </>
  )
}

export default DecisionLogPage
