import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Share2, Save, Copy, Users, Building2 } from 'lucide-react'
import type { TemplatesWorkflowLibrary } from '@/types/templates-workflow-library'
import { toast } from 'sonner'

export interface TemplateVersioningSharingProps {
  template: TemplatesWorkflowLibrary | null
  onSaveAsNewVersion?: (title: string) => void
  onShare?: (payload: { firm_id?: string; user_ids?: string[] }) => void
  isSaving?: boolean
  isSharing?: boolean
}

export function TemplateVersioningSharing({
  template,
  onSaveAsNewVersion,
  onShare,
  isSaving,
  isSharing,
}: TemplateVersioningSharingProps) {
  const [shareOpen, setShareOpen] = useState(false)
  const [versionOpen, setVersionOpen] = useState(false)
  const [newVersionTitle, setNewVersionTitle] = useState('')
  const [shareFirmId, setShareFirmId] = useState('')
  const [shareUserIds, setShareUserIds] = useState('')

  if (!template) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center text-muted-foreground">
          Select a template to save as a new version or share across your firm.
        </CardContent>
      </Card>
    )
  }

  const handleSaveAsNewVersion = () => {
    const title = newVersionTitle.trim() || `${template.title} (copy)`
    onSaveAsNewVersion?.(title)
    setNewVersionTitle('')
    setVersionOpen(false)
  }

  const handleShare = () => {
    const payload: { firm_id?: string; user_ids?: string[] } = {}
    if (shareFirmId.trim()) payload.firm_id = shareFirmId.trim()
    if (shareUserIds.trim()) {
      payload.user_ids = shareUserIds
        .split(/[\s,]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    }
    if (payload.firm_id || (payload.user_ids && payload.user_ids.length > 0)) {
      onShare?.(payload)
      setShareFirmId('')
      setShareUserIds('')
      setShareOpen(false)
    } else {
      toast.error('Enter a firm ID or user IDs to share with.')
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save custom template
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Save this template as a new version to preserve changes or create a variant.
          </p>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full sm:w-auto transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => setVersionOpen(true)}
            disabled={isSaving}
          >
            <Copy className="h-4 w-4 mr-2" />
            Save as new version
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share across firm
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Share this template with your firm or specific users so others can use it when creating projects.
          </p>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full sm:w-auto transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => setShareOpen(true)}
            disabled={isSharing}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share template
          </Button>
        </CardContent>
      </Card>

      <Dialog open={versionOpen} onOpenChange={setVersionOpen}>
        <DialogContent showClose>
          <DialogHeader>
            <DialogTitle>Save as new version</DialogTitle>
            <DialogDescription>
              Create a copy of &quot;{template.title}&quot; with a new name. You can then edit phases, decisions, and tasks independently.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="version-title">Template name</Label>
              <Input
                id="version-title"
                value={newVersionTitle}
                onChange={(e) => setNewVersionTitle(e.target.value)}
                placeholder={`${template.title} (copy)`}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVersionOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveAsNewVersion}
              disabled={isSaving}
              className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSaving ? 'Saving…' : 'Save version'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent showClose className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share template</DialogTitle>
            <DialogDescription>
              Share &quot;{template.title}&quot; with your firm or specific users. They will be able to use this template when creating new projects.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="share-firm" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Firm ID (optional)
              </Label>
              <Input
                id="share-firm"
                value={shareFirmId}
                onChange={(e) => setShareFirmId(e.target.value)}
                placeholder="Firm identifier"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="share-users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                User IDs (optional, comma-separated)
              </Label>
              <Input
                id="share-users"
                value={shareUserIds}
                onChange={(e) => setShareUserIds(e.target.value)}
                placeholder="user-id-1, user-id-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              disabled={isSharing}
              className="transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSharing ? 'Sharing…' : 'Share'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
