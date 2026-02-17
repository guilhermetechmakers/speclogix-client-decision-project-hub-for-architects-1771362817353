/**
 * Decision Log types for client portal: options, approvals, cost impacts, versioning.
 */

export type DecisionStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'changes_requested'
export type DecisionPhase = 'concept' | 'design' | 'construction' | 'closeout' | 'other'

export interface CostImpact {
  id: string
  option_id: string
  label: string
  amount_cents: number
  currency: string
}

export interface DecisionOption {
  id: string
  decision_id: string
  title: string
  description?: string
  media_urls: string[] // images or PDF URLs
  cost_impacts: CostImpact[]
  sort_order: number
}

export interface DecisionComment {
  id: string
  decision_id: string
  user_id: string
  user_name: string
  body: string
  created_at: string
}

export interface DecisionAuditEntry {
  id: string
  decision_id: string
  action: 'created' | 'updated' | 'approved' | 'rejected' | 'changes_requested' | 'signed' | 'phase_changed'
  user_id: string
  user_name: string
  details?: string
  created_at: string
}

export interface DecisionVersion {
  id: string
  decision_id: string
  version_number: number
  snapshot: Record<string, unknown> // full decision snapshot
  created_at: string
}

export interface DecisionLog {
  id: string
  user_id: string
  project_id?: string
  title: string
  description?: string
  summary?: string
  status: DecisionStatus
  phase: DecisionPhase
  approver_id?: string
  approver_name?: string
  approver_email?: string
  due_date?: string
  recommended_option_id?: string
  selected_option_id?: string
  signed_at?: string
  created_at: string
  updated_at: string
  options?: DecisionOption[]
  comments?: DecisionComment[]
  audit_timeline?: DecisionAuditEntry[]
  versions?: DecisionVersion[]
}

export interface DecisionListFilters {
  phase: DecisionPhase | 'all'
  status: DecisionStatus | 'all'
  approver_id: string | 'all'
  due_date_from?: string
  due_date_to?: string
  search: string
}

export interface CreateDecisionInput {
  title: string
  description?: string
  summary?: string
  phase: DecisionPhase
  approver_id?: string
  approver_email?: string
  due_date?: string
  options: { title: string; description?: string; media_urls?: string[]; cost_impacts?: Omit<CostImpact, 'id' | 'option_id'>[] }[]
  recommended_option_index?: number
}

export interface UpdateDecisionInput extends Partial<CreateDecisionInput> {
  status?: DecisionStatus
  selected_option_id?: string
}
