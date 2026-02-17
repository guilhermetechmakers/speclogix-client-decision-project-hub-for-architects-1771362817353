import { useRef, useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { PenTool, Type, Eraser, Check } from 'lucide-react'
import type { SignatureCapture } from '@/types/approvals-e-signatures'

export interface ESignExperienceProps {
  approvalId: string
  legalText?: string
  requireESign: boolean
  onSubmitSignature: (payload: SignatureCapture) => void
  onSubmitCheckbox?: () => void
  isSubmitting?: boolean
}

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 160

export function ESignExperience({
  approvalId: _approvalId,
  legalText,
  requireESign,
  onSubmitSignature,
  onSubmitCheckbox,
  isSubmitting,
}: ESignExperienceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<'draw' | 'type'>('draw')
  const [typedName, setTypedName] = useState('')
  const [legalAccepted, setLegalAccepted] = useState(!legalText)
  const [isDrawing, setIsDrawing] = useState(false)

  const getTimestamp = () => new Date().toISOString()

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#0f172a'
    ctx.lineWidth = 2
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#0f172a'
    ctx.lineWidth = 2
  }, [])

  const startDraw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (mode !== 'draw') return
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY
      ctx.beginPath()
      ctx.moveTo(x, y)
      setIsDrawing(true)
    },
    [mode]
  )

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || mode !== 'draw') return
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY
      ctx.lineTo(x, y)
      ctx.stroke()
    },
    [isDrawing, mode]
  )

  const endDraw = useCallback(() => setIsDrawing(false), [])

  const getCanvasDataUrl = useCallback((): string => {
    const canvas = canvasRef.current
    if (!canvas) return ''
    return canvas.toDataURL('image/png')
  }, [])

  const handleSubmit = useCallback(() => {
    const signedAt = getTimestamp()
    if (requireESign) {
      if (mode === 'draw') {
        const data = getCanvasDataUrl()
        if (!data || data.length < 100) return
        onSubmitSignature({
          signature_data: data,
          signature_type: 'draw',
          signed_at: signedAt,
          legal_text_accepted: legalAccepted,
        })
      } else {
        const trimmed = typedName.trim()
        if (!trimmed) return
        onSubmitSignature({
          signature_data: trimmed,
          signature_type: 'type',
          signed_at: signedAt,
          legal_text_accepted: legalAccepted,
        })
      }
    } else if (onSubmitCheckbox) {
      if (legalText && !legalAccepted) return
      onSubmitCheckbox()
    }
  }, [
    requireESign,
    mode,
    getCanvasDataUrl,
    typedName,
    legalAccepted,
    legalText,
    onSubmitSignature,
    onSubmitCheckbox,
  ])

  const canSubmit =
    !isSubmitting &&
    (requireESign
      ? (mode === 'draw' && getCanvasDataUrl().length > 100) || (mode === 'type' && typedName.trim().length > 0)
      : true) &&
    (!legalText || legalAccepted)

  return (
    <Card
      className={cn(
        'overflow-hidden border-border transition-all duration-300',
        'hover:shadow-card-hover hover:border-primary/20'
      )}
    >
      <CardHeader className="border-b border-border/50 bg-muted/30">
        <CardTitle className="flex items-center gap-2 text-lg">
          <PenTool className="h-5 w-5 text-primary" />
          E-sign experience
        </CardTitle>
        <CardDescription>
          Draw or type your signature. IP and timestamp are captured with your consent when you submit.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {requireESign ? (
          <>
            <Tabs value={mode} onValueChange={(v) => setMode(v as 'draw' | 'type')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="draw" className="gap-2">
                  <PenTool className="h-4 w-4" />
                  Draw
                </TabsTrigger>
                <TabsTrigger value="type" className="gap-2">
                  <Type className="h-4 w-4" />
                  Type
                </TabsTrigger>
              </TabsList>
              <TabsContent value="draw" className="mt-4">
                <div className="space-y-2">
                  <Label>Sign in the box below</Label>
                  <div className="relative rounded-lg border border-border bg-white">
                    <canvas
                      ref={canvasRef}
                      width={CANVAS_WIDTH}
                      height={CANVAS_HEIGHT}
                      className="block w-full max-w-full cursor-crosshair touch-none rounded-lg border-0"
                      style={{ width: '100%', maxWidth: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
                      onMouseDown={startDraw}
                      onMouseMove={draw}
                      onMouseUp={endDraw}
                      onMouseLeave={endDraw}
                      aria-label="Signature drawing area"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearCanvas}
                      className="absolute right-2 top-2 gap-1 text-muted-foreground"
                    >
                      <Eraser className="h-4 w-4" />
                      Clear
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="type" className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="typed-signature">Type your full name</Label>
                  <Input
                    id="typed-signature"
                    placeholder="Your full name"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    className="max-w-md font-signature text-lg"
                    style={{ fontFamily: 'cursive' }}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {legalText && (
              <div className="mt-6 flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
                <Checkbox
                  id="legal-accept"
                  checked={legalAccepted}
                  onChange={(e) => setLegalAccepted(e.target.checked)}
                  className="mt-0.5"
                  aria-describedby="legal-text"
                />
                <Label
                  id="legal-text"
                  htmlFor="legal-accept"
                  className="cursor-pointer text-sm leading-relaxed text-muted-foreground"
                >
                  {legalText}
                </Label>
              </div>
            )}

            <p className="mt-4 text-xs text-muted-foreground">
              By submitting, your IP address and timestamp will be recorded for audit purposes.
            </p>
          </>
        ) : (
          <>
            {legalText && (
              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
                <Checkbox
                  id="legal-accept-checkbox"
                  checked={legalAccepted}
                  onChange={(e) => setLegalAccepted(e.target.checked)}
                  className="mt-0.5"
                  aria-describedby="legal-text-checkbox"
                />
                <Label
                  id="legal-text-checkbox"
                  htmlFor="legal-accept-checkbox"
                  className="cursor-pointer text-sm leading-relaxed text-muted-foreground"
                >
                  {legalText}
                </Label>
              </div>
            )}
          </>
        )}

        <div className="mt-6 flex items-center gap-3">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="gap-2 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? (
              'Submitting…'
            ) : requireESign ? (
              <>
                <Check className="h-4 w-4" />
                Submit signature
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Approve
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
