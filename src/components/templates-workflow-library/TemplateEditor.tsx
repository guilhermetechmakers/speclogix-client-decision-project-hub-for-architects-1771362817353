import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Layers,
  ClipboardList,
  CheckSquare,
  Users,
  FolderOpen,
  Plus,
  GripVertical,
} from 'lucide-react'
import type {
  TemplateWithDetails,
  TemplatePhase,
  TemplateDecision,
  TemplateTask,
  TemplateRole,
  TemplateFilePlaceholder,
} from '@/types/templates-workflow-library'

export interface TemplateEditorProps {
  template: TemplateWithDetails | null
  isLoading?: boolean
  onSave: (data: { title: string; description?: string }) => void
  onPhasesChange?: (phases: TemplatePhase[]) => void
  onDecisionsChange?: (decisions: TemplateDecision[]) => void
  onTasksChange?: (tasks: TemplateTask[]) => void
  onRolesChange?: (roles: TemplateRole[]) => void
  onFilePlaceholdersChange?: (placeholders: TemplateFilePlaceholder[]) => void
  isSaving?: boolean
}

function SectionList<T extends { id: string; name?: string; title?: string; sort_order: number }>({
  items,
  emptyMessage,
  onAdd,
  onRemove,
  renderItem,
}: {
  items: T[]
  emptyMessage: string
  onAdd: () => void
  onRemove: (index: number) => void
  renderItem: (item: T, index: number) => React.ReactNode
}) {
  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center rounded-lg border border-dashed border-border">
          {emptyMessage}
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="flex items-center gap-2 rounded-lg border border-border bg-background p-3 transition-shadow hover:shadow-sm"
            >
              <span className="text-muted-foreground cursor-grab" aria-hidden>
                <GripVertical className="h-4 w-4" />
              </span>
              {renderItem(item, index)}
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-muted-foreground hover:text-destructive min-w-[44px] min-h-[44px]"
                onClick={() => onRemove(index)}
                aria-label="Remove"
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
      <Button type="button" variant="outline" size="sm" onClick={onAdd} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Add
      </Button>
    </div>
  )
}

