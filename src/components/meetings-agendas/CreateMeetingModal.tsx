import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { MeetingStatus } from '@/types/meetings-agendas'
import type { CreateMeetingsAgendaInput } from '@/types/meetings-agendas'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  scheduled_at: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(['draft', 'scheduled', 'completed', 'cancelled', 'active']),
})

type FormValues = z.infer<typeof schema>

const STATUS_OPTIONS: { value: MeetingStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export interface CreateMeetingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateMeetingsAgendaInput) => void
  isSubmitting?: boolean
}

export function CreateMeetingModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: CreateMeetingModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      scheduled_at: '',
      location: '',
      status: 'draft',
    },
  })

  const status = watch('status')

  const onFormSubmit = (data: FormValues) => {
    const payload: CreateMeetingsAgendaInput = {
      title: data.title,
      description: data.description || undefined,
      scheduled_at: data.scheduled_at || undefined,
      location: data.location || undefined,
      status: data.status,
    }
    onSubmit(payload)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px]"
        aria-describedby="create-meeting-description"
      >
        <DialogHeader>
          <DialogTitle>New meeting</DialogTitle>
          <DialogDescription id="create-meeting-description">
            Create a meeting and add agenda topics, invite participants, and take minutes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meeting-title">Title</Label>
            <Input
              id="meeting-title"
              placeholder="e.g. Weekly sync"
              {...register('title')}
              className={cn(errors.title && 'border-destructive')}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && (
              <p id="title-error" className="text-sm text-destructive" role="alert">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="meeting-description">Description (optional)</Label>
            <Textarea
              id="meeting-description"
              placeholder="Meeting purpose and context"
              rows={2}
              {...register('description')}
              className="resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meeting-scheduled">Date & time (optional)</Label>
              <Input
                id="meeting-scheduled"
                type="datetime-local"
                {...register('scheduled_at')}
                aria-label="Scheduled date and time"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-status">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setValue('status', v as MeetingStatus)}
              >
                <SelectTrigger id="meeting-status" aria-label="Meeting status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="meeting-location">Location (optional)</Label>
            <Input
              id="meeting-location"
              placeholder="Room or video link"
              {...register('location')}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating…' : 'Create meeting'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
