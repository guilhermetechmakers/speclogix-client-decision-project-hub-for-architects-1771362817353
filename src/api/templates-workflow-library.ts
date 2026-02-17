import { api } from '@/lib/api'
import type {
  TemplatesWorkflowLibrary,
  TemplateWithDetails,
  CreateTemplateInput,
  UpdateTemplateInput,
  ApplyTemplateInput,
} from '@/types/templates-workflow-library'

const BASE = '/templates-workflow-library'

export async function fetchTemplates(): Promise<TemplatesWorkflowLibrary[]> {
  return api.get<TemplatesWorkflowLibrary[]>(BASE)
}

export async function fetchTemplate(id: string): Promise<TemplateWithDetails> {
  return api.get<TemplateWithDetails>(`${BASE}/${id}`)
}

export async function createTemplate(data: CreateTemplateInput): Promise<TemplatesWorkflowLibrary> {
  return api.post<TemplatesWorkflowLibrary>(BASE, data)
}

export async function updateTemplate(
  id: string,
  data: UpdateTemplateInput
): Promise<TemplatesWorkflowLibrary> {
  return api.patch<TemplatesWorkflowLibrary>(`${BASE}/${id}`, data)
}

export async function deleteTemplate(id: string): Promise<void> {
  return api.delete(`${BASE}/${id}`)
}

export async function duplicateTemplate(id: string): Promise<TemplatesWorkflowLibrary> {
  return api.post<TemplatesWorkflowLibrary>(`${BASE}/${id}/duplicate`, {})
}

export async function applyTemplate(data: ApplyTemplateInput): Promise<{ project_id: string }> {
  return api.post<{ project_id: string }>(`${BASE}/apply`, data)
}

export async function shareTemplate(
  id: string,
  payload: { firm_id?: string; user_ids?: string[] }
): Promise<void> {
  return api.post<void>(`${BASE}/${id}/share`, payload)
}
