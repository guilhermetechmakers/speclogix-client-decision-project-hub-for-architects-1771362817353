import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Search,
  Pencil,
  Copy,
  Trash2,
  MoreHorizontal,
  FileText,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { TemplatesWorkflowLibrary } from '@/types/templates-workflow-library'

export interface TemplateCatalogProps {
  templates: TemplatesWorkflowLibrary[]
  isLoading?: boolean
  onEdit: (template: TemplatesWorkflowLibrary) => void
  onDuplicate: (template: TemplatesWorkflowLibrary) => void
  onDelete: (template: TemplatesWorkflowLibrary) => void
  onApply: (template: TemplatesWorkflowLibrary) => void
  onSelect?: (template: TemplatesWorkflowLibrary) => void
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function TemplateCard({
  template,
  onEdit,
  onDuplicate,
  onDelete,
  onApply,
}: {
  template: TemplatesWorkflowLibrary
  onEdit: () => void
  onDuplicate: () => void
  onDelete: () => void
  onApply: () => void
}) {
  return (
    <Card
      className={cn(
        'group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300',
        'hover:shadow-card-hover hover:border-primary/20 hover:scale-[1.01]'
      )}
    >
      <div className="relative h-24 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold leading-tight text-foreground truncate" title={template.title}>
              {template.title}
            </h3>
            {template.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{template.description}</p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0 opacity-70 hover:opacity-100 min-w-[44px] min-h-[44px]"
                aria-label="Template options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onApply} className="text-primary">
                <FileText className="h-4 w-4 mr-2" />
                Use for project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Badge variant={template.status === 'active' ? 'default' : 'secondary'} className="text-xs">
            {template.status}
          </Badge>
          <span className="text-xs text-muted-foreground">{formatDate(template.updated_at)}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <Button
          className="w-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          onClick={onApply}
        >
          Use template
        </Button>
      </CardContent>
    </Card>
  )
}

function TemplateCatalogSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden rounded-xl border border-border">
          <Skeleton className="h-24 w-full rounded-none" />
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-14 rounded-md" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function TemplateCatalog({
  templates,
  isLoading,
  onEdit,
  onDuplicate,
  onDelete,
  onApply,
}: TemplateCatalogProps) {
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? templates.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          (t.description ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : templates

  if (isLoading) {
    return <TemplateCatalogSkeleton />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          aria-label="Search templates"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onEdit={() => onEdit(template)}
            onDuplicate={() => onDuplicate(template)}
            onDelete={() => onDelete(template)}
            onApply={() => onApply(template)}
          />
        ))}
      </div>
    </div>
  )
}
