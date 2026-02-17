import { useParams, Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ClipboardList, Users, FileText, MessageSquare, ArrowRight } from 'lucide-react'

const mockProject = {
  id: '1',
  name: 'Riverside Residence',
  status: 'active',
  phases: [
    { id: '1', name: 'Schematic Design', status: 'complete' },
    { id: '2', name: 'Design Development', status: 'current' },
    { id: '3', name: 'Construction Docs', status: 'upcoming' },
  ],
  decisionCount: 12,
  pendingApprovals: 3,
  teamCount: 5,
  recentActivity: [
    { id: '1', text: 'Decision "Fixture package A" approved', time: '2 hours ago' },
    { id: '2', text: 'Comment on "Kitchen layout"', time: '5 hours ago' },
  ],
}

export function ProjectOverviewPage() {
  const { projectId } = useParams<{ projectId: string }>()

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{mockProject.name}</h1>
          <p className="text-muted-foreground mt-1">Project overview and open actions</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to={`/dashboard/projects/${projectId}/decisions`}>Decision Log</Link>
          </Button>
          <Button asChild>
            <Link to={`/dashboard/projects/${projectId}/decisions/new`}>New decision</Link>
          </Button>
        </div>
      </div>

      {/* Phase timeline snapshot */}
      <Card>
        <CardHeader>
          <CardTitle>Phase timeline</CardTitle>
          <CardDescription>Current phase and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {mockProject.phases.map((p) => (
              <div
                key={p.id}
                className={cn(
                  'rounded-lg border px-4 py-2',
                  p.status === 'current'
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-muted/30'
                )}
              >
                <span className="font-medium">{p.name}</span>
                <Badge variant={p.status === 'current' ? 'default' : 'secondary'} className="ml-2 text-xs">
                  {p.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-shadow hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Decisions</CardTitle>
            <ClipboardList className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mockProject.decisionCount}</p>
            <Button variant="link" className="p-0 h-auto text-primary" asChild>
              <Link to={`/dashboard/projects/${projectId}/decisions`}>
                View log <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mockProject.pendingApprovals}</p>
            <Button variant="link" className="p-0 h-auto text-primary" asChild>
              <Link to={`/dashboard/projects/${projectId}/decisions?status=pending`}>View pending</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Team</CardTitle>
            <Users className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mockProject.teamCount}</p>
            <Button variant="link" className="p-0 h-auto text-primary" asChild>
              <Link to={`/dashboard/projects/${projectId}/team`}>Manage</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Files</CardTitle>
            <FileText className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Button variant="link" className="p-0 h-auto text-primary" asChild>
              <Link to={`/dashboard/projects/${projectId}/files`}>Files & drawings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity feed</CardTitle>
          <CardDescription>Recent updates</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {mockProject.recentActivity.map((a) => (
              <li key={a.id} className="flex gap-3">
                <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm">{a.text}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

