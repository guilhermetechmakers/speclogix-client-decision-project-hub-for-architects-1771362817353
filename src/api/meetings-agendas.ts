import { api } from '@/lib/api'
import type {
  MeetingWithDetails,
  MeetingsAgendaRecord,
  CreateMeetingInput,
  UpdateMeetingInput,
  MeetingListFilters,
  MeetingsAgendaListFilters,
  CreateMeetingsAgendaInput,
  UpdateMeetingsAgendaInput,
  CreateAgendaItemInput,
  CreateActionItemInput,
  CreateAttendeeInput,
  ActionItemStatus,
} from '@/types/meetings-agendas'
import type { AgendaItem, ActionItem, MeetingAttendee, MeetingNote } from '@/types/meetings-agendas'

const BASE = '/meetings-agendas'

function buildQuery(filters: MeetingListFilters | MeetingsAgendaListFilters): string {
  const params = new URLSearchParams()
  if (filters.status && filters.status !== 'all') params.set('status', filters.status)
  if (filters.from_date) params.set('from_date', filters.from_date)
  if (filters.to_date) params.set('to_date', filters.to_date)
  if (filters.search?.trim()) params.set('q', filters.search.trim())
  const q = params.toString()
  return q ? `?${q}` : ''
}

export async function fetchMeetings(filters: MeetingListFilters = {}): Promise<MeetingWithDetails[]> {
  const query = buildQuery(filters)
  return api.get<MeetingWithDetails[]>(`${BASE}${query}`)
}

export async function fetchMeeting(id: string): Promise<MeetingWithDetails> {
  return api.get<MeetingWithDetails>(`${BASE}/${id}`)
}

export async function fetchMeetingsAgendas(filters: MeetingsAgendaListFilters): Promise<MeetingWithDetails[]> {
  return fetchMeetings(filters)
}

export async function fetchMeetingsAgenda(id: string): Promise<MeetingWithDetails> {
  return fetchMeeting(id)
}

export async function createMeeting(data: CreateMeetingInput): Promise<MeetingsAgendaRecord> {
  return api.post<MeetingsAgendaRecord>(BASE, data)
}

export async function createMeetingsAgenda(data: CreateMeetingsAgendaInput): Promise<MeetingsAgendaRecord> {
  return api.post<MeetingsAgendaRecord>(BASE, data)
}

export async function updateMeeting(id: string, data: UpdateMeetingInput): Promise<MeetingWithDetails> {
  return api.patch<MeetingWithDetails>(`${BASE}/${id}`, data)
}

export async function updateMeetingsAgenda(id: string, data: UpdateMeetingsAgendaInput): Promise<MeetingWithDetails> {
  return api.patch<MeetingWithDetails>(`${BASE}/${id}`, data)
}

export async function deleteMeeting(id: string): Promise<void> {
  return api.delete(`${BASE}/${id}`)
}

export async function deleteMeetingsAgenda(id: string): Promise<void> {
  return api.delete(`${BASE}/${id}`)
}

export async function fetchAgendaItems(meetingId: string): Promise<AgendaItem[]> {
  return api.get<AgendaItem[]>(`${BASE}/${meetingId}/agenda-items`)
}

export async function createAgendaItem(data: CreateAgendaItemInput): Promise<AgendaItem> {
  return api.post<AgendaItem>(`${BASE}/${data.meeting_id}/agenda-items`, data)
}

export async function updateAgendaItem(meetingId: string, itemId: string, data: Partial<CreateAgendaItemInput>): Promise<AgendaItem> {
  return api.patch<AgendaItem>(`${BASE}/${meetingId}/agenda-items/${itemId}`, data)
}

export async function deleteAgendaItem(meetingId: string, itemId: string): Promise<void> {
  return api.delete(`${BASE}/${meetingId}/agenda-items/${itemId}`)
}

export async function fetchActionItems(meetingId: string): Promise<ActionItem[]> {
  return api.get<ActionItem[]>(`${BASE}/${meetingId}/action-items`)
}

export async function createActionItem(data: CreateActionItemInput): Promise<ActionItem> {
  return api.post<ActionItem>(`${BASE}/${data.meeting_id}/action-items`, data)
}

export async function updateActionItem(
  meetingId: string,
  itemId: string,
  data: Partial<CreateActionItemInput> & { status?: ActionItemStatus }
): Promise<ActionItem> {
  return api.patch<ActionItem>(`${BASE}/${meetingId}/action-items/${itemId}`, data)
}

export async function deleteActionItem(meetingId: string, itemId: string): Promise<void> {
  return api.delete(`${BASE}/${meetingId}/action-items/${itemId}`)
}

export async function fetchAttendees(meetingId: string): Promise<MeetingAttendee[]> {
  return api.get<MeetingAttendee[]>(`${BASE}/${meetingId}/attendees`)
}

export async function createAttendee(data: CreateAttendeeInput): Promise<MeetingAttendee> {
  return api.post<MeetingAttendee>(`${BASE}/${data.meeting_id}/attendees`, data)
}

export async function deleteAttendee(meetingId: string, attendeeId: string): Promise<void> {
  return api.delete(`${BASE}/${meetingId}/attendees/${attendeeId}`)
}

export async function fetchMeetingNotes(meetingId: string): Promise<MeetingNote[]> {
  return api.get<MeetingNote[]>(`${BASE}/${meetingId}/notes`)
}

export async function upsertMeetingNotes(meetingId: string, content: string): Promise<MeetingNote> {
  return api.post<MeetingNote>(`${BASE}/${meetingId}/notes`, { content })
}

export async function exportMeetingNotesPdf(meetingId: string): Promise<Blob> {
  const API_BASE = import.meta.env.VITE_API_URL ?? '/api'
  const token = localStorage.getItem('access_token')
  const headers: HeadersInit = { Accept: 'application/pdf' }
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${BASE}/${meetingId}/export/pdf`, {
    method: 'GET',
    headers,
  })
  if (!res.ok) throw new Error(res.statusText)
  return res.blob()
}

export async function exportMeetingNotesWord(meetingId: string): Promise<Blob> {
  const API_BASE = import.meta.env.VITE_API_URL ?? '/api'
  const token = localStorage.getItem('access_token')
  const headers: HeadersInit = { Accept: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${BASE}/${meetingId}/export/docx`, {
    method: 'GET',
    headers,
  })
  if (!res.ok) throw new Error(res.statusText)
  return res.blob()
}

/** Generate ICS content for calendar invite (client-side) */
export function generateIcsContent(meeting: MeetingWithDetails): string {
  const start = meeting.scheduled_at ? new Date(meeting.scheduled_at) : new Date()
  const end = new Date(start.getTime() + 60 * 60 * 1000)
  const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const escape = (s: string) => s.replace(/\n/g, '\\n').replace(/,/g, '\\,')
  const title = escape(meeting.title)
  const desc = meeting.description ? escape(meeting.description) : ''
  const loc = meeting.location ? escape(meeting.location) : ''
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SpecLogix//Meetings//EN',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${loc}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

/** Build ICS blob for download (used by InviteCalendarSync) */
export function buildIcsBlob(meeting: MeetingWithDetails): Blob {
  return new Blob([generateIcsContent(meeting)], { type: 'text/calendar;charset=utf-8' })
}
