import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, Search, MoreHorizontal, MessageSquare, CheckCircle2, Calendar, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'

const mockDecisions = [
  { id: '1', title: 'Fixture package A', status: 'pending', dueDate: '2025-02-20', projectName: 'Riverside Residence', recommended: 'Option A' },
  { id: '2', title: 'Kitchen layout', status: 'approved', dueDate: '2025-02-18', projectName: 'Riverside Residence', recommended: 'Layout B' },
  { id: '3', title: 'Exterior finish', status: 'draft', dueDate: '—', projectName: 'Downtown Office', recommended: '—' },
]

const statusVariant: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  draft: 'secondary',
  pending: 'warning',
  approved: 'success',
  rejected: 'destructive',
}

export function DecisionLogPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Decision Log</h1>
          <p className="text-muted-foreground mt-1">Publish and track decisions with options and approvals.</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/decisions/new">
            <Plus className="h-4 w-4 mr-2" /> Create decision
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search decisions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Status: {filter === 'all' ? 'All' : filter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {['all', 'draft', 'pending', 'approved'].map((f) => (
              <DropdownMenuItem key={f} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockDecisions.map((d) => (
          <Card
            key={d.id}
            className={cn(
              'group transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5'
            )}
          >
            <CardHeader className="pb-2">
              <div className="aspect-video rounded-md bg-muted mb-2" />
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">
                  <Link
                    to={`/dashboard/decisions/${d.id}`}
                    className="hover:text-primary hover:underline"
                  >
                    {d.title}
                  </Link>
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/dashboard/decisions/${d.id}`}>View</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-xs text-muted-foreground">{d.projectName}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={statusVariant[d.status as keyof typeof statusVariant] ?? 'secondary'}>{d.status}</Badge>
                {d.recommended !== '—' && (
                  <span className="text-xs text-muted-foreground">Recommended: {d.recommended}</span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Due {d.dueDate}
                </span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon-sm" title="Comments">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  {d.status === 'pending' && (
                    <Button variant="ghost" size="icon-sm" title="Approve" asChild>
                      <Link to={`/dashboard/decisions/${d.id}/approve`}>
                        <CheckCircle2 className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockDecisions.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold">No decisions yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Create your first decision to share options and capture client approvals.
            </p>
            <Button asChild className="mt-4">
              <Link to="/dashboard/decisions/new">Create decision</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
