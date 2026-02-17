import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Users, UserPlus, UserX, Loader2, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AdminUser, UserRole } from '@/types/admin-dashboard'
import {
  useAdminUsers,
  useSeatUsage,
  useInviteUser,
  useUpdateUserRole,
  useDeactivateUser,
} from '@/hooks/use-admin-dashboard'

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  member: 'Member',
  viewer: 'Viewer',
  guest: 'Guest',
}

const STATUS_LABELS: Record<AdminUser['status'], string> = {
  active: 'Active',
  invited: 'Invited',
  deactivated: 'Deactivated',
}

export interface UserManagementProps {
  className?: string
}

export function UserManagement({ className }: UserManagementProps) {
  const { data: users = [], isLoading, isError } = useAdminUsers()
  const { data: seats } = useSeatUsage()
  const inviteMutation = useInviteUser()
  const updateRoleMutation = useUpdateUserRole()
  const deactivateMutation = useDeactivateUser()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<UserRole>('member')

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    const email = inviteEmail.trim()
    if (!email) return
    inviteMutation.mutate(
      { email, role: inviteRole },
      {
        onSuccess: () => {
          setInviteEmail('')
          setInviteRole('member')
          setInviteOpen(false)
        },
      }
    )
  }

  const hasSeats = seats ? seats.available > 0 : true

  if (isError) {
    return (
      <Card className={cn('animate-fade-in border-destructive/30', className)}>
        <CardContent className="py-8 text-center text-sm text-destructive">
          Failed to load users. Please try again.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-6 animate-fade-in', className)}>
      {/* Seat usage card */}
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" aria-hidden />
                Seat usage
              </CardTitle>
              <CardDescription>
                Used seats vs. total available for your plan
              </CardDescription>
            </div>
            {seats ? (
              <div className="text-right">
                <span className="text-2xl font-semibold text-primary">
                  {seats.used}
                </span>
                <span className="text-muted-foreground"> / {seats.total}</span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {seats.available} available
                </p>
              </div>
            ) : (
              <Skeleton className="h-10 w-24" />
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Users table */}
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>Team members</CardTitle>
              <CardDescription>
                Invite users, assign roles, and manage access
              </CardDescription>
            </div>
            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  disabled={!hasSeats}
                  className="gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <UserPlus className="h-4 w-4" aria-hidden />
                  Invite user
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite team member</DialogTitle>
                  <DialogDescription>
                    Send an invitation email. They will get a link to join your
                    firm.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleInvite} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="invite-email">Email</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="colleague@firm.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                      className="focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invite-role">Role</Label>
                    <Select
                      value={inviteRole}
                      onValueChange={(v) => setInviteRole(v as UserRole)}
                    >
                      <SelectTrigger id="invite-role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(ROLE_LABELS) as UserRole[]).map(
                          (role) => (
                            <SelectItem key={role} value={role}>
                              {ROLE_LABELS[role]}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setInviteOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={inviteMutation.isPending}
                      className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {inviteMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" aria-hidden />
                          Send invite
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
              <p className="text-muted-foreground font-medium">No team members yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Invite colleagues to collaborate on projects
              </p>
              <Button
                className="mt-4 gap-2"
                onClick={() => setInviteOpen(true)}
                disabled={!hasSeats}
              >
                <UserPlus className="h-4 w-4" aria-hidden />
                Invite user
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left font-medium p-3">User</th>
                    <th className="text-left font-medium p-3 hidden sm:table-cell">Role</th>
                    <th className="text-left font-medium p-3 hidden md:table-cell">Status</th>
                    <th className="text-right font-medium p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border hover:bg-accent/50 transition-colors"
                    >
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{user.full_name || user.email}</p>
                          <p className="text-muted-foreground text-xs">{user.email}</p>
                        </div>
                      </td>
                      <td className="p-3 hidden sm:table-cell">
                        <Select
                          value={user.role}
                          onValueChange={(v) =>
                            updateRoleMutation.mutate({
                              userId: user.id,
                              role: v as UserRole,
                            })
                          }
                          disabled={
                            user.status === 'deactivated' ||
                            updateRoleMutation.isPending
                          }
                        >
                          <SelectTrigger className="w-[120px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.keys(ROLE_LABELS) as UserRole[]).map(
                              (role) => (
                                <SelectItem key={role} value={role}>
                                  {ROLE_LABELS[role]}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <Badge
                          variant={
                            user.status === 'active'
                              ? 'default'
                              : user.status === 'invited'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {STATUS_LABELS[user.status]}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        {user.status === 'active' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => deactivateMutation.mutate(user.id)}
                            disabled={deactivateMutation.isPending}
                          >
                            <UserX className="h-4 w-4 sm:mr-1" aria-hidden />
                            <span className="hidden sm:inline">Deactivate</span>
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
