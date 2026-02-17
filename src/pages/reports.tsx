import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { BarChart3 } from 'lucide-react'

const mockData = [
  { name: 'Jan', decisions: 12, approved: 10 },
  { name: 'Feb', decisions: 8, approved: 6 },
  { name: 'Mar', decisions: 15, approved: 14 },
]

export function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Project health, custom builder, export, alerting rules.</p>
        </div>
        <Button variant="outline">Export</Button>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Decisions over time</CardTitle>
            <CardDescription>Published vs approved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="decisions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="approved" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Report dashboard</CardTitle>
            <CardDescription>Custom builder and scheduled reports.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">Build custom reports and set up alerting rules.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
