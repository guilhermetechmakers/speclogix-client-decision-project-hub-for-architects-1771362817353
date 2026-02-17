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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, Upload, ArrowRight, ArrowLeft, Link2, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DecisionPhase } from '@/types/decision-log'

const costImpactSchema = z.object({
  label: z.string(),
  amount_cents: z.number(),
  currency: z.string().min(1),
})

const stepSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  summary: z.string().optional(),
  phase: z.enum(['concept', 'design', 'construction', 'closeout', 'other']),
  approver_email: z.string().email().optional().or(z.literal('')),
  due_date: z.string().optional(),
  options: z.array(
    z.object({
      title: z.string().min(1, 'Option title required'),
      description: z.string().optional(),
      media_urls: z.array(z.string()).optional(),
      cost_impacts: z.array(costImpactSchema).optional(),
    })
  ).min(1, 'Add at least one option'),
  recommended_option_index: z.number().min(0).optional(),
})

type FormValues = z.infer<typeof stepSchema>

const PHASES: { value: DecisionPhase; label: string }[] = [
  { value: 'concept', label: 'Concept' },
  { value: 'design', label: 'Design' },
  { value: 'construction', label: 'Construction' },
  { value: 'closeout', label: 'Closeout' },
  { value: 'other', label: 'Other' },
]

export interface CreateDecisionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormValues) => void
  isSubmitting?: boolean
}

