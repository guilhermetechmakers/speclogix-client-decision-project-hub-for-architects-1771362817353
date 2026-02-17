import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  MeetingsAgendaListFilters,
  CreateMeetingsAgendaInput,
  UpdateMeetingsAgendaInput,
  CreateAgendaItemInput,
  CreateActionItemInput,
  CreateAttendeeInput,
} from '@/types/meetings-agendas'
import * as api from '@/api/meetings-agendas'

const KEYS = {
  list: (f: MeetingsAgendaListFilters) => ['meetings-agendas', f] as const,
  detail: (id: string) => ['meetings-agendas', id] as const,
  agendaItems: (meetingId: string) => ['meetings-agendas', meetingId, 'agenda-items'] as const,
  actionItems: (meetingId: string) => ['meetings-agendas', meetingId, 'action-items'] as const,
  attendees: (meetingId: string) => ['meetings-agendas', meetingId, 'attendees'] as const,
  notes: (meetingId: string) => ['meetings-agendas', meetingId, 'notes'] as const,
}

export function useMeetingsAgendas(filters: MeetingsAgendaListFilters) {
  return useQuery({
    queryKey: KEYS.list(filters),
    queryFn: () => api.fetchMeetingsAgendas(filters),
  })
}

export function useMeetingsAgenda(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: KEYS.detail(id ?? ''),
    queryFn: () => api.fetchMeetingsAgenda(id!),
    enabled: Boolean(id) && enabled,
  })
}

export function useCreateMeetingsAgenda() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateMeetingsAgendaInput) => api.createMeetingsAgenda(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meetings-agendas'] })
      toast.success('Meeting created')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to create meeting')
    },
  })
}

export function useUpdateMeetingsAgenda(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateMeetingsAgendaInput) => api.updateMeetingsAgenda(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meetings-agendas'] })
      qc.invalidateQueries({ queryKey: KEYS.detail(id) })
      toast.success('Meeting updated')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to update meeting')
    },
  })
}

export function useDeleteMeetingsAgenda() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.deleteMeetingsAgenda(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meetings-agendas'] })
      toast.success('Meeting deleted')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to delete meeting')
    },
  })
}

export function useAgendaItems(meetingId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: KEYS.agendaItems(meetingId ?? ''),
    queryFn: () => api.fetchAgendaItems(meetingId!),
    enabled: Boolean(meetingId) && enabled,
  })
}

export function useCreateAgendaItem(meetingId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAgendaItemInput) => api.createAgendaItem(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meetings-agendas'] })
      qc.invalidateQueries({ queryKey: KEYS.detail(meetingId) })
      qc.invalidateQueries({ queryKey: KEYS.agendaItems(meetingId) })
      toast.success('Agenda item added')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to add agenda item')
    },
  })
}

export function useUpdateAgendaItem(meetingId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: string
      data: Partial<CreateAgendaItemInput>
    }) => api.updateAgendaItem(meetingId, itemId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meetings-agendas'] })
      qc.invalidateQueries({ queryKey: KEYS.detail(meetingId) })
      qc.invalidateQueries({ queryKey: KEYS.agendaItems(meetingId) })
      toast.success('Agenda item updated')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to update agenda item')
    },
  })
}

export function useDeleteAgendaItem(meetingId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) => api.deleteAgendaItem(meetingId, itemId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meetings-agendas'] })
      qc.invalidateQueries({ queryKey: KEYS.detail(meetingId) })
      qc.invalidateQueries({ queryKey: KEYS.agendaItems(meetingId) })
      toast.success('Agenda item removed')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to remove agenda item')
    },
  })
}

export function useActionItems(meetingId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: KEYS.actionItems(meetingId ?? ''),
    queryFn: () => api.fetchActionItems(meetingId!),
    enabled: Boolean(meetingId) && enabled,
  })
}

export function useCreateActionItem(meetingId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateActionItemInput) => api.createActionItem(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meetings-agendas'] })
      qc.invalidateQueries({ queryKey: KEYS.detail(meetingId) })
      qc.invalidateQueries({ queryKey: KEYS.actionItems(meetingId) })
      toast.success('Action item added')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to add action item')
    },
  })
}

export function useUpdateActionItem(meetingId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: string
      data: Parameters<typeof api.updateActionItem>[2]
    }) => api.updateActionItem(meetingId, itemId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meetings-agendas'] })
      qc.invalidateQueries({ queryKey: KEYS.detail(meetingId) })
      qc.invalidateQueries({ queryKey: KEYS.actionItems(meetingId) })
      toast.success('Action item updated')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to update action item')
    },
  })
}

export function useDeleteActionItem(meetingId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (itemId: string) => api.deleteActionItem(meetingId, itemId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meetings-agendas'] })
      qc.invalidateQueries({ queryKey: KEYS.detail(meetingId) })
      qc.invalidateQueries({ queryKey: KEYS.actionItems(meetingId) })
      toast.success('Action item removed')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to remove action item')
    },
  })
}

export function useAttendees(meetingId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: KEYS.attendees(meetingId ?? ''),
    queryFn: () => api.fetchAttendees(meetingId!),
    enabled: Boolean(meetingId) && enabled,
  })
}

export function useCreateAttendee(meetingId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAttendeeInput) => api.createAttendee(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meetings-agendas'] })
      qc.invalidateQueries({ queryKey: KEYS.detail(meetingId) })
      qc.invalidateQueries({ queryKey: KEYS.attendees(meetingId) })
      toast.success('Participant invited')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to invite participant')
    },
  })
}

export function useDeleteAttendee(meetingId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (attendeeId: string) => api.deleteAttendee(meetingId, attendeeId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meetings-agendas'] })
      qc.invalidateQueries({ queryKey: KEYS.detail(meetingId) })
      qc.invalidateQueries({ queryKey: KEYS.attendees(meetingId) })
      toast.success('Participant removed')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to remove participant')
    },
  })
}

export function useMeetingNotes(meetingId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: KEYS.notes(meetingId ?? ''),
    queryFn: () => api.fetchMeetingNotes(meetingId!),
    enabled: Boolean(meetingId) && enabled,
  })
}

export function useUpsertMeetingNotes(meetingId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (content: string) => api.upsertMeetingNotes(meetingId, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['meetings-agendas'] })
      qc.invalidateQueries({ queryKey: KEYS.detail(meetingId) })
      qc.invalidateQueries({ queryKey: KEYS.notes(meetingId) })
      toast.success('Notes saved')
    },
    onError: (err: { message?: string }) => {
      toast.error(err.message ?? 'Failed to save notes')
    },
  })
}
