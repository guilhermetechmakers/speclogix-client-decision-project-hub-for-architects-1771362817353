/**
 * Approvals & E-signatures: workflow config, inbox, e-sign capture, signed document archive.
 * DB table: approvals_e_signatures (id, user_id, title, description, status, created_at, updated_at).
 */

export type ApprovalStatus = 'active' | 'pending' | 'signed' | 'cancelled' | 'overdue'

/** Core record matching DB table approvals_e_signatures */
export interface ApprovalsESignaturesRecord {
  id: string
  user_id: string
  title: string
  description?: string
  status: ApprovalStatus
  created_at: string
  updated_at: string
}

/** Approval capture type: e-signature or checkbox only */
export type ApprovalType = 'e_sign' | 'checkbox'

/** Approval order: parallel (all at once) or sequential (one after another) */
export type ApprovalOrder = 'parallel' | 'sequential'

/** Workflow configurator: signers, e-sign vs checkbox, order */
export interface ApprovalWorkflowConfig {
  id?: string
  approval_id: string
  require_signers: string[]
  approval_type: ApprovalType
  approval_order: ApprovalOrder
  legal_text?: string
}

export interface CreateApprovalWorkflowInput {
  approval_id: string
  require_signers: string[]
  approval_type: ApprovalType
  approval_order: ApprovalOrder
  legal_text?: string
}

/** Inbox item: pending, reminder, overdue */
export interface PendingApprovalItem {
  id: string
  approval_id: string
  title: string
  description?: string
  signer_email: string
  due_at: string
  status: 'pending' | 'reminder' | 'overdue' | 'signed'
  reminder_sent_at?: string
  created_at: string
}

/** E-sign payload: draw/type, IP, timestamp, legal acceptance */
export interface SignatureCapture {
  signature_data: string
  signature_type: 'draw' | 'type'
  ip_address?: string
  signed_at: string
  legal_text_accepted: boolean
}

/** Signed document archive item */
export interface SignedDocumentItem {
  id: string
  approval_id: string
  title: string
  signer_email: string
  signed_at: string
  ip_address?: string
  document_url?: string
  file_name?: string
  metadata?: Record<string, unknown>
}

export interface CreateApprovalInput {
  title: string
  description?: string
  status?: ApprovalStatus
}

export interface UpdateApprovalInput {
  title?: string
  description?: string
  status?: ApprovalStatus
}

export interface ApprovalsListFilters {
  status?: ApprovalStatus | 'all'
  search?: string
}
