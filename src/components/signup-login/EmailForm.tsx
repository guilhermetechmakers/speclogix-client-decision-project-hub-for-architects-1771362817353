import * as React from 'react'
import type { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface LoginFormValues {
  email: string
  password: string
}

export interface SignupFormValues {
  email: string
  password: string
  company_name: string
  termsAccepted: boolean
}

const PASSWORD_RULES = [
  'At least 8 characters',
  'Include letters and numbers',
] as const

function PasswordRules({ password }: { password: string }) {
  const hasMinLength = password.length >= 8
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const rules = [
    { label: PASSWORD_RULES[0], met: hasMinLength },
    { label: 'Include letters and numbers', met: hasLetter && hasNumber },
  ]
  return (
    <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground" role="list">
      {rules.map(({ label, met }) => (
        <li
          key={label}
          className={cn(
            'flex items-center gap-2 transition-colors',
            met ? 'text-success' : ''
          )}
        >
          {met ? (
            <span className="inline-block h-4 w-4 rounded-full bg-success/20 text-success" aria-hidden>
              ✓
            </span>
          ) : (
            <span className="inline-block h-4 w-4 rounded-full border border-input" aria-hidden />
          )}
          {label}
        </li>
      ))}
    </ul>
  )
}

export interface EmailFormLoginProps {
  register: UseFormRegister<LoginFormValues>
  errors: FieldErrors<LoginFormValues>
  onSubmit: (e: React.FormEvent) => void
  isLoading?: boolean
  forgotPasswordLink: React.ReactNode
}

/** Email + password login form. */
export function EmailFormLogin({
  register,
  errors,
  onSubmit,
  isLoading,
  forgotPasswordLink,
}: EmailFormLoginProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@firm.com"
          className="transition-colors focus-visible:ring-2"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive animate-fade-in" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="transition-colors focus-visible:ring-2"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-destructive animate-fade-in" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>
      <div className="flex justify-end">{forgotPasswordLink}</div>
      <Button
        type="submit"
        className="w-full h-11 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-card-hover active:scale-[0.98]"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}

export interface EmailFormSignupProps {
  register: UseFormRegister<SignupFormValues>
  errors: FieldErrors<SignupFormValues>
  watch: UseFormWatch<SignupFormValues>
  onSubmit: (e: React.FormEvent) => void
  isLoading?: boolean
  termsCheckbox: React.ReactNode
}

/** Email, password, company name (signup) with password rules. */
export function EmailFormSignup({
  register,
  errors,
  watch,
  onSubmit,
  isLoading,
  termsCheckbox,
}: EmailFormSignupProps) {
  const password = watch('password', '')

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          autoComplete="email"
          placeholder="you@firm.com"
          className="transition-colors focus-visible:ring-2"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive animate-fade-in" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-company">Company name</Label>
        <Input
          id="signup-company"
          type="text"
          autoComplete="organization"
          placeholder="Your firm or company"
          className="transition-colors focus-visible:ring-2"
          {...register('company_name')}
        />
        {errors.company_name && (
          <p className="text-sm text-destructive animate-fade-in" role="alert">
            {errors.company_name.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          placeholder="Min 8 characters, letters and numbers"
          className="transition-colors focus-visible:ring-2"
          {...register('password')}
        />
        <PasswordRules password={password} />
        {errors.password && (
          <p className="text-sm text-destructive animate-fade-in" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>
      <div className="flex items-start gap-2">{termsCheckbox}</div>
      <Button
        type="submit"
        className="w-full h-11 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-card-hover active:scale-[0.98]"
        disabled={isLoading}
      >
        {isLoading ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  )
}
