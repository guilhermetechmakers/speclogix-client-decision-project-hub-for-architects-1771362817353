import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  UserManagement,
  BillingSubscription,
  SecuritySettings,
  TemplateProjectManagement,
  SystemAuditLogs,
} from '@/components/admin-dashboard'
import { useAdminDashboardStats } from '@/hooks/use-admin-dashboard'
import {
  Users,
  CreditCard,
  Shield,
  LayoutTemplate,
  FileText,
  Activity,
  FolderKanban,
  ClipboardList,
  Settings,
  HelpCircle,
} from 'lucide-react'

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const { data: stats, isLoading: statsLoading, isError: statsError } = useAdminDashboardStats()

  useEffect(() => {
    document.title = 'Admin & Billing | SpecLogix'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Firm-level admin: user management, billing, SSO, templates, and audit logs. SpecLogix.'
      )
    }
    return () => {
      document.title = 'SpecLogix'
    }
  }, [])

  return (
    <div className="space-y-6 animate-fade-in [@media(prefers-reduced-motion:reduce)]:animate-none">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Admin & Billing
        </h1>
        <p className="mt-1 text-muted-foreground">
          Firm-level controls for users, billing, security, templates, and audit logs.
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-1 rounded-xl bg-muted p-1 sm:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="overview" className="gap-2 rounded-lg">
            <Activity className="h-4 w-4 shrink-0" aria-hidden />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2 rounded-lg">
            <Users className="h-4 w-4 shrink-0" aria-hidden />
            Users
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2 rounded-lg">
            <CreditCard className="h-4 w-4 shrink-0" aria-hidden />
            Billing
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 rounded-lg">
            <Shield className="h-4 w-4 shrink-0" aria-hidden />
            Security
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-2 rounded-lg">
            <LayoutTemplate className="h-4 w-4 shrink-0" aria-hidden />
            Templates
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2 rounded-lg">
            <FileText className="h-4 w-4 shrink-0" aria-hidden />
            Audit logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            {statsError && (
              <Card className="border-destructive/30 bg-destructive/10">
                <CardContent className="py-6 text-center text-destructive">
                  <p>Unable to load dashboard stats. Please try again later.</p>
                </CardContent>
              </Card>
            )}
            {!statsError && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:border-primary/20">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Active projects
                    </CardTitle>
                    <FolderKanban className="h-4 w-4 text-muted-foreground" aria-hidden />
                  </CardHeader>
                  <CardContent>
                    {statsLoading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <span className="text-2xl font-bold">
                        {stats?.active_projects_count ?? 0}
                      </span>
                    )}
                  </CardContent>
                </Card>
                <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:border-primary/20">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Team members
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" aria-hidden />
                  </CardHeader>
                  <CardContent>
                    {statsLoading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <span className="text-2xl font-bold">
                        {stats?.team_members_count ?? 0}
                      </span>
                    )}
                  </CardContent>
                </Card>
                <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:border-primary/20">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Pending approvals
                    </CardTitle>
                    <ClipboardList className="h-4 w-4 text-muted-foreground" aria-hidden />
                  </CardHeader>
                  <CardContent>
                    {statsLoading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <span className="text-2xl font-bold">
                        {stats?.pending_approvals_count ?? 0}
                      </span>
                    )}
                  </CardContent>
                </Card>
                <Card className="overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:border-primary/20">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Recent activity
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" aria-hidden />
                  </CardHeader>
                  <CardContent>
                    {statsLoading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <span className="text-2xl font-bold">
                        {stats?.recent_activity_count ?? 0}
                      </span>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            <Card className="overflow-hidden transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-base">Manage settings & access help</CardTitle>
                <CardDescription>
                  Quick links to user management, billing, security, and support.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-card-hover"
                  onClick={() => setActiveTab('users')}
                >
                  <Users className="h-4 w-4" aria-hidden />
                  Invite user
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-card-hover"
                  onClick={() => setActiveTab('billing')}
                >
                  <CreditCard className="h-4 w-4" aria-hidden />
                  Billing & plan
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-card-hover"
                  onClick={() => setActiveTab('security')}
                >
                  <Shield className="h-4 w-4" aria-hidden />
                  Security & SSO
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link
                    to="/dashboard/settings"
                    className="gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-card-hover"
                  >
                    <Settings className="h-4 w-4" aria-hidden />
                    Settings
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link
                    to="/help"
                    className="gap-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-card-hover"
                  >
                    <HelpCircle className="h-4 w-4" aria-hidden />
                    Help & Support
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <BillingSubscription />
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <TemplateProjectManagement />
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <SystemAuditLogs />
        </TabsContent>
      </Tabs>
    </div>
  )
}
