import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Plus, X, Workflow, PenTool, CheckSquare } from 'lucide-react'
import type { ApprovalWorkflowConfig, ApprovalType, ApprovalOrder } from '@/types/approvals-e-signatures'

export interface ApprovalWorkflowConfiguratorProps {
  approvalId: string
  workflow: ApprovalWorkflowConfig | null
  isLoading?: boolean
  onSave: (config: {
    require_signers: string[]
    approval_type: ApprovalType
    approval_order: ApprovalOrder
    legal_text?: string
  }) => void
  isSubmitting?: boolean
}

const APPROVAL_TYPES: { value: ApprovalType; label: string; icon: typeof PenTool }[] = [
  { value: 'e_sign', label: 'E-signature (draw or type)', icon: PenTool },
  { value: 'checkbox', label: 'Checkbox approval only', icon: CheckSquare },
]

const APPROVAL_ORDERS: { value: ApprovalOrder; label: string }[] = [
  { value: 'sequential', label: 'Sequential (one after another)' },
  { value: 'parallel', label: 'Parallel (all at once)' },
]

export function ApprovalWorkflowConfigurator({
  approvalId: _approvalId,
  workflow,
  isLoading,
  onSave,
  isSubmitting,
}: ApprovalWorkflowConfiguratorProps) {
  const [signers, setSigners] = useState<string[]>(workflow?.require_signers?.length ? [...workflow.require_signers] : [''])
  const [approvalType, setApprovalType] = useState<ApprovalType>(workflow?.approval_type ?? 'e_sign')
  const [approvalOrder, setApprovalOrder] = useState<ApprovalOrder>(workflow?.approval_order ?? 'sequential')
  const [legalText, setLegalText] = useState(workflow?.legal_text ?? '')

  const addSigner = () => setSigners((s) => [...s, ''])
  const removeSigner = (i: number) => setSigners((s) => s.filter((_, idx) => idx !== i))
  const updateSigner = (i: number, value: string) =>
    setSigners((s) => {
      const next = [...s]
      next[i] = value
      return next
    })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const required = signers.map((s) => s.trim()).filter(Boolean)
    if (required.length === 0) return
    onSave({
      require_signers: required,
      approval_type: approvalType,
      approval_order: approvalOrder,
      legal_text: legalText.trim() || undefined,
    })
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <Skeleton className="h-6 w-48 rounded-lg" />
          <Skeleton className="h-4 w-full max-w-md rounded-lg" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'overflow-hidden border-border transition-all duration-300',
        'hover:shadow-card-hover hover:border-primary/20'
      )}
    >
      <CardHeader className="border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Workflow className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Workflow configurator</CardTitle>
            <CardDescription>
              Require signers, choose e-sign or checkbox, and set approval order (parallel or sequential).
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="signers">Required signers (email or name)</Label>
            <div className="space-y-2">
              {signers.map((value, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    id={`signer-${i}`}
                    placeholder="signer@example.com or Name"
                    value={value}
                    onChange={(e) => updateSigner(i, e.target.value)}
                    className="flex-1 transition-colors focus:ring-2 focus:ring-primary/20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSigner(i)}
                    disabled={signers.length <= 1}
                    aria-label="Remove signer"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSigner}
                className="gap-1 transition-transform duration-200 hover:scale-[1.02]"
              >
                <Plus className="h-4 w-4" />
                Add signer
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Approval type</Label>
              <Select
                value={approvalType}
                onValueChange={(v) => setApprovalType(v as ApprovalType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {APPROVAL_TYPES.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex items-center gap-2">
                        <opt.icon className="h-4 w-4 text-muted-foreground" />
                        {opt.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Approval order</Label>
              <Select
                value={approvalOrder}
                onValueChange={(v) => setApprovalOrder(v as ApprovalOrder)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {APPROVAL_ORDERS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="legal_text">Legal / consent text (optional)</Label>
            <Textarea
              id="legal_text"
              placeholder="By signing you agree to..."
              value={legalText}
              onChange={(e) => setLegalText(e.target.value)}
              rows={3}
              className="resize-none transition-colors focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || signers.every((s) => !s.trim())}
            className="min-w-[120px] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? 'Saving…' : 'Save workflow'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
