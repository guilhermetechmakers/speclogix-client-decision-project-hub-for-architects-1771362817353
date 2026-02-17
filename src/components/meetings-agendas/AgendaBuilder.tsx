import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, GripVertical, Clock, User, FileText, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AgendaItem, CreateAgendaItemInput } from '@/types/meetings-agendas'

export interface AgendaBuilderProps {
  meetingId: string
  items: AgendaItem[]
  isLoading?: boolean
  onAddItem?: (data: CreateAgendaItemInput) => void
  onUpdateItem?: (itemId: string, data: Partial<CreateAgendaItemInput>) => void
  onRemoveItem?: (itemId: string) => void
  className?: string
}

function AgendaItemRow({
  item,
  onUpdate,
  onRemove,
  isEditing,
}: {
  item: AgendaItem
  onUpdate?: (data: Partial<CreateAgendaItemInput>) => void
  onRemove?: () => void
  isEditing?: boolean
}) {
  const [duration, setDuration] = useState(String(item.duration_minutes ?? ''))
  const hasLinks = item.linked_decision_id || (item.linked_file_ids?.length ?? 0) > 0

  return (
    <div
      className={cn(
        'flex flex-wrap items-start gap-3 rounded-lg border border-border bg-card p-4 transition-shadow duration-200 hover:shadow-sm',
        isEditing && 'ring-2 ring-primary/20'
      )}
    >
      <div className="flex shrink-0 items-center text-muted-foreground" aria-hidden>
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="font-medium">{item.title}</div>
        {item.description && (
          <p className="text-sm text-muted-foreground">{item.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {item.owner_name && (
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" aria-hidden />
              {item.owner_name}
            </span>
          )}
          {item.duration_minutes != null && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden />
              {item.duration_minutes} min
            </span>
          )}
          {hasLinks && (
            <span className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" aria-hidden />
              Linked
            </span>
          )}
        </div>
        {onUpdate && (
          <div className="flex flex-wrap gap-2 pt-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={`duration-${item.id}`} className="text-xs">
                Duration (min)
              </Label>
              <Input
                id={`duration-${item.id}`}
                type="number"
                min={1}
                className="w-20 h-8 text-sm"
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value)
                  const n = parseInt(e.target.value, 10)
                  if (!Number.isNaN(n)) onUpdate({ duration_minutes: n })
                }}
                aria-label="Duration in minutes"
              />
            </div>
          </div>
        )}
      </div>
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
          aria-label="Remove agenda item"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

export function AgendaBuilder({
  meetingId,
  items,
  isLoading,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  className,
}: AgendaBuilderProps) {
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newDuration, setNewDuration] = useState('')
  const nextOrder = items.length > 0 ? Math.max(...items.map((i) => i.sort_order)) + 1 : 0

  const handleAdd = () => {
    const title = newTitle.trim()
    if (!title || !onAddItem) return
    onAddItem({
      meeting_id: meetingId,
      title,
      description: newDescription.trim() || undefined,
      duration_minutes: newDuration ? parseInt(newDuration, 10) : undefined,
      sort_order: nextOrder,
    })
    setNewTitle('')
    setNewDescription('')
    setNewDuration('')
  }

  if (isLoading) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('animate-fade-in', className)}>
      <CardHeader>
        <CardTitle>Agenda</CardTitle>
        <CardDescription>
          Topics, owners, time allocation, and linked decisions or files.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {items
            .slice()
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((item) => (
              <AgendaItemRow
                key={item.id}
                item={item}
                onUpdate={onUpdateItem ? (d) => onUpdateItem(item.id, d) : undefined}
                onRemove={onRemoveItem ? () => onRemoveItem(item.id) : undefined}
              />
            ))}
        </div>

        {onAddItem && (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 space-y-3">
            <Label>Add topic</Label>
            <Input
              placeholder="Topic title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              aria-label="New agenda topic title"
              className="transition-[border-color,box-shadow] duration-200 focus-visible:ring-2"
            />
            <Textarea
              placeholder="Description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={2}
              className="resize-none"
              aria-label="New agenda topic description"
            />
            <div className="flex flex-wrap items-center gap-2">
              <Input
                type="number"
                min={1}
                placeholder="Min"
                className="w-20"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                aria-label="Duration in minutes"
              />
              <span className="text-sm text-muted-foreground">minutes</span>
              <Button
                type="button"
                size="sm"
                onClick={handleAdd}
                disabled={!newTitle.trim()}
                className="gap-1 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                Add topic
              </Button>
            </div>
          </div>
        )}

        {items.length === 0 && !onAddItem && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No agenda items. Add topics to structure the meeting.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
