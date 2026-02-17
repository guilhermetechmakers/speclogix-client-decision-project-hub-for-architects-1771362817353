import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Archive, Download, FileText } from 'lucide-react'
import type { SignedDocumentItem } from '@/types/approvals-e-signatures'

export interface SignedDocumentArchiveProps {
  documents: SignedDocumentItem[]
  isLoading?: boolean
  onDownload?: (doc: SignedDocumentItem) => void
  emptyMessage?: string
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

export function SignedDocumentArchive({
  documents,
  isLoading,
  onDownload,
  emptyMessage = 'No signed documents yet. Signed PDFs and metadata will appear here.',
}: SignedDocumentArchiveProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border transition-all duration-300">
        <CardHeader>
          <Skeleton className="h-6 w-44 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded-lg" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (documents.length === 0) {
    return (
      <Card className="overflow-hidden border-border transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Archive className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Signed document archive</CardTitle>
              <CardDescription>List of signed PDFs and metadata</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-12 px-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/60" aria-hidden />
            <p className="mt-4 text-sm font-medium text-foreground">No signed documents</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'overflow-hidden border-border transition-all duration-300',
        'hover:shadow-card-hover'
      )}
    >
      <CardHeader className="border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Archive className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Signed document archive</CardTitle>
            <CardDescription>List of signed PDFs and metadata</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className={cn(
                'flex flex-wrap items-center justify-between gap-4 px-6 py-4 transition-colors',
                'hover:bg-muted/50'
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">
                  {doc.file_name ?? doc.title ?? 'Signed document'}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span>{doc.signer_email}</span>
                  <span>{formatDate(doc.signed_at)}</span>
                  {doc.ip_address && (
                    <span className="font-mono text-xs">{doc.ip_address}</span>
                  )}
                </div>
              </div>
              {onDownload && (doc.document_url ?? doc.id) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(doc)}
                  className="shrink-0 gap-1 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
