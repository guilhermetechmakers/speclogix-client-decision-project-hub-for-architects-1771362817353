import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
  FileText,
  Clock,
  PenLine,
  DollarSign,
  Image,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DecisionLog, DecisionOption } from '@/types/decision-log'

const commentSchema = z.object({ body: z.string().min(1, 'Comment is required') })
type CommentFormValues = z.infer<typeof commentSchema>

const requestChangesSchema = z.object({ comment: z.string().min(1, 'Reason required') })
type RequestChangesFormValues = z.infer<typeof requestChangesSchema>

export interface DecisionDetailPanelProps {
  decision: DecisionLog
  onApprove: (selectedOptionId: string) => void
  onRequestChanges: (comment: string) => void
  onAddComment: (body: string) => void
  onSign?: () => void
  isApproving?: boolean
  isRequestingChanges?: boolean
  isAddingComment?: boolean
  isSigning?: boolean
}

export function DecisionDetailPanel({
  decision,
  onApprove,
  onRequestChanges,
  onAddComment,
  onSign,
  isApproving,
  isRequestingChanges,
  isAddingComment,
  isSigning,
}: DecisionDetailPanelProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    decision.selected_option_id ?? decision.recommended_option_id ?? null
  )
  const [requestChangesOpen, setRequestChangesOpen] = useState(false)

  const options = decision.options ?? []
  const comments = decision.comments ?? []
  const audit = decision.audit_timeline ?? []

  const {
    register: registerComment,
    handleSubmit: handleCommentSubmit,
    reset: resetComment,
    formState: { errors: commentErrors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { body: '' },
  })

  const {
    register: registerRequestChanges,
    handleSubmit: handleRequestChangesSubmit,
    reset: resetRequestChanges,
    formState: { errors: requestChangesErrors },
  } = useForm<RequestChangesFormValues>({
    resolver: zodResolver(requestChangesSchema),
    defaultValues: { comment: '' },
  })

  const onCommentSubmit = handleCommentSubmit((data) => {
    onAddComment(data.body)
    resetComment()
  })

  const onRequestChangesSubmit = handleRequestChangesSubmit((data) => {
    onRequestChanges(data.comment)
    resetRequestChanges()
    setRequestChangesOpen(false)
  })

  const canApprove = decision.status === 'pending' && selectedOptionId
  const canRequestChanges = decision.status === 'pending'
  const canSign = decision.status === 'approved' && !decision.signed_at && onSign

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/decisions">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to list
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden border border-border shadow-card">
        <div className="h-1 w-full bg-gradient-to-r from-primary/80 to-primary/40" aria-hidden />
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="text-xl sm:text-2xl">{decision.title}</CardTitle>
              {decision.summary && (
                <CardDescription className="mt-1">{decision.summary}</CardDescription>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge
                  variant={
                    decision.status === 'approved'
                      ? 'success'
                      : decision.status === 'pending'
                        ? 'warning'
                        : 'secondary'
                  }
                  className="capitalize"
                >
                  {decision.status.replace('_', ' ')}
                </Badge>
                <Badge variant="outline">{decision.phase}</Badge>
                {decision.due_date && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Due {decision.due_date}
                  </span>
                )}
                {decision.approver_name && (
                  <span className="text-sm text-muted-foreground">
                    Approver: {decision.approver_name}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {canApprove && (
                <Button
                  onClick={() => selectedOptionId && onApprove(selectedOptionId)}
                  disabled={!selectedOptionId || isApproving}
                  className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                </Button>
              )}
              {canRequestChanges && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setRequestChangesOpen(true)}
                    className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Request changes
                  </Button>
                  <Dialog open={requestChangesOpen} onOpenChange={setRequestChangesOpen}>
                    <DialogContent showClose>
                      <DialogHeader>
                        <DialogTitle>Request changes</DialogTitle>
                        <DialogDescription>
                          Add a reason so the team can update the decision.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={onRequestChangesSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="request-changes-comment">Comment</Label>
                          <Textarea
                            id="request-changes-comment"
                            {...registerRequestChanges('comment')}
                            className="mt-1"
                            rows={3}
                          />
                          {requestChangesErrors.comment && (
                            <p className="text-sm text-destructive mt-1">
                              {requestChangesErrors.comment.message}
                            </p>
                          )}
                        </div>
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setRequestChangesOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isRequestingChanges}>
                            {isRequestingChanges ? 'Sending…' : 'Request changes'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </>
              )}
              {canSign && (
                <Button
                  onClick={onSign}
                  disabled={isSigning}
                  className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PenLine className="h-4 w-4 mr-1" /> E-sign
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Option comparison: side-by-side media */}
      {options.length > 0 && (
        <Card className="border border-border shadow-sm transition-shadow duration-200 hover:shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Option comparison
            </CardTitle>
            <CardDescription>Select an option to approve. Compare media side-by-side.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {options.map((opt) => (
                <OptionCard
                  key={opt.id}
                  option={opt}
                  isSelected={selectedOptionId === opt.id}
                  isRecommended={decision.recommended_option_id === opt.id}
                  onSelect={() => decision.status === 'pending' && setSelectedOptionId(opt.id)}
                  selectable={decision.status === 'pending'}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cost breakdown */}
      {options.some((o) => o.cost_impacts?.length) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" /> Cost breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium">Option</th>
                    <th className="text-left py-2 font-medium">Item</th>
                    <th className="text-right py-2 font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {options.map((opt) =>
                    (opt.cost_impacts ?? []).map((c) => (
                      <tr key={c.id} className="border-b border-border/50">
                        <td className="py-2">{opt.title}</td>
                        <td className="py-2">{c.label}</td>
                        <td className="text-right py-2">
                          {c.currency} {(c.amount_cents / 100).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments thread */}
      <Card id="comments">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" /> Comments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {comments.length === 0 && (
            <div className="rounded-lg border border-dashed border-border bg-muted/20 py-8 text-center">
              <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-2" aria-hidden />
              <p className="text-sm text-muted-foreground">No comments yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Add a comment below to start the discussion.</p>
            </div>
          )}
          <ul className="space-y-3">
            {comments.map((c) => (
              <li
                key={c.id}
                className="rounded-lg border border-border bg-muted/30 p-3 text-sm"
              >
                <p className="font-medium">{c.user_name}</p>
                <p className="text-muted-foreground mt-1">{c.body}</p>
                <p className="text-xs text-muted-foreground mt-2">{c.created_at}</p>
              </li>
            ))}
          </ul>
          <form onSubmit={onCommentSubmit} className="flex gap-2">
            <Textarea
              {...registerComment('body')}
              placeholder="Add a comment…"
              className="min-h-[80px] flex-1"
              rows={2}
            />
            <Button type="submit" disabled={isAddingComment}>
              {isAddingComment ? 'Sending…' : 'Send'}
            </Button>
          </form>
          {commentErrors.body && (
            <p className="text-sm text-destructive">{commentErrors.body.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Audit timeline */}
      {audit.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" /> Audit timeline
            </CardTitle>
            <CardDescription>History of actions on this decision.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {audit.map((entry) => (
                <li
                  key={entry.id}
                  className="flex gap-3 text-sm border-l-2 border-border pl-3 py-1"
                >
                  <span className="text-muted-foreground shrink-0">
                    {new Date(entry.created_at).toLocaleString()}
                  </span>
                  <span>
                    <strong>{entry.user_name}</strong> — {entry.action.replace('_', ' ')}
                    {entry.details && `: ${entry.details}`}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function OptionCard({
  option,
  isSelected,
  isRecommended,
  onSelect,
  selectable,
}: {
  option: DecisionOption
  isSelected: boolean
  isRecommended: boolean
  onSelect: () => void
  selectable: boolean
}) {
  return (
    <Card
      className={cn(
        'transition-all duration-200',
        selectable && 'cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5',
        isSelected && 'ring-2 ring-primary ring-offset-2'
      )}
      onClick={selectable ? onSelect : undefined}
      role={selectable ? 'button' : undefined}
      aria-pressed={selectable ? isSelected : undefined}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{option.title}</CardTitle>
          {isRecommended && (
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">Recommended</Badge>
          )}
        </div>
        {option.description && (
          <CardDescription className="text-sm">{option.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {option.media_urls?.length ? (
          <div className="grid grid-cols-2 gap-1">
            {option.media_urls.slice(0, 4).map((url, i) => (
              <div
                key={i}
                className="aspect-video rounded-md bg-muted flex items-center justify-center overflow-hidden"
              >
                {url.toLowerCase().endsWith('.pdf') ? (
                  <FileText className="h-8 w-8 text-muted-foreground" />
                ) : (
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
            <Image className="h-10 w-10 text-muted-foreground" aria-hidden />
          </div>
        )}
        {option.cost_impacts?.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Total: {option.cost_impacts.reduce((s, c) => s + c.amount_cents, 0) / 100}{' '}
            {option.cost_impacts[0]?.currency ?? 'USD'}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
