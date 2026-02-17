import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileText, ListTodo, Plus, Check, Circle, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ActionItem, CreateActionItemInput } from '@/types/meetings-agendas'

const ACTION_STATUS_LABELS: Record<ActionItem['status'], string> = {
  open: 'Open',
  in_progress: 'In progress',
  done: 'Done',
}

export interface MinutesActionsPanelProps {
  meetingId: string
  notesContent: string
  notesLoading?: boolean
  actionItems: ActionItem[]
  actionItemsLoading?: boolean
  onNotesChange?: (content: string) => void
  onSaveNotes?: (content: string) => void
  onAddAction?: (data: CreateActionItemInput) => void
  onUpdateAction?: (itemId: string, data: Partial<CreateActionItemInput> & { status?: ActionItem['status'] }) => void
  onRemoveAction?: (itemId: string) => void
  onConvertToTask?: (item: ActionItem) => void
  onConvertToDecision?: (item: ActionItem) => void
  className?: string
}

export function MinutesActionsPanel({
  meetingId,
  notesContent,
  notesLoading,
  actionItems,
  actionItemsLoading,
  onNotesChange,
  onSaveNotes,
  onAddAction,
  onUpdateAction,
  onRemoveAction,
  onConvertToTask,
  onConvertToDecision,
  className,
}: MinutesActionsPanelProps) {
  const [liveNotes, setLiveNotes] = useState(notesContent)
  const [actionTitle, setActionTitle] = useState('')
  const [actionDescription, setActionDescription] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSaveNotes = () => {
    if (onSaveNotes && liveNotes.trim()) {
      setSaving(true)
      onSaveNotes(liveNotes.trim())
      setSaving(false)
    }
  }

  const handleAddAction = () => {
    const title = actionTitle.trim()
    if (!title || !onAddAction) return
    onAddAction({
      meeting_id: meetingId,
      title,
      description: actionDescription.trim() || undefined,
    })
    setActionTitle('')
    setActionDescription('')
  }

  const isNotesDirty = liveNotes !== notesContent

  return (
    <div className={cn('space-y-6', className)}>
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" aria-hidden />
            Minutes
          </CardTitle>
          <CardDescription>
            Take live notes during the meeting. Assign action items below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {notesLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <>
              <Textarea
                placeholder="Meeting notes…"
                value={liveNotes}
                onChange={(e) => {
                  setLiveNotes(e.target.value)
                  onNotesChange?.(e.target.value)
                }}
                rows={8}
                className="resize-y min-h-[120px] transition-[border-color,box-shadow] duration-200 focus-visible:ring-2"
                aria-label="Meeting minutes"
              />
              {onSaveNotes && (
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleSaveNotes}
                    disabled={!isNotesDirty || saving}
                    className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {saving ? 'Saving…' : 'Save notes'}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5" aria-hidden />
            Action items
          </CardTitle>
          <CardDescription>
            Assign action items and convert them into tasks or decisions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {actionItemsLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <>
              <ul className="space-y-2">
                {actionItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 p-3"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      {item.status === 'done' ? (
                        <Check className="h-4 w-4 shrink-0 text-success" aria-hidden />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      )}
                      <div>
                        <span className={cn(item.status === 'done' && 'line-through text-muted-foreground')}>
                          {item.title}
                        </span>
                        {item.assignee_name && (
                          <span className="text-muted-foreground text-sm ml-2">
                            → {item.assignee_name}
                          </span>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {ACTION_STATUS_LABELS[item.status]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {onUpdateAction && (
                        <Select
                          value={item.status}
                          onValueChange={(v) =>
                            onUpdateAction(item.id, { status: v as ActionItem['status'] })
                          }
                        >
                          <SelectTrigger className="w-[120px] h-8" aria-label="Status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(
                              Object.entries(ACTION_STATUS_LABELS) as [ActionItem['status'], string][]
                            ).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      {onConvertToTask && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onConvertToTask(item)}
                          aria-label="Convert to task"
                        >
                          Task
                        </Button>
                      )}
                      {onConvertToDecision && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onConvertToDecision(item)}
                          aria-label="Convert to decision"
                        >
                          Decision
                        </Button>
                      )}
                      {onRemoveAction && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive h-8 w-8"
                          onClick={() => onRemoveAction(item.id)}
                          aria-label="Remove action item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {onAddAction && (
                <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3 space-y-2">
                  <Label>New action item</Label>
                  <Input
                    placeholder="Action title"
                    value={actionTitle}
                    onChange={(e) => setActionTitle(e.target.value)}
                    aria-label="Action item title"
                  />
                  <Input
                    placeholder="Assignee (optional)"
                    value={actionDescription}
                    onChange={(e) => setActionDescription(e.target.value)}
                    aria-label="Action item description or assignee"
                    className="text-sm"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddAction}
                    disabled={!actionTitle.trim()}
                    className="gap-1 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Plus className="h-4 w-4" />
                    Add action
                  </Button>
                </div>
              )}

              {actionItems.length === 0 && !onAddAction && (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No action items. Add some from the meeting discussion.
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