export function CreateDecisionModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: CreateDecisionModalProps) {
  const [step, setStep] = useState(0)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      title: '',
      description: '',
      summary: '',
      phase: 'design',
      approver_email: '',
      due_date: '',
      options: [{ title: '', description: '', media_urls: [], cost_impacts: [] }],
      recommended_option_index: 0,
    },
  })

  const options = watch('options') ?? [{ title: '', description: '', media_urls: [], cost_impacts: [] }]

  const addOption = () => {
    setValue('options', [...options, { title: '', description: '', media_urls: [], cost_impacts: [] }], { shouldValidate: true })
  }

  const removeOption = (index: number) => {
    if (options.length <= 1) return
    setValue(
      'options',
      options.filter((_, i) => i !== index),
      { shouldValidate: true }
    )
  }

  const addMediaUrl = (optionIndex: number) => {
    const opts = [...(watch('options') ?? [])]
    const urls = [...(opts[optionIndex]?.media_urls ?? []), '']
    opts[optionIndex] = { ...opts[optionIndex], media_urls: urls }
    setValue('options', opts, { shouldValidate: true })
  }

  const setMediaUrl = (optionIndex: number, urlIndex: number, value: string) => {
    const opts = [...(watch('options') ?? [])]
    const urls = [...(opts[optionIndex]?.media_urls ?? [])]
    urls[urlIndex] = value
    opts[optionIndex] = { ...opts[optionIndex], media_urls: urls }
    setValue('options', opts, { shouldValidate: true })
  }

  const removeMediaUrl = (optionIndex: number, urlIndex: number) => {
    const opts = [...(watch('options') ?? [])]
    const urls = (opts[optionIndex]?.media_urls ?? []).filter((_, i) => i !== urlIndex)
    opts[optionIndex] = { ...opts[optionIndex], media_urls: urls }
    setValue('options', opts, { shouldValidate: true })
  }

  const addCostImpact = (optionIndex: number) => {
    const opts = [...(watch('options') ?? [])]
    const impacts = [...(opts[optionIndex]?.cost_impacts ?? []), { label: '', amount_cents: 0, currency: 'USD' }]
    opts[optionIndex] = { ...opts[optionIndex], cost_impacts: impacts }
    setValue('options', opts, { shouldValidate: true })
  }

  const setCostImpact = (optionIndex: number, impactIndex: number, field: 'label' | 'amount_cents' | 'currency', value: string | number) => {
    const opts = [...(watch('options') ?? [])]
    const impacts = [...(opts[optionIndex]?.cost_impacts ?? [])]
    impacts[impactIndex] = { ...impacts[impactIndex], [field]: value }
    opts[optionIndex] = { ...opts[optionIndex], cost_impacts: impacts }
    setValue('options', opts, { shouldValidate: true })
  }

  const removeCostImpact = (optionIndex: number, impactIndex: number) => {
    const opts = [...(watch('options') ?? [])]
    const impacts = (opts[optionIndex]?.cost_impacts ?? []).filter((_, i) => i !== impactIndex)
    opts[optionIndex] = { ...opts[optionIndex], cost_impacts: impacts }
    setValue('options', opts, { shouldValidate: true })
  }

  const onNext = async () => {
    const fields = step === 0
      ? (['title', 'description', 'summary', 'phase', 'options'] as const)
      : (['approver_email', 'due_date', 'recommended_option_index'] as const)
    const ok = await trigger(fields)
    if (ok) setStep((s) => Math.min(s + 1, 1))
  }

  const onBack = () => setStep((s) => Math.max(s - 1, 0))

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit({
      ...data,
      recommended_option_index: data.recommended_option_index ?? 0,
      options: data.options.map((o) => ({
        title: o.title,
        description: o.description,
        media_urls: (o.media_urls ?? []).filter((u): u is string => Boolean(u?.trim())),
        cost_impacts: (o.cost_impacts ?? []).filter((c) => c.label?.trim()).map((c) => ({ label: c.label, amount_cents: c.amount_cents, currency: c.currency })),
      })),
    })
    // Parent closes modal on success (e.g. after navigate)
  })

  const onFormSubmit = (e: React.FormEvent) => {
    if (step === 0) {
      e.preventDefault()
      onNext()
    } else {
      handleFormSubmit(e)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" showClose>
        <DialogHeader>
          <DialogTitle>Create decision</DialogTitle>
          <DialogDescription>
            Add options, media, cost impacts, and assign an approver.
          </DialogDescription>
          <div className="flex gap-2 pt-2" role="tablist" aria-label="Wizard steps">
            <div
              className={cn(
                'h-2 flex-1 rounded-full transition-colors duration-300',
                step >= 0 ? 'bg-primary' : 'bg-muted'
              )}
              aria-current={step === 0 ? 'step' : undefined}
            />
            <div
              className={cn(
                'h-2 flex-1 rounded-full transition-colors duration-300',
                step >= 1 ? 'bg-primary' : 'bg-muted'
              )}
              aria-current={step === 1 ? 'step' : undefined}
            />
          </div>
          <p className="text-xs text-muted-foreground pt-1">Step {step + 1} of 2</p>
        </DialogHeader>

        <form id="create-decision-form" onSubmit={onFormSubmit} className="space-y-6">
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="e.g. Fixture package A"
                  className="mt-1 focus-visible:ring-2 focus-visible:ring-ring transition-shadow duration-200"
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="summary">Short summary</Label>
                <Input
                  id="summary"
                  {...register('summary')}
                  placeholder="One-line summary for cards"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Full description (optional)"
                  className="mt-1 min-h-[80px]"
                />
              </div>
              <div>
                <Label>Phase</Label>
                <Select
                  value={watch('phase')}
                  onValueChange={(v) => setValue('phase', v as DecisionPhase)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PHASES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Options — add titles, media URLs (images/PDFs), and cost impacts</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addOption} className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
                    <Plus className="h-4 w-4 mr-1" /> Add option
                  </Button>
                </div>
                {errors.options && (
                  <p className="text-sm text-destructive mt-1">{errors.options.message}</p>
                )}
                <ul className="mt-2 space-y-4">
                  {options.map((opt, i) => (
                    <li key={i} className="rounded-lg border border-border bg-muted/20 p-3 space-y-3">
                      <div className="flex gap-2 items-start">
                        <Input
                          {...register(`options.${i}.title`)}
                          placeholder={`Option ${i + 1} title`}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 min-w-[44px] min-h-[44px]"
                          onClick={() => removeOption(i)}
                          disabled={options.length <= 1}
                          aria-label="Remove option"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="pl-2 space-y-2 border-l-2 border-primary/20">
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <Link2 className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                            <span className="text-xs font-medium text-muted-foreground">Media URLs (images/PDFs)</span>
                            <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => addMediaUrl(i)}>
                              Add URL
                            </Button>
                          </div>
                          {(opt.media_urls ?? []).length === 0 ? (
                            <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => addMediaUrl(i)}>
                              <Upload className="h-3 w-3 mr-1" /> Add image or PDF URL
                            </Button>
                          ) : (
                            <ul className="space-y-1">
                              {(opt.media_urls ?? []).map((_, uIdx) => (
                                <li key={uIdx} className="flex gap-1">
                                  <Input
                                    placeholder="https://..."
                                    value={(opt.media_urls ?? [])[uIdx] ?? ''}
                                    onChange={(e) => setMediaUrl(i, uIdx, e.target.value)}
                                    className="text-sm h-8"
                                  />
                                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeMediaUrl(i, uIdx)} aria-label="Remove URL">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </li>
                              ))}
                              <Button type="button" variant="ghost" size="sm" className="text-xs" onClick={() => addMediaUrl(i)}>
                                <Plus className="h-3 w-3 mr-1" /> Add another URL
                              </Button>
                            </ul>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                            <span className="text-xs font-medium text-muted-foreground">Cost impacts</span>
                            <Button type="button" variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => addCostImpact(i)}>
                              Add line
                            </Button>
                          </div>
                          {(opt.cost_impacts ?? []).length === 0 ? (
                            <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => addCostImpact(i)}>
                              <DollarSign className="h-3 w-3 mr-1" /> Add cost impact
                            </Button>
                          ) : (
                            <ul className="space-y-2">
                              {(opt.cost_impacts ?? []).map((c, cIdx) => (
                                <li key={cIdx} className="flex flex-wrap items-center gap-2">
                                  <Input
                                    placeholder="Label"
                                    value={c.label}
                                    onChange={(e) => setCostImpact(i, cIdx, 'label', e.target.value)}
                                    className="w-28 text-sm h-8"
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Amount ($)"
                                    step="0.01"
                                    min="0"
                                    value={c.amount_cents ? (c.amount_cents / 100).toFixed(2) : ''}
                                    onChange={(e) => setCostImpact(i, cIdx, 'amount_cents', Math.round((parseFloat(e.target.value) || 0) * 100))}
                                    className="w-24 text-sm h-8"
                                  />
                                  <Select
                                    value={c.currency ?? 'USD'}
                                    onValueChange={(v) => setCostImpact(i, cIdx, 'currency', v)}
                                  >
                                    <SelectTrigger className="w-20 h-8 text-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="USD">USD</SelectItem>
                                      <SelectItem value="EUR">EUR</SelectItem>
                                      <SelectItem value="GBP">GBP</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => removeCostImpact(i, cIdx)} aria-label="Remove cost line">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </li>
                              ))}
                              <Button type="button" variant="ghost" size="sm" className="text-xs" onClick={() => addCostImpact(i)}>
                                <Plus className="h-3 w-3 mr-1" /> Add another
                              </Button>
                            </ul>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <Label htmlFor="approver_email">Approver email (optional)</Label>
                <Input
                  id="approver_email"
                  type="email"
                  {...register('approver_email')}
                  placeholder="client@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="due_date">Due date</Label>
                <Input
                  id="due_date"
                  type="date"
                  {...register('due_date')}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Recommended option</Label>
                <Select
                  value={String(watch('recommended_option_index') ?? 0)}
                  onValueChange={(v) => setValue('recommended_option_index', Number(v))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((o, i) => (
                      <SelectItem key={i} value={String(i)}>
                        {o.title || `Option ${i + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Upload className="h-3.5 w-3.5" />
                You can add more media or cost lines after creation in the decision detail view.
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            {step === 1 ? (
              <>
                <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button
                  type="submit"
                  form="create-decision-form"
                  disabled={isSubmitting}
                  className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? 'Creating…' : 'Create decision'}
                </Button>
              </>
            ) : (
              <Button type="button" onClick={onNext}>
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
