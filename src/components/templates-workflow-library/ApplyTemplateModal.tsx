import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { TemplatesWorkflowLibrary } from '@/types/templates-workflow-library'
import { LayoutTemplate, ArrowRight } from 'lucide-react'

export interface ApplyTemplateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  templates: TemplatesWorkflowLibrary[]
  selectedTemplateId: string | null
  onSelectTemplate: (id: string | null) => void
  projectName: string
  onProjectNameChange: (name: string) => void
  fieldMapping: Record<string, string>
  onFieldMappingChange: (mapping: Record<string, string>) => void
  onSubmit: (payload: { projectName: string; fieldMapping: Record<string, string> }) => void
  isSubmitting?: boolean
}

const DEFAULT_FIELDS = [
  { key: 'project_name', label: 'Project name', placeholder: 'My Project' },
  { key: 'client_name', label: 'Client name', placeholder: 'Client' },
  { key: 'address', label: 'Address', placeholder: '123 Main St' },
]

export function ApplyTemplateModal({
  open,
  onOpenChange,
  templates,
  selectedTemplateId,
  onSelectTemplate,
  projectName,
  onProjectNameChange,
  fieldMapping,
  onFieldMappingChange,
  onSubmit,
  isSubmitting,
}: ApplyTemplateModalProps) {
  const [localProjectName, setLocalProjectName] = useState(projectName)
  const [localMapping, setLocalMapping] = useState<Record<string, string>>(fieldMapping)

  useEffect(() => {
    if (open) {
      setLocalProjectName(projectName)
      setLocalMapping(fieldMapping)
    }
  }, [open, projectName, fieldMapping])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onProjectNameChange(localProjectName)
    onFieldMappingChange(localMapping)
    onSubmit({ projectName: localProjectName, fieldMapping: localMapping })
  }

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" showClose>
        <DialogHeader>
          <DialogTitle>Create project from template</DialogTitle>
          <DialogDescription>
            Choose a template and map fields for your new project. Phases, decisions, tasks, and roles will be applied automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Choose template</Label>
            <div className="grid gap-2 sm:grid-cols-2 max-h-48 overflow-y-auto pr-2">
              {templates.filter((t) => t.status === 'active').map((template) => (
                <Card
                  key={template.id}
                  className={cn(
                    'cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]',
                    selectedTemplateId === template.id
                      ? 'ring-2 ring-primary border-primary/50 shadow-card-hover'
                      : 'hover:shadow-card-hover hover:border-primary/20'
                  )}
                  onClick={() => onSelectTemplate(template.id)}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <LayoutTemplate className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{template.title}</p>
                      {template.description && (
                        <p className="text-xs text-muted-foreground truncate">{template.description}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {templates.filter((t) => t.status === 'active').length === 0 && (
              <p className="text-sm text-muted-foreground">No active templates. Create one first.</p>
            )}
          </div>

          {selectedTemplate && (
            <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4 animate-fade-in">
              <h4 className="font-medium flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-primary" />
                Map fields for &quot;{selectedTemplate.title}&quot;
              </h4>
              <div className="space-y-2">
                <Label htmlFor="apply-project-name">Project name</Label>
                <Input
                  id="apply-project-name"
                  value={localProjectName}
                  onChange={(e) => setLocalProjectName(e.target.value)}
                  placeholder="e.g. Smith Residence Remodel"
                  required
                />
              </div>
              <div className="space-y-3">
                <Label>Optional field mapping</Label>
                {DEFAULT_FIELDS.filter((f) => f.key !== 'project_name').map((field) => (
                  <div key={field.key} className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Label htmlFor={`map-${field.key}`} className="sm:w-28 text-muted-foreground">
                      {field.label}
                    </Label>
                    <Input
                      id={`map-${field.key}`}
                      value={localMapping[field.key] ?? ''}
                      onChange={(e) =>
                        setLocalMapping((m) => ({ ...m, [field.key]: e.target.value }))
                      }
                      placeholder={field.placeholder}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedTemplateId || !localProjectName.trim() || isSubmitting}
              className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? 'Creating…' : 'Create project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
