import { useState, useEffect, useRef, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DecisionListFilters, DecisionPhase, DecisionStatus } from '@/types/decision-log'

const SEARCH_DEBOUNCE_MS = 300

const PHASES: { value: DecisionPhase | 'all'; label: string }[] = [
  { value: 'all', label: 'All phases' },
  { value: 'concept', label: 'Concept' },
  { value: 'design', label: 'Design' },
  { value: 'construction', label: 'Construction' },
  { value: 'closeout', label: 'Closeout' },
  { value: 'other', label: 'Other' },
]

const STATUSES: { value: DecisionStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'changes_requested', label: 'Changes requested' },
]

export interface DecisionListProps {
  filters: DecisionListFilters
  onFiltersChange: (f: DecisionListFilters) => void
  approverOptions?: { id: string; name: string }[]
  /** When set, show a "Clear filters" control and call when user clears */
  onClearFilters?: () => void
  className?: string
}

export function hasActiveFilters(f: DecisionListFilters): boolean {
  return (
    (f.phase && f.phase !== 'all') ||
    (f.status && f.status !== 'all') ||
    (f.approver_id && f.approver_id !== 'all') ||
    Boolean(f.due_date_from) ||
    Boolean(f.due_date_to) ||
    Boolean(f.search?.trim())
  )
}

export function DecisionList({
  filters,
  onFiltersChange,
  approverOptions = [],
  onClearFilters,
  className,
}: DecisionListProps) {
  const [searchInput, setSearchInput] = useState(filters.search)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const filtersRef = useRef(filters)
  filtersRef.current = filters

  // Sync local search from parent when filters are reset externally
  useEffect(() => {
    setSearchInput(filters.search)
  }, [filters.search])

  // Debounced search: apply filter after user stops typing (instant feedback)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null
      const latest = filtersRef.current
      if (latest.search !== searchInput) {
        onFiltersChange({ ...latest, search: searchInput })
      }
    }, SEARCH_DEBOUNCE_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchInput, onFiltersChange])

  const updateFilter = useCallback(
    (key: keyof DecisionListFilters, value: string | undefined) => {
      onFiltersChange({ ...filters, [key]: value as DecisionListFilters[keyof DecisionListFilters] })
    },
    [filters, onFiltersChange]
  )

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
    updateFilter('search', searchInput)
  }

  const handleClearFilters = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }
    setSearchInput('')
    onFiltersChange({
      phase: 'all',
      status: 'all',
      approver_id: 'all',
      search: '',
      due_date_from: undefined,
      due_date_to: undefined,
    })
    onClearFilters?.()
  }, [onFiltersChange, onClearFilters])

  const activeFilters = hasActiveFilters(filters)

  return (
    <div className={cn('space-y-4', className)}>
      <div className="rounded-xl border border-border bg-card/50 shadow-sm transition-shadow duration-200 hover:shadow-card">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-wrap items-center gap-3 p-4"
          role="search"
          aria-label="Filter decisions"
        >
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden />
            <Input
              type="search"
              placeholder="Search decisions…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onBlur={() => updateFilter('search', searchInput)}
              className="pl-9 transition-[border-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Search decisions"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
            Search
          </Button>
        <Select
          value={filters.phase}
          onValueChange={(v) => updateFilter('phase', v as DecisionListFilters['phase'])}
        >
          <SelectTrigger className="w-[140px]" aria-label="Filter by phase">
            <SelectValue placeholder="Phase" />
          </SelectTrigger>
          <SelectContent>
            {PHASES.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.status}
          onValueChange={(v) => updateFilter('status', v as DecisionListFilters['status'])}
        >
          <SelectTrigger className="w-[160px]" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {approverOptions.length > 0 && (
          <Select
            value={filters.approver_id}
            onValueChange={(v) => updateFilter('approver_id', v)}
          >
            <SelectTrigger className="w-[160px]" aria-label="Filter by approver">
              <SelectValue placeholder="Approver" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All approvers</SelectItem>
              {approverOptions.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <fieldset className="flex items-center gap-2" aria-label="Due date range">
          <legend className="sr-only">Due date range</legend>
          <Input
            type="date"
            className="w-[140px] transition-[border-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-ring"
            value={filters.due_date_from ?? ''}
            onChange={(e) => updateFilter('due_date_from', e.target.value || undefined)}
            aria-label="Due date from"
          />
          <span className="text-muted-foreground text-sm" aria-hidden>–</span>
          <Input
            type="date"
            className="w-[140px] transition-[border-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-ring"
            value={filters.due_date_to ?? ''}
            onChange={(e) => updateFilter('due_date_to', e.target.value || undefined)}
            aria-label="Due date to"
          />
        </fieldset>
        {onClearFilters && activeFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-[1.02] active:scale-[0.98] min-h-[44px]"
            aria-label="Clear all filters"
          >
            <X className="h-4 w-4 mr-1" /> Clear filters
          </Button>
        )}
        </form>
      </div>
    </div>
  )
}
