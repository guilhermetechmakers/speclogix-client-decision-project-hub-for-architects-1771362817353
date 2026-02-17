import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { LayoutTemplate, Archive } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGlobalTemplates, useArchivedProjects } from '@/hooks/use-admin-dashboard'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export interface TemplateProjectManagementProps {
  className?: string
}

export function TemplateProjectManagement({
  className,
}: TemplateProjectManagementProps) {
  const { data: templates = [], isLoading: templatesLoading, isError: templatesError } = useGlobalTemplates()
  const { data: archived = [], isLoading: archivedLoading, isError: archivedError } = useArchivedProjects()

  return (
    <div className={cn('space-y-6 animate-fade-in', className)}>
      {/* Global templates */}
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-primary" aria-hidden />
            Global templates
          </CardTitle>
          <CardDescription>
            Firm-wide templates available for all projects
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {templatesError ? (
            <div className="p-6 text-center text-sm text-destructive">
              Failed to load templates.
            </div>
          ) : templatesLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <LayoutTemplate className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
              <p className="text-muted-foreground font-medium">No global templates</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create templates in Templates & Workflow to make them available here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left font-medium p-3">Name</th>
                    <th className="text-left font-medium p-3">Category</th>
                    <th className="text-left font-medium p-3">Updated</th>
                    <th className="text-left font-medium p-3">Default</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-border hover:bg-accent/50 transition-colors"
                    >
                      <td className="p-3 font-medium">{t.name}</td>
                      <td className="p-3 text-muted-foreground">{t.category}</td>
                      <td className="p-3 text-muted-foreground">
                        {formatDate(t.updated_at)}
                      </td>
                      <td className="p-3">
                        {t.is_default && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Archived projects */}
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-primary" aria-hidden />
            Archived projects
          </CardTitle>
          <CardDescription>
            View and restore archived project data
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {archivedError ? (
            <div className="p-6 text-center text-sm text-destructive">
              Failed to load archived projects.
            </div>
          ) : archivedLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : archived.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Archive className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
              <p className="text-muted-foreground font-medium">No archived projects</p>
              <p className="text-sm text-muted-foreground mt-1">
                Archived projects will appear here for compliance and restore
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left font-medium p-3">Name</th>
                    <th className="text-left font-medium p-3">Archived</th>
                    <th className="text-left font-medium p-3">Items</th>
                  </tr>
                </thead>
                <tbody>
                  {archived.map((a) => (
                    <tr
                      key={a.id}
                      className="border-b border-border hover:bg-accent/50 transition-colors"
                    >
                      <td className="p-3 font-medium">{a.name}</td>
                      <td className="p-3 text-muted-foreground">
                        {formatDate(a.archived_at)}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {a.project_count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
