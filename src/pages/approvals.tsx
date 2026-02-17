import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const mockPending = [
  { id: '1', title: 'Fixture package A', project: 'Riverside Residence', due: 'Feb 20' },
  { id: '2', title: 'Exterior finish', project: 'Lake House', due: 'Feb 22' },
]

export function ApprovalsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Approvals & E-signatures</h1>
        <p className="text-muted-foreground mt-1">Capture approvals and signatures with audit evidence.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pending approvals</CardTitle>
          <CardDescription>Workflow configurator, approvals inbox, e-sign UI, signed archive.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {mockPending.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4 hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.project} · Due {item.due}</p>
                </div>
                <Button asChild size="sm">
                  <Link to={`/dashboard/decisions/${item.id}/approve`}>
                    Review & sign <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
