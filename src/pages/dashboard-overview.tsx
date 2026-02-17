import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  FolderKanban,
  ClipboardList,
  MessageSquare,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
} from 'lucide-react'

const mockProjects = [
  { id: '1', name: 'Riverside Residence', pendingApprovals: 3, status: 'active' },
  { id: '2', name: 'Downtown Office Fit-out', pendingApprovals: 0, status: 'active' },
  { id: '3', name: 'Lake House Renovation', pendingApprovals: 1, status: 'active' },
]

const mockActivity = [
  { id: '1', text: 'Decision "Fixture package A" approved by client', time: '2 hours ago' },
  { id: '2', text: 'New comment on "Kitchen layout"', time: '5 hours ago' },
  { id: '3', text: 'Project "Riverside Residence" timeline updated', time: '1 day ago' },
]

export function DashboardOverviewPage() {
  const isLoading = false

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">At-a-glance prioritization of approvals and project health.</p>
      </div>

      {/* Pending approvals banner */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">4 decisions pending approval</p>
              <p className="text-sm text-muted-foreground">Across 2 projects</p>
            </div>
          </div>
          <Button asChild>
            <Link to="/dashboard/approvals">View pending approvals <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </CardContent>
      </Card>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-shadow hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <span className="text-2xl font-bold">3</span>
            )}
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <span className="text-2xl font-bold">4</span>
            )}
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Decisions this week</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <span className="text-2xl font-bold">7</span>
            )}
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unread messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <span className="text-2xl font-bold">2</span>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Recent projects and pending items</CardDescription>
            </div>
            <Button asChild size="sm">
              <Link to="/dashboard/projects">
                <Plus className="h-4 w-4 mr-1" /> New project
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : (
              <ul className="space-y-2">
                {mockProjects.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/dashboard/projects/${p.id}`}
                      className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                    >
                      <span className="font-medium">{p.name}</span>
                      <div className="flex items-center gap-2">
                        {p.pendingApprovals > 0 && (
                          <Badge variant="warning">{p.pendingApprovals} pending</Badge>
                        )}
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest updates across your projects</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <ul className="space-y-4">
                {mockActivity.map((a) => (
                  <li key={a.id} className="flex gap-3">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-primary shrink-0" />
                    <div>
                      <p className="text-sm">{a.text}</p>
                      <p className="text-xs text-muted-foreground">{a.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
