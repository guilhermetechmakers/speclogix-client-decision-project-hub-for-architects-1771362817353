import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MagicLinkOptionProps {
  email: string
  onEmailChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading?: boolean
  error?: string
  className?: string
}

/** Request email magic link for client ease. */
export function MagicLinkOption({
  email,
  onEmailChange,
  onSubmit,
  isLoading,
  error,
  className,
}: MagicLinkOptionProps) {
  return (
    <form onSubmit={onSubmit} className={cn('space-y-3', className)}>
      <Label htmlFor="magic-email" className="text-sm font-medium">
        Get a sign-in link by email
      </Label>
      <div className="flex gap-2">
        <Input
          id="magic-email"
          type="email"
          autoComplete="email"
          placeholder="you@firm.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="flex-1 transition-colors focus-visible:ring-2"
          aria-invalid={!!error}
          aria-describedby={error ? 'magic-error' : undefined}
        />
        <Button
          type="submit"
          variant="secondary"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          disabled={isLoading}
          aria-label="Send magic link"
        >
          <Mail className="h-5 w-5" />
        </Button>
      </div>
      {error && (
        <p id="magic-error" className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
