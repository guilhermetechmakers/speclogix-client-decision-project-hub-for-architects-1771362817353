import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  LayoutDashboard,
  FolderCog,
  HardDrive,
  Database,
  Server,
  Activity,
  Plus,
  Pencil,
  Trash2,
  Inbox,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  usePerformanceCachingBackupList,
  usePerformanceCachingBackupStats,
  useCreatePerformanceCachingBackup,
  useUpdatePerformanceCachingBackup,
  useDeletePerformanceCachingBackup,
} from '@/hooks/use-performance-caching-backup'
import {
  getStatusLabel,
  formatRelativeTime,
  sortByUpdatedDesc,
  prepareCreatePayload,
} from '@/services/performance-caching-backupService'
import type { PerformanceCachingBackup } from '@/types/performance-caching-backup'
import { PolicyFormModal } from './PolicyFormModal'

export function PerformanceCachingBackupFeature() {
  const [activeTab, setActiveTab] = useState('overview')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PerformanceCachingBackup | null>(null)

  const { data: list = [], isLoading: listLoading } = usePerformanceCachingBackupList()
  const { data: stats = {}, isLoading: statsLoading } = usePerformanceCachingBackupStats()
  const createMutation = useCreatePerformanceCachingBackup()
  const updateMutation = useUpdatePerformanceCachingBackup()
  const deleteMutation = useDeletePerformanceCachingBackup()

  const sortedList = sortByUpdatedDesc(list)
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const handleCreate = () => {
    setEditingItem(null)
    setModalOpen(true)
  }

  const handleEdit = (item: PerformanceCachingBackup) => {
    setEditingItem(item)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingItem(null)
  }

  const handleSubmit = (data: { title: string; description?: string; status: string }) => {
    if (editingItem) {
      updateMutation.mutate({
        id: editingItem.id,
        data: { title: data.title, description: data.description, status: data.status },
      })
    } else {
      createMutation.mutate(prepareCreatePayload(data))
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Remove this policy? This cannot be undone.')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in [@media(prefers-reduced-motion:reduce)]:animate-none">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-1 rounded-xl bg-muted p-1">
          <TabsTrigger value="overview" className="gap-2 rounded-lg">
            <LayoutDashboard className="h-4 w-4" aria-hidden />
            Overview
          </TabsTrigger>
          <TabsTrigger value="policies" className="gap-2 rounded-lg">
            <FolderCog className="h-4 w-4" aria-hidden />
            Policies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewSection stats={stats} isLoading={statsLoading} />
        </TabsContent>

        <TabsContent value="policies" className="mt-6">
          <PoliciesSection
            list={sortedList}
            isLoading={listLoading}
            onAdd={handleCreate}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>

      <PolicyFormModal
        open={modalOpen}
        onOpenChange={handleCloseModal}
        initialData={editingItem}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

interface OverviewSectionProps {
  stats: {
    cdnHitRate?: number
    cacheHitRate?: number
    lastBackupAt?: string
    backupRetentionDays?: number
    monitoringStatus?: 'healthy' | 'degraded' | 'critical'
  }
  isLoading: boolean
}

function OverviewSection({ stats, isLoading }: OverviewSectionProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5].map((key) => (
          <Card key={key} className="overflow-hidden transition-shadow duration-200">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'CDN & static assets',
      description: 'Static assets and file previews served via CDN',
      icon: HardDrive,
      value:
        stats.cdnHitRate != null
          ? `${Math.round(stats.cdnHitRate * 100)}% hit rate`
          : 'Enabled',
      accent: 'primary',
    },
    {
      title: 'Caching layer (Redis)',
      description: 'Frequent queries cached for faster response',
      icon: Database,
      value:
        stats.cacheHitRate != null
          ? `${Math.round(stats.cacheHitRate * 100)}% hit rate`
          : 'Active',
      accent: 'primary',
    },
    {
      title: 'Background workers',
      description: 'Thumbnailing, exports, aggregations',
      icon: Server,
      value: 'Running',
      accent: 'primary',
    },
    {
      title: 'Database backups',
      description: 'Point-in-time recovery and retention policies',
      icon: FolderCog,
      value:
        stats.lastBackupAt != null
          ? `Last: ${stats.lastBackupAt}`
          : stats.backupRetentionDays != null
            ? `${stats.backupRetentionDays} days retention`
            : 'Configured',
      accent: 'primary',
    },
    {
      title: 'Monitoring & alerting',
      description: 'Sentry, Prometheus, synthetic tests',
      icon: Activity,
      value:
        stats.monitoringStatus === 'healthy'
          ? 'Healthy'
          : stats.monitoringStatus === 'degraded'
            ? 'Degraded'
            : stats.monitoringStatus === 'critical'
              ? 'Critical'
              : 'Active',
      accent:
        stats.monitoringStatus === 'critical'
          ? 'destructive'
          : stats.monitoringStatus === 'degraded'
            ? 'warning'
            : 'primary',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((item) => (
        <Card
          key={item.title}
          className="overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:border-primary/20 group"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'rounded-lg p-2 transition-colors',
                  item.accent === 'destructive' && 'bg-destructive/10 text-destructive',
                  item.accent === 'warning' && 'bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]',
                  (item.accent === 'primary' || !item.accent) &&
                    'bg-primary/10 text-primary group-hover:bg-primary/20'
                )}
              >
                <item.icon className="h-5 w-5" aria-hidden />
              </div>
              <CardTitle className="text-base">{item.title}</CardTitle>
            </div>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold tracking-tight text-foreground">
              {item.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

interface PoliciesSectionProps {
  list: PerformanceCachingBackup[]
  isLoading: boolean
  onAdd: () => void
  onEdit: (item: PerformanceCachingBackup) => void
  onDelete: (id: string) => void
}

function PoliciesSection({
  list,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
}: PoliciesSectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (list.length === 0) {
    return (
      <Card className="border-dashed transition-all duration-200 hover:border-primary/30">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Inbox className="h-10 w-10 text-muted-foreground" aria-hidden />
          </div>
          <h3 className="text-lg font-semibold">No policies yet</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            Add performance, caching, or backup policies to manage CDN, Redis, workers, and retention.
          </p>
          <Button onClick={onAdd} className="mt-6 gap-2" size="lg">
            <Plus className="h-4 w-4" aria-hidden />
            Add policy
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={onAdd} className="gap-2">
          <Plus className="h-4 w-4" aria-hidden />
          Add policy
        </Button>
      </div>
      <ul className="space-y-2" role="list">
        {list.map((item) => (
          <li key={item.id}>
            <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:border-primary/20">
              <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium truncate">{item.title}</h4>
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        item.status === 'active'
                          ? 'default'
                          : item.status === 'paused'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {getStatusLabel(item.status)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Updated {formatRelativeTime(item.updated_at)}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2 pt-2 sm:pt-0">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(item)}
                    aria-label={`Edit ${item.title}`}
                  >
                    <Pencil className="h-4 w-4" aria-hidden />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(item.id)}
                    aria-label={`Delete ${item.title}`}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
