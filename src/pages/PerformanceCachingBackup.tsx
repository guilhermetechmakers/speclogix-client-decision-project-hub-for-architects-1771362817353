import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { PerformanceCachingBackupFeature } from '@/components/performance-caching-backup'

export default function PerformanceCachingBackupPage() {
  useEffect(() => {
    document.title = 'Performance, Caching & Backup | SpecLogix'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Performance optimization, CDN, Redis caching, background workers, database backups, and monitoring. SpecLogix.'
      )
    }
    return () => {
      document.title = 'SpecLogix'
    }
  }, [])

  return (
    <div className="space-y-6 animate-fade-in [@media(prefers-reduced-motion:reduce)]:animate-none">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link
          to="/dashboard"
          className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
        <span className="text-foreground font-medium">Performance, Caching & Backup</span>
      </nav>

      <header>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Performance, Caching & Backup
        </h1>
        <p className="mt-1 text-muted-foreground">
          CDN for static assets, Redis caching, background workers, database backups, and monitoring &amp; alerting.
        </p>
      </header>

      <PerformanceCachingBackupFeature />
    </div>
  )
}
