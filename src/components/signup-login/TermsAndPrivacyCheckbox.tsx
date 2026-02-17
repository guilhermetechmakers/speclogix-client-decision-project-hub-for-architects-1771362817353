import { Link } from 'react-router-dom'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { SignupFormValues } from './EmailForm'

/** Form shape that includes terms acceptance (used for register/errors compatibility). */
export interface TermsFormFields {
  termsAccepted?: boolean
}

export interface TermsAndPrivacyCheckboxProps {
  register: UseFormRegister<SignupFormValues>
  errors: FieldErrors<SignupFormValues>
  termsUrl?: string
  privacyUrl?: string
  className?: string
}

/** Terms and Privacy acknowledgement checkbox for signup. */
export function TermsAndPrivacyCheckbox({
  register,
  errors,
  termsUrl = '/terms',
  privacyUrl = '/privacy',
  className,
}: TermsAndPrivacyCheckboxProps) {
  const err = errors.termsAccepted as { message?: string } | undefined
  const errorMessage = err && typeof err.message === 'string' ? err.message : undefined
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <Checkbox
        id="terms-privacy"
        className="mt-0.5"
        aria-invalid={!!errors.termsAccepted}
        aria-describedby={errorMessage ? 'terms-error' : undefined}
        {...register('termsAccepted')}
      />
      <div className="grid gap-1.5 leading-tight">
        <Label
          htmlFor="terms-privacy"
          className="text-sm font-normal cursor-pointer text-muted-foreground peer-disabled:cursor-not-allowed"
        >
          I agree to the{' '}
          <Link
            to={termsUrl}
            className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            to={privacyUrl}
            className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            Privacy Policy
          </Link>
          .
        </Label>
        {errorMessage && (
          <p id="terms-error" className="text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  )
}
