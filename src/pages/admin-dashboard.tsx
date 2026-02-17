import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, CreditCard, Shield, FileText } from 'lucide-react'

export function AdminDashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Firm-level controls for users, billing, security, and audits.</p>
      </div>
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="audit">Audit logs</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User management</CardTitle>
              <CardDescription>Invite team, roles, and permissions.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Manage users and roles.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>Stripe integration, seats, invoices.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">View invoices and manage subscription.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security & SSO</CardTitle>
              <CardDescription>SSO/SAML configuration.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Configure SSO and security policies.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Audit logs</CardTitle>
              <CardDescription>Activity and compliance records.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">View audit logs and export.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
