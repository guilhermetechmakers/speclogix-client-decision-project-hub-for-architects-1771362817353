import { useState } from 'react'
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
import { PenLine } from 'lucide-react'
import { cn } from '@/lib/utils'

const signSchema = z.object({
  signerName: z.string().min(2, 'Please enter your full name'),
})
type SignFormValues = z.infer<typeof signSchema>

export interface ESignCaptureModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: { signerName: string; signedAt: string }) => void | Promise<void>
  isSigning?: boolean
  decisionTitle?: string
  className?: string
}

export function ESignCaptureModal({
  open,
  onOpenChange,
  onConfirm,
  isSigning = false,
  decisionTitle,
  className,
}: ESignCaptureModalProps) {
  const [agreed, setAgreed] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignFormValues>({
    resolver: zodResolver(signSchema),
    defaultValues: { signerName: '' },
  })

  const onSubmit = handleSubmit(async (data) => {
    if (!agreed) return
    const payload = { signerName: data.signerName, signedAt: new Date().toISOString() }
    try {
      await Promise.resolve(onConfirm(payload))
      reset()
      setAgreed(false)
      onOpenChange(false)
    } catch {
      // Leave modal open on error; toast is shown by mutation onError
    }
  })

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      reset()
      setAgreed(false)
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn('max-w-md', className)}
        showClose
        onPointerDownOutside={() => !isSigning && handleOpenChange(false)}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenLine className="h-5 w-5 text-primary" aria-hidden />
            E-signature
          </DialogTitle>
          <DialogDescription>
            {decisionTitle
              ? `Sign to approve "${decisionTitle}". Your name and the date will be recorded in the audit trail.`
              : 'Enter your full name to sign. Your name and the date will be recorded in the audit trail.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="esign-signer-name">Full name</Label>
            <Input
              id="esign-signer-name"
              placeholder="John Smith"
              className="mt-1 transition-[border-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-ring"
              autoComplete="name"
              {...register('signerName')}
            />
            {errors.signerName && (
              <p className="text-sm text-destructive mt-1">{errors.signerName.message}</p>
            )}
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="rounded border-border focus:ring-2 focus:ring-ring"
              aria-label="I agree to sign this decision"
            />
            <span>I agree to sign this decision and confirm the information is accurate.</span>
          </label>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSigning}
              className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!agreed || isSigning}
              className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSigning ? 'Signing…' : 'Sign'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
