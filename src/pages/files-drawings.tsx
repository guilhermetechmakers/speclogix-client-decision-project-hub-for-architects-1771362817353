import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FolderOpen, FileText, Upload, Search } from 'lucide-react'

const mockFolders = [
  { id: '1', name: 'Drawings', count: 8 },
  { id: '2', name: 'Specs', count: 5 },
  { id: '3', name: 'Photos', count: 12 },
]

const mockFiles = [
  { id: '1', name: 'Floor-Plan-A.pdf', type: 'PDF', updated: '2 hours ago' },
  { id: '2', name: 'Sections.dwg', type: 'DWG', updated: '1 day ago' },
]

export function FilesDrawingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Files & Drawings</h1>
          <p className="text-muted-foreground mt-1">Repository for drawings and deliverables with previews and versioning.</p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" /> Upload
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1 space-y-2">
          <p className="text-sm font-medium">Folders</p>
          <ul className="space-y-1">
            {mockFolders.map((f) => (
              <li key={f.id}>
                <button type="button" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted">
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{f.name}</span>
                  <span className="ml-auto text-muted-foreground">{f.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-3 space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search files…" className="pl-9" />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Files</CardTitle>
              <CardDescription>Click to preview or download</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mockFiles.map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50"
                  >
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.type} · {file.updated}</p>
                    </div>
                    <Button variant="ghost" size="sm">Open</Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
