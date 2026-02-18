import { useEffect } from 'react'
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
import type { PerformanceCachingBackup } from '@/types/performance-caching-backup'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.enum(['active', 'paused', 'archived']),
})

type FormValues = z.infer<typeof schema>

export interface PolicyFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: PerformanceCachingBackup | null
  onSubmit: (data: FormValues) => void
  isSubmitting?: boolean
}

export function PolicyFormModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting = false,
}: PolicyFormModalProps) {
  const isEdit = Boolean(initialData?.id)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      status: (initialData?.status as FormValues['status']) ?? 'active',
    },
  })

  const status = watch('status')

  useEffect(() => {
    if (open) {
      reset({
        title: initialData?.title ?? '',
        description: initialData?.description ?? '',
        status: (initialData?.status as FormValues['status']) ?? 'active',
      })
    }
  }, [open, initialData, reset])

  const handleOpenChange = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  const onFormSubmit = (data: FormValues) => {
    onSubmit(data)
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]" showClose>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit policy' : 'Add policy'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update title, description, or status.'
              : 'Create a new performance, caching, or backup policy.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="policy-title">Title</Label>
            <Input
              id="policy-title"
              placeholder="e.g. CDN cache rules"
              {...register('title')}
              className={cn(errors.title && 'border-destructive focus-visible:ring-destructive')}
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && (
              <p className="text-sm text-destructive" role="alert">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="policy-description">Description (optional)</Label>
            <Textarea
              id="policy-description"
              placeholder="Brief description"
              {...register('description')}
              rows={3}
              className={cn(
                errors.description && 'border-destructive focus-visible:ring-destructive'
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="policy-status">Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setValue('status', v as FormValues['status'])}
            >
              <SelectTrigger id="policy-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEdit ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