export function TemplateEditor({
  template,
  isLoading,
  onSave,
  onPhasesChange,
  onDecisionsChange,
  onTasksChange,
  onRolesChange,
  onFilePlaceholdersChange,
  isSaving,
}: TemplateEditorProps) {
  const [title, setTitle] = useState(template?.title ?? '')
  const [description, setDescription] = useState(template?.description ?? '')

  useEffect(() => {
    if (template) {
      setTitle(template.title)
      setDescription(template.description ?? '')
    }
  }, [template?.id, template?.title, template?.description])

  const phases = template?.phases ?? []
  const decisions = template?.default_decisions ?? []
  const tasks = template?.tasks ?? []
  const roles = template?.roles ?? []
  const placeholders = template?.file_placeholders ?? []

  const handleSave = () => {
    onSave({ title, description: description || undefined })
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-24 w-full" />
        <Tabs defaultValue="phases" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </TabsList>
          <TabsContent value="phases" className="mt-4">
            <Skeleton className="h-48 w-full" />
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  if (!template) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center text-muted-foreground">
          Select a template to edit phases, decisions, tasks, roles, and file placeholders.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Template details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template-title">Title</Label>
            <Input
              id="template-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Residential Remodel"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-description">Description</Label>
            <Textarea
              id="template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of when to use this template"
              rows={3}
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
            className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSaving ? 'Saving…' : 'Save changes'}
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="phases" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto flex-wrap gap-1 p-1">
          <TabsTrigger value="phases" className="gap-2">
            <Layers className="h-4 w-4" />
            Phases ({phases.length})
          </TabsTrigger>
          <TabsTrigger value="decisions" className="gap-2">
            <ClipboardList className="h-4 w-4" />
            Decisions ({decisions.length})
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <CheckSquare className="h-4 w-4" />
            Tasks ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Users className="h-4 w-4" />
            Roles ({roles.length})
          </TabsTrigger>
          <TabsTrigger value="files" className="gap-2">
            <FolderOpen className="h-4 w-4" />
            File placeholders ({placeholders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="phases" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Phases</CardTitle>
              <p className="text-sm text-muted-foreground">Default project phases for this template.</p>
            </CardHeader>
            <CardContent>
              <SectionList
                items={phases}
                emptyMessage="No phases. Add phases like Concept, Design, Construction, Closeout."
                onAdd={() =>
                  onPhasesChange?.([
                    ...phases,
                    {
                      id: `new-${Date.now()}`,
                      template_id: template.id,
                      name: 'New phase',
                      sort_order: phases.length,
                    },
                  ])
                }
                onRemove={(i) => onPhasesChange?.(phases.filter((_, idx) => idx !== i))}
                renderItem={(item) => (
                  <span className="flex-1 font-medium">
                    {(item as TemplatePhase).name}
                  </span>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Default decisions</CardTitle>
              <p className="text-sm text-muted-foreground">Decision templates to create when using this template.</p>
            </CardHeader>
            <CardContent>
              <SectionList
                items={decisions}
                emptyMessage="No default decisions."
                onAdd={() =>
                  onDecisionsChange?.([
                    ...decisions,
                    {
                      id: `new-${Date.now()}`,
                      template_id: template.id,
                      title: 'New decision',
                      sort_order: decisions.length,
                    },
                  ])
                }
                onRemove={(i) => onDecisionsChange?.(decisions.filter((_, idx) => idx !== i))}
                renderItem={(item) => (
                  <span className="flex-1 font-medium">
                    {(item as TemplateDecision).title}
                  </span>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tasks</CardTitle>
              <p className="text-sm text-muted-foreground">Default tasks for this template.</p>
            </CardHeader>
            <CardContent>
              <SectionList
                items={tasks}
                emptyMessage="No default tasks."
                onAdd={() =>
                  onTasksChange?.([
                    ...tasks,
                    {
                      id: `new-${Date.now()}`,
                      template_id: template.id,
                      title: 'New task',
                      sort_order: tasks.length,
                    },
                  ])
                }
                onRemove={(i) => onTasksChange?.(tasks.filter((_, idx) => idx !== i))}
                renderItem={(item) => (
                  <span className="flex-1 font-medium">
                    {(item as TemplateTask).title}
                  </span>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Roles</CardTitle>
              <p className="text-sm text-muted-foreground">Roles to assign on projects created from this template.</p>
            </CardHeader>
            <CardContent>
              <SectionList
                items={roles}
                emptyMessage="No roles defined."
                onAdd={() =>
                  onRolesChange?.([
                    ...roles,
                    {
                      id: `new-${Date.now()}`,
                      template_id: template.id,
                      name: 'New role',
                      sort_order: roles.length,
                    },
                  ])
                }
                onRemove={(i) => onRolesChange?.(roles.filter((_, idx) => idx !== i))}
                renderItem={(item) => (
                  <span className="flex-1 font-medium">
                    {(item as TemplateRole).name}
                  </span>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">File placeholders</CardTitle>
              <p className="text-sm text-muted-foreground">Default folders or file placeholders for new projects.</p>
            </CardHeader>
            <CardContent>
              <SectionList
                items={placeholders}
                emptyMessage="No file placeholders."
                onAdd={() =>
                  onFilePlaceholdersChange?.([
                    ...placeholders,
                    {
                      id: `new-${Date.now()}`,
                      template_id: template.id,
                      name: 'New placeholder',
                      sort_order: placeholders.length,
                    },
                  ])
                }
                onRemove={(i) => onFilePlaceholdersChange?.(placeholders.filter((_, idx) => idx !== i))}
                renderItem={(item) => (
                  <span className="flex-1 font-medium">
                    {(item as TemplateFilePlaceholder).name}
                  </span>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
