import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, MessageSquare, Calendar, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DecisionLog } from '@/types/decision-log'

const statusVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  draft: 'secondary',
  pending: 'warning',
  approved: 'success',
  rejected: 'destructive',
  changes_requested: 'destructive',
}

export interface DecisionCardGridProps {
  decisions: DecisionLog[]
  onArchive?: (id: string) => void
  viewMode?: 'grid' | 'list'
  /** When set, show checkboxes and call onSelectionChange when selection changes */
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  className?: string
}

function getSelectedOptionLabel(decision: DecisionLog): string | null {
  if (!decision.selected_option_id || !decision.options?.length) return null
  const opt = decision.options.find((o) => o.id === decision.selected_option_id)
  return opt?.title ?? null
}

export function DecisionCardGrid({
  decisions,
  onArchive,
  viewMode = 'grid',
  selectedIds = [],
  onSelectionChange,
  className,
}: DecisionCardGridProps) {
  if (decisions.length === 0) return null

  const toggleSelect = (id: string) => {
    if (!onSelectionChange) return
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((x) => x !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  const showSelection = selectedIds !== undefined && onSelectionChange !== undefined

  return (
    <div
      className={cn(
        viewMode === 'list'
          ? 'flex flex-col gap-2'
          : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
      role="list"
      aria-label="Decision cards"
    >
      {decisions.map((d) => {
        const selectedLabel = getSelectedOptionLabel(d)
        const summary = d.summary ?? d.description?.slice(0, 120) ?? ''
        const isSelected = showSelection && selectedIds.includes(d.id)
        return (
          <Card
            key={d.id}
            className={cn(
              'group relative overflow-hidden transition-all duration-300 hover:shadow-card-hover',
              viewMode === 'grid' && 'hover:-translate-y-1 hover:shadow-lg',
              isSelected && 'ring-2 ring-primary ring-offset-2'
            )}
            role="listitem"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/80 to-primary/40 opacity-90" aria-hidden />
            <CardHeader className="pb-2 pt-5">
              <div className="flex items-start justify-between gap-2">
                {showSelection && (
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggleSelect(d.id)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Select ${d.title}`}
                  />
                )}
                <CardTitleLink id={d.id} title={d.title} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 shrink-0 min-w-[44px] min-h-[44px]"
                      aria-label="Open menu"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/dashboard/decisions/${d.id}`}>View details</Link>
                    </DropdownMenuItem>
                    {onArchive && (
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onArchive(d.id)}
                      >
                        Archive
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {summary && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{summary}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={statusVariant[d.status] ?? 'secondary'}
                  className="capitalize"
                >
                  {d.status.replace('_', ' ')}
                </Badge>
                {selectedLabel && (
                  <Badge className="font-normal bg-primary/10 text-primary border-primary/30">
                    Selected: {selectedLabel}
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Due {d.due_date ?? '—'}
                </span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-10 w-10 min-w-[44px] min-h-[44px]" title="Comments" asChild>
                    <Link to={`/dashboard/decisions/${d.id}#comments`}>
                      <MessageSquare className="h-4 w-4" aria-hidden />
                      <span className="sr-only">Comments</span>
                    </Link>
                  </Button>
                  {d.status === 'pending' && (
                    <Button variant="ghost" size="icon" className="h-10 w-10 min-w-[44px] min-h-[44px]" title="Approve" asChild>
                      <Link to={`/dashboard/decisions/${d.id}`}>
                        <CheckCircle2 className="h-4 w-4" aria-hidden />
                        <span className="sr-only">Approve</span>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function CardTitleLink({ id, title }: { id: string; title: string }) {
  return (
    <h3 className="text-base font-semibold leading-tight">
      <Link
        to={`/dashboard/decisions/${id}`}
        className="hover:text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
      >
        {title}
      </Link>
    </h3>
  )
}
