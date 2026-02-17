/**
 * Templates & Workflow Library types for project templates, phases, decisions, tasks, roles.
 */

export interface TemplatesWorkflowLibrary {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
  version?: number
  shared_with_firm?: boolean
  phases?: TemplatePhase[]
  default_decisions?: TemplateDecision[]
  tasks?: TemplateTask[]
  roles?: TemplateRole[]
  file_placeholders?: TemplateFilePlaceholder[]
}

export interface TemplatePhase {
  id: string
  template_id: string
  name: string
  sort_order: number
}

export interface TemplateDecision {
  id: string
  template_id: string
  title: string
  description?: string
  phase_id?: string
  sort_order: number
}

export interface TemplateTask {
  id: string
  template_id: string
  title: string
  phase_id?: string
  sort_order: number
}

export interface TemplateRole {
  id: string
  template_id: string
  name: string
  description?: string
  sort_order: number
}

export interface TemplateFilePlaceholder {
  id: string
  template_id: string
  name: string
  category?: string
  sort_order: number
}

export interface TemplateWithDetails extends TemplatesWorkflowLibrary {
  phases?: TemplatePhase[]
  default_decisions?: TemplateDecision[]
  tasks?: TemplateTask[]
  roles?: TemplateRole[]
  file_placeholders?: TemplateFilePlaceholder[]
}

export interface CreateTemplateInput {
  title: string
  description?: string
  status?: string
}

export interface UpdateTemplateInput extends Partial<CreateTemplateInput> {
  phases?: TemplatePhase[]
  default_decisions?: TemplateDecision[]
  tasks?: TemplateTask[]
  roles?: TemplateRole[]
  file_placeholders?: TemplateFilePlaceholder[]
  shared_with_firm?: boolean
}

export interface ApplyTemplateInput {
  template_id: string
  project_name: string
  field_mapping?: Record<string, string>
}

export interface ApplyTemplateMapping {
  template_id: string
  project_name?: string
  client_name?: string
  start_date?: string
  field_mappings?: Record<string, string>
}
