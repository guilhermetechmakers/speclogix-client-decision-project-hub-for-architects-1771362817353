import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, ArrowLeft } from 'lucide-react'
import {
  MeetingList,
  AgendaBuilder,
  InviteCalendarSync,
  MinutesActionsPanel,
  MeetingNotesExport,
  CreateMeetingModal,
} from '@/components/meetings-agendas'
import {
  useMeetingsAgendas,
  useMeetingsAgenda,
  useCreateMeetingsAgenda,
  useAgendaItems,
  useCreateAgendaItem,
  useUpdateAgendaItem,
  useDeleteAgendaItem,
  useAttendees,
  useCreateAttendee,
  useDeleteAttendee,
  useActionItems,
  useMeetingNotes,
  useUpsertMeetingNotes,
  useCreateActionItem,
  useUpdateActionItem,
  useDeleteActionItem,
} from '@/hooks/use-meetings-agendas'
import type { MeetingsAgendaListFilters } from '@/types/meetings-agendas'
import { exportMeetingNotesPdf, exportMeetingNotesWord } from '@/api/meetings-agendas'

const defaultFilters: MeetingsAgendaListFilters = {
  status: 'all',
  search: '',
}

export default function MeetingsAgendasPage() {
  const [filters] = useState<MeetingsAgendaListFilters>(defaultFilters)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const { data: meetings = [], isLoading: listLoading } = useMeetingsAgendas(filters)
  const { data: meeting, isLoading: detailLoading } = useMeetingsAgenda(selectedId ?? undefined)
  const { data: agendaItems = [], isLoading: agendaLoading } = useAgendaItems(selectedId ?? undefined)
  const { data: actionItems = [], isLoading: actionsLoading } = useActionItems(selectedId ?? undefined)
  const { data: attendees = [] } = useAttendees(selectedId ?? undefined)
  const { data: notes = [] } = useMeetingNotes(selectedId ?? undefined)

  const createMutation = useCreateMeetingsAgenda()
  const createAgendaItemMutation = useCreateAgendaItem(selectedId ?? '')
  const updateAgendaItemMutation = useUpdateAgendaItem(selectedId ?? '')
  const deleteAgendaItemMutation = useDeleteAgendaItem(selectedId ?? '')
  const createAttendeeMutation = useCreateAttendee(selectedId ?? '')
  const deleteAttendeeMutation = useDeleteAttendee(selectedId ?? '')
  const upsertNotesMutation = useUpsertMeetingNotes(selectedId ?? '')
  const createActionMutation = useCreateActionItem(selectedId ?? '')
  const updateActionMutation = useUpdateActionItem(selectedId ?? '')
  const deleteActionMutation = useDeleteActionItem(selectedId ?? '')

  const agendaItemsList = (meeting?.agenda_items?.length ? meeting.agenda_items : agendaItems) ?? []
  const attendeesList = (meeting?.attendees?.length ? meeting.attendees : attendees) ?? []
  const notesContent = notes?.[0]?.content ?? ''

  useEffect(() => {
    document.title = selectedId
      ? meeting?.title
        ? `${meeting.title} — Meetings & Agendas | SpecLogix`
        : 'Meetings & Agendas | SpecLogix'
      : 'Meetings & Agendas | SpecLogix'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        meeting?.description ||
          'Create meeting agendas, invite participants, record minutes and action items. SpecLogix.'
      )
    }
    return () => {
      document.title = 'SpecLogix'
    }
  }, [selectedId, meeting?.title, meeting?.description])

  const handleConvertToTask = () => {
    // Placeholder: navigate to tasks or open task modal; integration point
  }
  const handleConvertToDecision = () => {
    // Placeholder: navigate to decisions or open decision modal; integration point
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {selectedId && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedId(null)}
              aria-label="Back to meeting list"
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-semibold">Meetings & Agendas</h1>
            <p className="text-muted-foreground mt-1">
              Create agendas, invite participants, record notes and action items.
            </p>
          </div>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="gap-2 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          New meeting
        </Button>
      </div>

      {!selectedId ? (
        <MeetingList
          meetings={meetings}
          isLoading={listLoading}
          onSelectMeeting={setSelectedId}
          emptyMessage="No meetings yet. Create one to get started."
        />
      ) : (
        <div className="space-y-6">
          {detailLoading && !meeting ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-64 animate-pulse rounded-xl bg-muted" />
              <div className="h-64 animate-pulse rounded-xl bg-muted" />
            </div>
          ) : (
            <>
              <Tabs defaultValue="agenda" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                  <TabsTrigger value="agenda">Agenda</TabsTrigger>
                  <TabsTrigger value="invite">Invite & calendar</TabsTrigger>
                  <TabsTrigger value="minutes">Minutes & actions</TabsTrigger>
                  <TabsTrigger value="export">Export</TabsTrigger>
                </TabsList>
                <TabsContent value="agenda" className="mt-4">
                  <AgendaBuilder
                    meetingId={selectedId}
                    items={agendaItemsList}
                    isLoading={agendaLoading}
                    onAddItem={(data) => createAgendaItemMutation.mutate(data)}
                    onUpdateItem={(itemId, data) =>
                      updateAgendaItemMutation.mutate({ itemId, data })
                    }
                    onRemoveItem={(itemId) => deleteAgendaItemMutation.mutate(itemId)}
                  />
                </TabsContent>
                <TabsContent value="invite" className="mt-4">
                  <InviteCalendarSync
                    meeting={meeting ?? null}
                    attendees={attendeesList}
                    isLoading={detailLoading}
                    onInvite={(data) => createAttendeeMutation.mutate(data)}
                    onRemoveAttendee={(id) => deleteAttendeeMutation.mutate(id)}
                  />
                </TabsContent>
                <TabsContent value="minutes" className="mt-4">
                  <MinutesActionsPanel
                    meetingId={selectedId}
                    notesContent={notesContent}
                    notesLoading={false}
                    actionItems={actionItems}
                    actionItemsLoading={actionsLoading}
                    onSaveNotes={(content) => upsertNotesMutation.mutate(content)}
                    onAddAction={(data) => createActionMutation.mutate(data)}
                    onUpdateAction={(itemId, data) =>
                      updateActionMutation.mutate({ itemId, data })
                    }
                    onRemoveAction={(id) => deleteActionMutation.mutate(id)}
                    onConvertToTask={handleConvertToTask}
                    onConvertToDecision={handleConvertToDecision}
                  />
                </TabsContent>
                <TabsContent value="export" className="mt-4">
                  <MeetingNotesExport
                    meetingId={selectedId}
                    meetingTitle={meeting?.title}
                    onExportPdf={exportMeetingNotesPdf}
                    onExportWord={exportMeetingNotesWord}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      )}

      <CreateMeetingModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={(data) =>
          createMutation.mutate(data, {
            onSuccess: (created) => {
              setCreateOpen(false)
              setSelectedId(created.id)
            },
          })
        }
        isSubmitting={createMutation.isPending}
      />
    </div>
  )
}
