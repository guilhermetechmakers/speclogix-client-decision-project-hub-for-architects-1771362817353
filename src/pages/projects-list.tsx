import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, FolderKanban, ArrowRight } from 'lucide-react'

const mockProjects = [
  { id: '1', name: 'Riverside Residence', status: 'active', pendingApprovals: 3, decisionCount: 12 },
  { id: '2', name: 'Downtown Office Fit-out', status: 'active', pendingApprovals: 0, decisionCount: 8 },
  { id: '3', name: 'Lake House Renovation', status: 'active', pendingApprovals: 1, decisionCount: 5 },
]

export function ProjectsListPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-muted-foreground mt-1">Create and manage projects from templates.</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/projects/new">
            <Plus className="h-4 w-4 mr-2" /> New project
          </Link>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search projects…" className="pl-9" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((p) => (
          <Card
            key={p.id}
            className="group transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FolderKanban className="h-5 w-5" />
                </div>
                <Badge variant={p.pendingApprovals > 0 ? 'warning' : 'secondary'}>{p.status}</Badge>
              </div>
              <CardTitle className="text-lg">
                <Link to={`/dashboard/projects/${p.id}`} className="hover:text-primary hover:underline">
                  {p.name}
                </Link>
              </CardTitle>
              <CardDescription>
                {p.decisionCount} decisions · {p.pendingApprovals} pending approval{p.pendingApprovals !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full group-hover:border-primary" asChild>
                <Link to={`/dashboard/projects/${p.id}`}>
                  Open project <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
