/** Admin Dashboard – firm-level admin, billing, security, templates, audit */

/** Dashboard overview stats */
export interface AdminDashboardStats {
  active_projects_count: number
  team_members_count: number
  pending_approvals_count: number
  recent_activity_count: number
}

export interface AdminDashboard {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export type UserRole = 'admin' | 'member' | 'viewer' | 'guest'

export interface AdminUser {
  id: string
  email: string
  full_name?: string
  role: UserRole
  status: 'active' | 'invited' | 'deactivated'
  invited_at?: string
  last_active_at?: string
}

export interface SeatUsage {
  used: number
  total: number
  available: number
  pending_invites?: number
}

export interface InvitePayload {
  email: string
  role: UserRole
  message?: string
  full_name?: string
}

export type BillingPlanId = 'free' | 'team' | 'professional' | 'enterprise'

export interface BillingPlan {
  id: BillingPlanId
  name: string
  seats_included: number
  price_cents: number
  interval: 'month' | 'year'
}

export interface Subscription {
  plan_id: BillingPlanId
  plan_name: string
  status: 'active' | 'past_due' | 'canceled' | 'trialing'
  current_period_end: string
  seats_used: number
  seats_total: number
}

export interface Invoice {
  id: string
  number: string
  amount_cents: number
  status: 'paid' | 'open' | 'void'
  due_date: string
  paid_at?: string
}

export interface SecuritySettings {
  sso_enabled: boolean
  saml_entity_id?: string
  saml_sso_url?: string
  password_min_length: number
  password_require_special: boolean
  two_fa_required: boolean
  two_fa_enforced_for_admins: boolean
}

export interface GlobalTemplate {
  id: string
  name: string
  category: string
  updated_at: string
  is_default: boolean
}

export interface ArchivedProject {
  id: string
  name: string
  archived_at: string
  project_count: number
}

export type AuditEventType =
  | 'login'
  | 'logout'
  | 'user_invited'
  | 'user_deactivated'
  | 'role_changed'
  | 'approval_created'
  | 'approval_signed'
  | 'settings_changed'
  | 'export'

export interface AuditLogEntry {
  id: string
  event_type: AuditEventType
  actor_email?: string
  target_id?: string
  target_type?: string
  metadata?: Record<string, unknown>
  created_at: string
}
