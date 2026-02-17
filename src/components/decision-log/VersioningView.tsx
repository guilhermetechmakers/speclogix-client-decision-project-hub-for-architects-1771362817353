import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Download, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DecisionVersion } from '@/types/decision-log'

export interface VersioningViewProps {
  versions: DecisionVersion[]
  decisionId: string
  decisionTitle: string
  onExportPdf?: (versionId?: string) => void
  isExporting?: boolean
  className?: string
}

export function VersioningView({
  versions,
  decisionId: _decisionId,
  decisionTitle: _decisionTitle,
  onExportPdf,
  isExporting = false,
  className,
}: VersioningViewProps) {
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
    versions[0]?.id ?? null
  )
  const selectedVersion = versions.find((v) => v.id === selectedVersionId) ?? versions[0]

  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  const previousVersion = selectedVersion
    ? sortedVersions[sortedVersions.findIndex((v) => v.id === selectedVersion.id) + 1] ?? null
    : null

  return (
    <div className={cn('space-y-4', className)}>
      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" /> Version history
          </CardTitle>
          <CardDescription>
            Chronological versions with diff highlights. Export any version as PDF.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedVersions.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/20 py-8 text-center">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" aria-hidden />
              <p className="text-sm text-muted-foreground">No versions yet.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {sortedVersions.map((v) => (
                  <Button
                    key={v.id}
                    variant={selectedVersionId === v.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedVersionId(v.id)}
                    className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    v{v.version_number}
                  </Button>
                ))}
              </div>
              {selectedVersion && (
                <div className="rounded-xl border border-border bg-muted/30 p-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <Badge variant="secondary" className="font-normal">
                      Version {selectedVersion.version_number} ·{' '}
                      {new Date(selectedVersion.created_at).toLocaleString()}
                    </Badge>
                    {onExportPdf && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onExportPdf(selectedVersion.id)}
                        disabled={isExporting}
                        className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Download className="h-4 w-4 mr-1" /> Export PDF
                      </Button>
                    )}
                  </div>
                  {previousVersion && (
                    <p className="text-xs text-muted-foreground mb-2">
                      Changes from v{previousVersion.version_number} (diff highlights below)
                    </p>
                  )}
                  <div className="text-sm prose prose-sm max-w-none dark:prose-invert rounded-lg bg-background/50 p-3 border border-border/50">
                    <VersionDiffHighlight
                      snapshot={selectedVersion.snapshot}
                      previousSnapshot={previousVersion?.snapshot}
                    />
                  </div>
                </div>
              )}
              {onExportPdf && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onExportPdf()}
                  disabled={isExporting}
                  className="mt-2 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <FileText className="h-4 w-4 mr-1" /> Export current as PDF
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function VersionDiffHighlight({
  snapshot,
  previousSnapshot,
}: {
  snapshot: Record<string, unknown>
  previousSnapshot?: Record<string, unknown>
}) {
  const title = (snapshot.title as string) ?? '—'
  const description = (snapshot.description as string) ?? ''
  const options = (snapshot.options as Array<{ title?: string; description?: string }>) ?? []
  const prevTitle = previousSnapshot ? ((previousSnapshot.title as string) ?? '') : null
  const prevDescription = previousSnapshot ? ((previousSnapshot.description as string) ?? '') : null
  const prevOptions = (previousSnapshot?.options as Array<{ title?: string; description?: string }>) ?? []

  const titleChanged = prevTitle !== null && prevTitle !== title
  const descChanged = prevDescription !== null && prevDescription !== description

  return (
    <div className="space-y-3">
      <p
        className={cn(
          'rounded px-1.5 py-0.5 border-l-2',
          titleChanged ? 'bg-[hsl(var(--success))]/10 border-[hsl(var(--success))]/50' : 'bg-primary/5 border-primary/50'
        )}
      >
        <strong className="text-foreground">Title:</strong>{' '}
        <span className="text-foreground">{title}</span>
        {titleChanged && prevTitle && (
          <span className="block mt-1 text-xs text-muted-foreground line-through">{prevTitle}</span>
        )}
      </p>
      {(description || descChanged) && (
        <p
          className={cn(
            'rounded px-1.5 py-0.5 border-l-2',
            descChanged ? 'bg-[hsl(var(--success))]/10 border-[hsl(var(--success))]/50' : 'bg-muted/50 border-muted-foreground/30'
          )}
        >
          <strong className="text-foreground">Description:</strong>{' '}
          <span className="text-muted-foreground">{description || '—'}</span>
          {descChanged && prevDescription && (
            <span className="block mt-1 text-xs text-muted-foreground line-through">{prevDescription}</span>
          )}
        </p>
      )}
      {options.length > 0 && (
        <div className="rounded px-1.5 py-0.5 bg-muted/30 border-l-2 border-border">
          <strong className="text-foreground">Options:</strong>
          <ul className="list-disc pl-5 mt-1 space-y-0.5">
            {options.map((o, i) => {
              const prevO = prevOptions[i]
              const optChanged = prevO && (prevO.title !== (o.title ?? '') || prevO.description !== (o.description ?? ''))
              return (
                <li
                  key={i}
                  className={cn(
                    'text-foreground',
                    optChanged && 'rounded bg-[hsl(var(--success))]/10 px-1 -mx-1'
                  )}
                >
                  {o.title ?? 'Untitled'}
                  {o.description && <span className="text-muted-foreground"> — {o.description}</span>}
                  {optChanged && prevO && (
                    <span className="block text-xs text-muted-foreground line-through mt-0.5">
                      {prevO.title ?? 'Untitled'}
                      {prevO.description && ` — ${prevO.description}`}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
