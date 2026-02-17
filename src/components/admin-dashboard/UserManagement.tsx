import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  useAdminUsers,
  useInviteUser,
  useUpdateUserRole,
  useDeactivateUser,
  useSeatUsage,
} from '@/hooks/use-admin-dashboard'
import type { AdminUser, UserRole } from '@/types/admin-dashboard'
import {
  UserPlus,
  Users,
  MoreHorizontal,
  UserX,
  Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const inviteSchema = z.object({
  email: z.string().email('Enter a valid email'),
  message: z.string().optional(),
  role: z.enum(['admin', 'member', 'viewer', 'guest']) as z.ZodType<UserRole>,
})
type InviteFormValues = z.infer<typeof inviteSchema>

function InviteUserDialog() {
  const [open, setOpen] = useState(false)
  const invite = useInviteUser()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: 'member' },
  })
  const role = watch('role')

  const onSubmit = (data: InviteFormValues) => {
    invite.mutate(
      { email: data.email, role: data.role, message: data.message },
      {
        onSuccess: () => {
          reset()
          setOpen(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-card-hover"
          size="sm"
        >
          <UserPlus className="h-4 w-4" aria-hidden />
          Invite user
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite team member</DialogTitle>
          <DialogDescription>
            Send an invitation email. They will be able to join with the role you assign.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="colleague@firm.com"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-message">Message (optional)</Label>
            <Input
              id="invite-message"
              placeholder="Optional message for invitee"
              {...register('message')}
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={role}
              onValueChange={(v) => setValue('role', v as UserRole)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="guest">Guest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={invite.isPending}>
              {invite.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              )}
              Send invite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function SeatUsageCard() {
  const { data: usage, isLoading } = useSeatUsage()
  if (isLoading) {
    return (
      <Card className="overflow-hidden transition-shadow duration-200">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }
  const used = usage?.used ?? 0
  const total = usage?.total ?? 10
  const available = usage?.available ?? Math.max(0, total - used)
  const pct = total > 0 ? Math.round((used / total) * 100) : 0
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" aria-hidden />
          Seat usage
        </CardTitle>
        <CardDescription>
          {used} of {total} seats used · {available} available
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              pct >= 90 ? 'bg-destructive' : pct >= 70 ? 'bg-warning' : 'bg-primary'
            )}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function RoleSelect({
  user,
  onRoleChange,
}: {
  user: AdminUser
  onRoleChange: (userId: string, role: UserRole) => void
}) {
  const updateRole = useUpdateUserRole()
  return (
    <Select
      value={user.role}
      onValueChange={(v) => onRoleChange(user.id, v as UserRole)}
      disabled={updateRole.isPending}
    >
      <SelectTrigger className="h-9 w-[120px] border-0 bg-transparent shadow-none hover:bg-accent">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="member">Member</SelectItem>
        <SelectItem value="viewer">Viewer</SelectItem>
        <SelectItem value="guest">Guest</SelectItem>
      </SelectContent>
    </Select>
  )
}

export function UserManagement() {
  const { data: users, isLoading, isError } = useAdminUsers()
  const updateRole = useUpdateUserRole()
  const deactivate = useDeactivateUser()
  const reactivate = useReactivateUser()

  const handleRoleChange = (userId: string, role: UserRole) => {
    updateRole.mutate({ userId, role })
  }

  if (isError) {
    return (
      <Card className="border-destructive/30 bg-destructive/10">
        <CardContent className="py-8 text-center text-destructive">
          <p>Unable to load users. Please try again later.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">User management</h2>
          <p className="text-sm text-muted-foreground">
            Invite team members, assign roles, and manage seat usage.
          </p>
        </div>
        <InviteUserDialog />
      </div>

      <SeatUsageCard />

      <Card className="overflow-hidden transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="text-base">Team members</CardTitle>
          <CardDescription>
            View and manage roles. Deactivate users to free a seat.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-9 w-24" />
                </div>
              ))}
            </div>
          ) : !users?.length ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" aria-hidden />
              <p className="text-muted-foreground font-medium">No team members yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Invite your first user to get started.
              </p>
              <InviteUserDialog />
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left font-medium p-4">User</th>
                      <th className="text-left font-medium p-4">Role</th>
                      <th className="text-left font-medium p-4">Status</th>
                      <th className="w-12 p-4" aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-border hover:bg-accent/50 transition-colors"
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{user.full_name || user.email}</p>
                            <p className="text-muted-foreground text-xs">{user.email}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <RoleSelect user={user} onRoleChange={handleRoleChange} />
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={
                              user.status === 'active'
                                ? 'default'
                                : user.status === 'invited'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9"
                                aria-label="Open menu"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {user.status === 'active' && (
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => deactivate.mutate(user.id)}
                                  disabled={deactivate.isPending}
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Deactivate
                                </DropdownMenuItem>
                              )}
                              {user.status === 'deactivated' && (
                                <DropdownMenuItem
                                  onClick={() => reactivate.mutate(user.id)}
                                  disabled={reactivate.isPending}
                                >
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Reactivate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden divide-y divide-border">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 flex flex-col gap-3 hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{user.full_name || user.email}</p>
                        <p className="text-muted-foreground text-xs">{user.email}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Open menu">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.status === 'active' && (
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => deactivate.mutate(user.id)}
                            >
                              Deactivate
                            </DropdownMenuItem>
                          )}
                          {user.status === 'deactivated' && (
                            <DropdownMenuItem onClick={() => reactivate.mutate(user.id)}>
                              Reactivate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <RoleSelect user={user} onRoleChange={handleRoleChange} />
                      <Badge
                        variant={
                          user.status === 'active'
                            ? 'success'
                            : user.status === 'invited'
                              ? 'warning'
                              : 'secondary'
                        }
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
