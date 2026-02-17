import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Lock } from 'lucide-react'

export interface ForgotPasswordLinkProps {
  className?: string
  to?: string
}

/** Link to forgot-password page. */
export function ForgotPasswordLink({
  className,
  to = '/forgot-password',
}: ForgotPasswordLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex items-center gap-1.5 text-sm text-primary hover:underline transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded',
        className
      )}
    >
      <Lock className="h-4 w-4 shrink-0" aria-hidden />
      Forgot password?
    </Link>
  )
}
