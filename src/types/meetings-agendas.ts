/**
 * Meetings & Agendas types: meetings, agenda items, attendees, minutes, action items.
 * DB table: meetings_&_agendas (id, user_id, title, description, status, created_at, updated_at).
 * Extended fields for agenda builder, invite sync, minutes, and export are supported via API.
 */

export type MeetingStatus = 'draft' | 'scheduled' | 'completed' | 'cancelled' | 'active'

export interface AgendaTopic {
  id: string
  title: string
  owner_id?: string
  owner_name?: string
  duration_minutes?: number
  sort_order: number
  linked_decision_id?: string
  linked_decision_title?: string
  linked_file_ids?: string[]
  linked_file_names?: string[]
  notes?: string
}

export interface MeetingAttendee {
  id: string
  email: string
  name?: string
  role?: string
  status?: 'invited' | 'accepted' | 'declined'
}

export interface MeetingActionItem {
  id: string
  title: string
  assignee_id?: string
  assignee_name?: string
  due_date?: string
  completed_at?: string
  converted_to_task_id?: string
  converted_to_decision_id?: string
  created_at: string
}

/** Action item with status for Minutes & Actions panel */
export type ActionItemStatus = 'open' | 'in_progress' | 'done'

export interface ActionItem {
  id: string
  meeting_id: string
  title: string
  description?: string
  assignee_id?: string
  assignee_name?: string
  due_date?: string
  status: ActionItemStatus
  converted_to_task_id?: string
  converted_to_decision_id?: string
  created_at: string
}

export interface CreateActionItemInput {
  meeting_id: string
  title: string
  description?: string
  assignee_id?: string
  assignee_name?: string
  due_date?: string
}

/** Core record matching DB table meetings_&_agendas */
export interface MeetingsAgendaRecord {
  id: string
  user_id: string
  title: string
  description?: string
  status: MeetingStatus
  created_at: string
  updated_at: string
}

/** Full meeting with agenda, attendees, minutes, actions (API shape) */
export interface MeetingWithDetails extends MeetingsAgendaRecord {
  scheduled_at?: string
  location?: string
  timezone?: string
  agenda_topics?: AgendaTopic[]
  /** Embedded agenda items (same data as agenda_topics, API may use either key) */
  agenda_items?: AgendaItem[]
  attendees?: MeetingAttendee[]
  minutes?: string
  action_items?: ActionItem[]
  linked_item_count?: number
}

export interface CreateMeetingInput {
  title: string
  description?: string
  status?: MeetingStatus
  scheduled_at?: string
  location?: string
  timezone?: string
  agenda_topics?: Omit<AgendaTopic, 'id'>[]
  attendees?: Omit<MeetingAttendee, 'id'>[]
}

export interface UpdateMeetingInput {
  title?: string
  description?: string
  status?: MeetingStatus
  scheduled_at?: string
  location?: string
  timezone?: string
  agenda_topics?: AgendaTopic[]
  attendees?: MeetingAttendee[]
  minutes?: string
  action_items?: ActionItem[]
}

export interface MeetingListFilters {
  status?: MeetingStatus | 'all'
  from_date?: string
  to_date?: string
  search?: string
}

/** Alias for list filters used by hooks */
export type MeetingsAgendaListFilters = MeetingListFilters

/** Alias for list/detail used by components */
export type MeetingsAgenda = MeetingWithDetails

/** Agenda item (topic) for Agenda Builder */
export interface AgendaItem {
  id: string
  meeting_id: string
  title: string
  description?: string
  owner_id?: string
  owner_name?: string
  duration_minutes?: number
  sort_order: number
  linked_decision_id?: string
  linked_decision_title?: string
  linked_file_ids?: string[]
  linked_file_names?: string[]
  created_at: string
  updated_at: string
}

export interface CreateAgendaItemInput {
  meeting_id: string
  title: string
  description?: string
  owner_id?: string
  owner_name?: string
  duration_minutes?: number
  sort_order?: number
  linked_decision_id?: string
  linked_file_ids?: string[]
}

export interface CreateMeetingsAgendaInput {
  title: string
  description?: string
  status?: MeetingStatus
  scheduled_at?: string
  location?: string
  timezone?: string
}

export interface UpdateMeetingsAgendaInput {
  title?: string
  description?: string
  status?: MeetingStatus
  scheduled_at?: string
  location?: string
  timezone?: string
}

export interface CreateAttendeeInput {
  meeting_id: string
  email: string
  name?: string
  role?: string
}

/** Meeting note (minutes) record */
export interface MeetingNote {
  id: string
  meeting_id: string
  content: string
  created_at: string
  updated_at: string
}
