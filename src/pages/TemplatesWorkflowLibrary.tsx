import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TemplateCatalog,
  TemplateEditor,
  ApplyTemplateModal,
  TemplateVersioningSharing,
} from '@/components/templates-workflow-library'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, LayoutTemplate } from 'lucide-react'
import {
  useTemplates,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
  useDuplicateTemplate,
  useApplyTemplate,
  useShareTemplate,
  useTemplate,
} from '@/hooks/use-templates-workflow-library'
import * as templatesApi from '@/api/templates-workflow-library'
import { useQueryClient } from '@tanstack/react-query'
import type {
  TemplatesWorkflowLibrary,
  TemplateWithDetails,
  CreateTemplateInput,
  UpdateTemplateInput,
  TemplatePhase,
  TemplateDecision,
  TemplateTask,
  TemplateRole,
  TemplateFilePlaceholder,
} from '@/types/templates-workflow-library'
import { toast } from 'sonner'

const TEMPLATES_QUERY_KEY = ['templates-workflow-library'] as const

export function TemplatesWorkflowLibraryPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [editorOpen, setEditorOpen] = useState(false)
  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<TemplatesWorkflowLibrary | null>(null)
  const [selectedForApplyId, setSelectedForApplyId] = useState<string | null>(null)
  const [projectName, setProjectName] = useState('')
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({})
  const [detailId, setDetailId] = useState<string | null>(null)

  const { data: templates = [], isLoading: listLoading, error: listError } = useTemplates()
  const { data: templateDetail } = useTemplate(detailId ?? undefined)
  const createMutation = useCreateTemplate()
  const updateMutation = useUpdateTemplate(editingTemplate?.id ?? '')
  const deleteMutation = useDeleteTemplate()
  const duplicateMutation = useDuplicateTemplate()
  const applyMutation = useApplyTemplate()
  const shareMutation = useShareTemplate(editingTemplate?.id ?? '')

  useEffect(() => {
    document.title = 'Templates & Workflow Library | SpecLogix'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute(
        'content',
        'Reusable project templates and workflow engine. Apply phases, decisions, tasks, and roles when creating projects.'
      )
    }
    return () => {
      document.title = 'SpecLogix'
    }
  }, [])

  const handleNewTemplate = () => {
    setEditingTemplate(null)
    setEditorOpen(true)
  }

  const handleEdit = (template: TemplatesWorkflowLibrary) => {
    setEditingTemplate(template)
    setDetailId(template.id)
    setEditorOpen(true)
  }

  const handleEditorClose = () => {
    setEditorOpen(false)
    setEditingTemplate(null)
    setDetailId(null)
  }

  const handleSaveNew = (data: { title: string; description?: string }) => {
    createMutation.mutate(
      { title: data.title, description: data.description } as CreateTemplateInput,
      {
        onSuccess: (created) => {
          setDetailId(created.id)
          setEditingTemplate(created)
        },
      }
    )
  }

  const handleSaveEdit = (data: { title: string; description?: string }) => {
    if (!editingTemplate) return
    updateMutation.mutate(
      { title: data.title, description: data.description } as UpdateTemplateInput,
      { onSuccess: () => handleEditorClose() }
    )
  }

  const handleDelete = (template: TemplatesWorkflowLibrary) => {
    if (!window.confirm(`Delete "${template.title}"? This cannot be undone.`)) return
    deleteMutation.mutate(template.id, {
      onSuccess: () => {
        if (editingTemplate?.id === template.id) handleEditorClose()
      },
    })
  }

  const handleDuplicate = (template: TemplatesWorkflowLibrary) => {
    duplicateMutation.mutate(template.id, {
      onSuccess: (created) => {
        toast.success(`Created "${created.title}"`)
      },
    })
  }

  const handleApply = (template: TemplatesWorkflowLibrary) => {
    setSelectedForApplyId(template.id)
    setProjectName('')
    setFieldMapping({})
    setApplyModalOpen(true)
  }

  const handleApplySubmit = (payload: { projectName: string; fieldMapping: Record<string, string> }) => {
    const templateId = selectedForApplyId ?? editingTemplate?.id
    if (!templateId || !payload.projectName.trim()) return
    applyMutation.mutate(
      {
        template_id: templateId,
        project_name: payload.projectName.trim(),
        field_mapping: Object.keys(payload.fieldMapping).length ? payload.fieldMapping : undefined,
      },
      {
        onSuccess: (data) => {
          setApplyModalOpen(false)
          setSelectedForApplyId(null)
          setProjectName('')
          setFieldMapping({})
          navigate(`/dashboard/projects/${data.project_id}`)
        },
      }
    )
  }

  const handleShare = (payload: { firm_id?: string; user_ids?: string[] }) => {
    if (editingTemplate) shareMutation.mutate(payload)
  }

  const handleSaveAsNewVersion = (title: string) => {
    if (!editingTemplate?.id) return
    duplicateMutation.mutate(editingTemplate.id, {
      onSuccess: (created) => {
        const newTitle = title.trim() || `${created.title} (copy)`
        templatesApi
          .updateTemplate(created.id, { title: newTitle })
          .then((updated) => {
            queryClient.invalidateQueries({ queryKey: TEMPLATES_QUERY_KEY })
            queryClient.invalidateQueries({ queryKey: ['templates-workflow-library', created.id] })
            setDetailId(updated.id)
            setEditingTemplate(updated)
          })
          .catch(() => {})
      },
    })
  }

  const handlePhasesChange = (phases: TemplatePhase[]) => {
    if (!editingTemplate?.id) return
    updateMutation.mutate({ phases })
  }
  const handleDecisionsChange = (decisions: TemplateDecision[]) => {
    if (!editingTemplate?.id) return
    updateMutation.mutate({ default_decisions: decisions })
  }
  const handleTasksChange = (tasks: TemplateTask[]) => {
    if (!editingTemplate?.id) return
    updateMutation.mutate({ tasks })
  }
  const handleRolesChange = (roles: TemplateRole[]) => {
    if (!editingTemplate?.id) return
    updateMutation.mutate({ roles })
  }
  const handleFilePlaceholdersChange = (placeholders: TemplateFilePlaceholder[]) => {
    if (!editingTemplate?.id) return
    updateMutation.mutate({ file_placeholders: placeholders })
  }

  const detailTemplate = (templateDetail ?? editingTemplate) as TemplateWithDetails | null

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-foreground">
            Templates & Workflow Library
          </h1>
          <p className="text-muted-foreground mt-1 text-[15px] leading-relaxed max-w-xl">
            Reusable project templates (residential remodel, commercial fit-out) and decision templates to accelerate setup and ensure consistency.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setApplyModalOpen(true)}
            variant="outline"
            className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Create project from template
          </Button>
          <Button
            onClick={handleNewTemplate}
            className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" /> New template
          </Button>
        </div>
      </div>

      {listError && (
        <Card className="border-destructive/50">
          <CardContent className="py-6 text-center">
            <p className="text-destructive font-medium">Failed to load templates.</p>
            <p className="text-sm text-muted-foreground mt-1">Check your connection and try again.</p>
          </CardContent>
        </Card>
      )}

      {!listError && (
        <>
          <TemplateCatalog
            templates={templates}
            isLoading={listLoading}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onApply={handleApply}
          />

          {listLoading === false && templates.length === 0 && (
            <Card className="border-dashed border-2 rounded-2xl bg-card/50">
              <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="rounded-2xl bg-muted/50 p-6 mb-4">
                  <LayoutTemplate className="h-14 w-14 text-muted-foreground" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold">No templates yet</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm leading-relaxed">
                  Create or import a template to clone for new projects. Add phases, default decisions, tasks, and roles.
                </p>
                <Button
                  className="mt-6 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  onClick={handleNewTemplate}
                >
                  <Plus className="h-4 w-4 mr-2" /> Create template
                </Button>
              </CardContent>
            </Card>
          )}

          {editorOpen && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <TemplateEditor
                  template={detailTemplate}
                  isLoading={Boolean(editingTemplate && !templateDetail && detailId)}
                  onSave={editingTemplate ? handleSaveEdit : handleSaveNew}
                  onPhasesChange={handlePhasesChange}
                  onDecisionsChange={handleDecisionsChange}
                  onTasksChange={handleTasksChange}
                  onRolesChange={handleRolesChange}
                  onFilePlaceholdersChange={handleFilePlaceholdersChange}
                  isSaving={createMutation.isPending || updateMutation.isPending}
                />
              </div>
              <div>
                {editingTemplate && (
                  <TemplateVersioningSharing
                    template={editingTemplate}
                    onSaveAsNewVersion={handleSaveAsNewVersion}
                    onShare={handleShare}
                    isSaving={duplicateMutation.isPending}
                    isSharing={shareMutation.isPending}
                  />
                )}
              </div>
            </div>
          )}
        </>
      )}

      <ApplyTemplateModal
        open={applyModalOpen}
        onOpenChange={setApplyModalOpen}
        templates={templates}
        selectedTemplateId={selectedForApplyId ?? editingTemplate?.id ?? null}
        onSelectTemplate={setSelectedForApplyId}
        projectName={projectName}
        onProjectNameChange={setProjectName}
        fieldMapping={fieldMapping}
        onFieldMappingChange={setFieldMapping}
        onSubmit={handleApplySubmit}
        isSubmitting={applyMutation.isPending}
      />
    </div>
  )
}

export default TemplatesWorkflowLibraryPage
