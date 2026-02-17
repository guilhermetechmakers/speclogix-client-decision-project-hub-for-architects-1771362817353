import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LayoutTemplate, Plus } from 'lucide-react'

export function TemplatesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Templates & Workflow Library</h1>
          <p className="text-muted-foreground mt-1">Reusable project patterns for faster setup and consistency.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> New template</Button>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <LayoutTemplate className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold">No templates yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Create or import a template to clone for new projects.</p>
          <Button className="mt-4">Create template</Button>
        </CardContent>
      </Card>
    </div>
  )
}
