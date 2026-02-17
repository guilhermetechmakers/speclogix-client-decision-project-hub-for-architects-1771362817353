import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FileText, FileDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export interface MeetingNotesExportProps {
  meetingId: string | null
  meetingTitle?: string
  isLoading?: boolean
  onExportPdf?: (meetingId: string) => Promise<Blob>
  onExportWord?: (meetingId: string) => Promise<Blob>
  onAttachToProject?: (meetingId: string, file: Blob, format: 'pdf' | 'word') => Promise<void>
  className?: string
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function MeetingNotesExport({
  meetingId,
  meetingTitle,
  isLoading,
  onExportPdf,
  onExportWord,
  onAttachToProject,
  className,
}: MeetingNotesExportProps) {
  const [exportingPdf, setExportingPdf] = useState(false)
  const [exportingWord, setExportingWord] = useState(false)

  const handleExportPdf = async () => {
    if (!meetingId || !onExportPdf) return
    setExportingPdf(true)
    try {
      const blob = await onExportPdf(meetingId)
      const name = (meetingTitle || 'meeting-notes').replace(/[^a-z0-9-_]/gi, '-')
      downloadBlob(blob, `${name}.pdf`)
      toast.success('PDF downloaded')
      if (onAttachToProject) {
        await onAttachToProject(meetingId, blob, 'pdf')
        toast.success('Attached to project files')
      }
    } catch (err) {
      toast.error((err as { message?: string }).message ?? 'Export failed')
    } finally {
      setExportingPdf(false)
    }
  }

  const handleExportWord = async () => {
    if (!meetingId || !onExportWord) return
    setExportingWord(true)
    try {
      const blob = await onExportWord(meetingId)
      const name = (meetingTitle || 'meeting-notes').replace(/[^a-z0-9-_]/gi, '-')
      downloadBlob(
        blob,
        `${name}.docx`
      )
      toast.success('Word document downloaded')
      if (onAttachToProject) {
        await onAttachToProject(meetingId, blob, 'word')
        toast.success('Attached to project files')
      }
    } catch (err) {
      toast.error((err as { message?: string }).message ?? 'Export failed')
    } finally {
      setExportingWord(false)
    }
  }

  if (isLoading) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!meetingId) {
    return (
      <Card className={cn(className)}>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
          <p className="text-muted-foreground">
            Select a meeting to export notes as PDF or Word and attach to project files.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('animate-fade-in', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileDown className="h-5 w-5" aria-hidden />
          Export notes
        </CardTitle>
        <CardDescription>
          PDF or Word export and attach to project files.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {onExportPdf && (
            <Button
              variant="outline"
              onClick={handleExportPdf}
              disabled={exportingPdf}
              className="gap-2 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {exportingPdf ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <FileText className="h-4 w-4" aria-hidden />
              )}
              Export PDF
            </Button>
          )}
          {onExportWord && (
            <Button
              variant="outline"
              onClick={handleExportWord}
              disabled={exportingWord}
              className="gap-2 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {exportingWord ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <FileText className="h-4 w-4" aria-hidden />
              )}
              Export Word
            </Button>
          )}
        </div>
        {onAttachToProject && (
          <p className="text-xs text-muted-foreground">
            Exported file can be attached to project files when supported by the backend.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
