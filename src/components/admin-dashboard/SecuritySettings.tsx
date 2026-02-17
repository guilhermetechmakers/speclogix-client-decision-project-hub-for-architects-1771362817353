import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Shield, Key, Lock, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  useSecuritySettings,
  useUpdateSecuritySettings,
} from '@/hooks/use-admin-dashboard'

export interface SecuritySettingsProps {
  className?: string
}

export function SecuritySettings({ className }: SecuritySettingsProps) {
  const { data: settings, isLoading, isError } = useSecuritySettings()
  const updateMutation = useUpdateSecuritySettings()
  const [form, setForm] = useState({
    sso_enabled: false,
    saml_entity_id: '',
    saml_sso_url: '',
    password_min_length: 8,
    password_require_special: true,
    two_fa_required: false,
    two_fa_enforced_for_admins: false,
  })

  useEffect(() => {
    if (!settings) return
    setForm({
      sso_enabled: settings.sso_enabled,
      saml_entity_id: settings.saml_entity_id ?? '',
      saml_sso_url: settings.saml_sso_url ?? '',
      password_min_length: settings.password_min_length,
      password_require_special: settings.password_require_special,
      two_fa_required: settings.two_fa_required,
      two_fa_enforced_for_admins: settings.two_fa_enforced_for_admins,
    })
  }, [settings])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate({
      sso_enabled: form.sso_enabled,
      saml_entity_id: form.saml_entity_id || undefined,
      saml_sso_url: form.saml_sso_url || undefined,
      password_min_length: form.password_min_length,
      password_require_special: form.password_require_special,
      two_fa_required: form.two_fa_required,
      two_fa_enforced_for_admins: form.two_fa_enforced_for_admins,
    })
  }

  if (isError) {
    return (
      <Card className={cn('animate-fade-in border-destructive/30', className)}>
        <CardContent className="py-8 text-center text-sm text-destructive">
          Failed to load security settings. Please try again.
        </CardContent>
      </Card>
    )
  }

  if (isLoading || !settings) {
    return (
      <div className={cn('space-y-6 animate-fade-in', className)}>
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    )
  }

  const formState = form

  return (
    <div className={cn('space-y-6 animate-fade-in', className)}>
      {/* SSO / SAML */}
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" aria-hidden />
            SSO / SAML setup
          </CardTitle>
          <CardDescription>
            Configure single sign-on with your identity provider
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sso_enabled"
              checked={formState.sso_enabled}
              onChange={(e) =>
                setForm((f) => ({ ...f, sso_enabled: e.target.checked }))
              }
            />
            <Label htmlFor="sso_enabled" className="font-normal cursor-pointer">
              Enable SSO (SAML 2.0)
            </Label>
          </div>
          {formState.sso_enabled && (
            <div className="grid gap-4 sm:grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor="saml_entity_id">Entity ID</Label>
                <Input
                  id="saml_entity_id"
                  placeholder="https://your-firm.com/saml"
                  value={formState.saml_entity_id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, saml_entity_id: e.target.value }))
                  }
                  className="focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="saml_sso_url">SSO URL</Label>
                <Input
                  id="saml_sso_url"
                  placeholder="https://idp.example.com/sso"
                  value={formState.saml_sso_url}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, saml_sso_url: e.target.value }))
                  }
                  className="focus:border-primary"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password policies */}
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" aria-hidden />
            Password policies
          </CardTitle>
          <CardDescription>
            Minimum requirements for user passwords
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password_min_length">Minimum length</Label>
            <Input
              id="password_min_length"
              type="number"
              min={6}
              max={32}
              value={formState.password_min_length}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  password_min_length: Math.max(
                    6,
                    Math.min(32, parseInt(e.target.value, 10) || 8)
                  ),
                }))
              }
              className="w-24 focus:border-primary"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="password_require_special"
              checked={formState.password_require_special}
              onChange={(e) =>
                setForm((f) => ({ ...f, password_require_special: e.target.checked }))
              }
            />
            <Label htmlFor="password_require_special" className="font-normal cursor-pointer">
              Require special characters
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* 2FA enforcement */}
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" aria-hidden />
            2FA enforcement
          </CardTitle>
          <CardDescription>
            Require two-factor authentication for added security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="two_fa_required"
              checked={formState.two_fa_required}
              onChange={(e) =>
                setForm((f) => ({ ...f, two_fa_required: e.target.checked }))
              }
            />
            <Label htmlFor="two_fa_required" className="font-normal cursor-pointer">
              Require 2FA for all users
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="two_fa_enforced_for_admins"
              checked={formState.two_fa_enforced_for_admins}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  two_fa_enforced_for_admins: e.target.checked,
                }))
              }
            />
            <Label
              htmlFor="two_fa_enforced_for_admins"
              className="font-normal cursor-pointer"
            >
              Enforce 2FA for admins
            </Label>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSubmit}
        disabled={updateMutation.isPending}
        className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
      >
        {updateMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : null}
        Save security settings
      </Button>
    </div>
  )
}
