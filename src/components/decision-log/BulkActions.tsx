import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Send, FileDown, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DecisionPhase } from '@/types/decision-log'

const PHASES: { value: DecisionPhase; label: string }[] = [
  { value: 'concept', label: 'Concept' },
  { value: 'design', label: 'Design' },
  { value: 'construction', label: 'Construction' },
  { value: 'closeout', label: 'Closeout' },
  { value: 'other', label: 'Other' },
]

export interface BulkActionsProps {
  selectedIds: string[]
  onClearSelection: () => void
  onRemindApprovers: (ids: string[]) => void
  onExportHistory: (ids: string[]) => void
  onChangePhase: (ids: string[], phase: string) => void
  isReminding?: boolean
  isExporting?: boolean
  isChangingPhase?: boolean
  className?: string
}

export function BulkActions({
  selectedIds,
  onClearSelection,
  onRemindApprovers,
  onExportHistory,
  onChangePhase,
  isReminding,
  isExporting,
  isChangingPhase,
  className,
}: BulkActionsProps) {
  const [phaseDialogOpen, setPhaseDialogOpen] = useState(false)
  const [selectedPhase, setSelectedPhase] = useState<DecisionPhase>('design')

  const hasSelection = selectedIds.length > 0

  const handleRemind = () => {
    onRemindApprovers(selectedIds)
  }

  const handleExport = () => {
    onExportHistory(selectedIds)
  }

  const handleChangePhase = () => {
    onChangePhase(selectedIds, selectedPhase)
    setPhaseDialogOpen(false)
  }

  if (!hasSelection) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-sm text-muted-foreground">
        {selectedIds.length} selected
      </span>
      <Button variant="outline" size="sm" onClick={onClearSelection}>
        Clear
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" aria-label="Bulk actions">
            Bulk actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={handleRemind}
            disabled={isReminding}
          >
            <Send className="h-4 w-4 mr-2" /> Remind approvers
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleExport}
            disabled={isExporting}
          >
            <FileDown className="h-4 w-4 mr-2" /> Export selected history
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPhaseDialogOpen(true)}>
            <RefreshCw className="h-4 w-4 mr-2" /> Change phase
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={phaseDialogOpen} onOpenChange={setPhaseDialogOpen}>
        <DialogContent showClose>
          <DialogHeader>
            <DialogTitle>Change phase</DialogTitle>
            <DialogDescription>
              Set the phase for {selectedIds.length} selected decision(s).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Phase</Label>
              <Select
                value={selectedPhase}
                onValueChange={(v) => setSelectedPhase(v as DecisionPhase)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PHASES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPhaseDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePhase} disabled={isChangingPhase}>
              {isChangingPhase ? 'Updating…' : 'Update phase'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
