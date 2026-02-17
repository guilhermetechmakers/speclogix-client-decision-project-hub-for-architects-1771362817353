import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'

export interface ClientQuickAccessProps {
  className?: string
  href?: string
  label?: string
}

/** Simplified portal link with limited (client) view. */
export function ClientQuickAccess({
  className,
  href = '/client-access',
  label = 'Client quick access',
}: ClientQuickAccessProps) {
  return (
    <div className={cn('text-center', className)}>
      <p className="text-sm text-muted-foreground">
        Have a magic link?{' '}
        <Button
          variant="link"
          className="h-auto p-0 text-primary hover:underline font-medium inline-flex items-center gap-1.5 transition-all duration-200 hover:scale-[1.02]"
          asChild
        >
          <Link to={href}>
            {label}
            <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </Button>
      </p>
    </div>
  )
}
