import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Chrome, Building2 } from 'lucide-react'

export interface SSOButtonsProps {
  onGoogle?: () => void
  onSamlSso?: () => void
  isLoading?: boolean
  className?: string
}

/** Google OAuth and SAML/SSO enterprise options. */
export function SSOButtons({
  onGoogle,
  onSamlSso,
  isLoading,
  className,
}: SSOButtonsProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <Button
        type="button"
        variant="outline"
        className="w-full h-11 rounded-lg border-border bg-background transition-all duration-200 hover:scale-[1.02] hover:shadow-card-hover active:scale-[0.98]"
        onClick={onGoogle}
        disabled={isLoading}
        aria-label="Sign in with Google"
      >
        <Chrome className="h-5 w-5 mr-2 text-muted-foreground" />
        Continue with Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full h-11 rounded-lg border-border bg-background transition-all duration-200 hover:scale-[1.02] hover:shadow-card-hover active:scale-[0.98]"
        onClick={onSamlSso}
        disabled={isLoading}
        aria-label="Sign in with SAML SSO"
      >
        <Building2 className="h-5 w-5 mr-2 text-muted-foreground" />
        SAML / SSO (Enterprise)
      </Button>
    </div>
  )
}
