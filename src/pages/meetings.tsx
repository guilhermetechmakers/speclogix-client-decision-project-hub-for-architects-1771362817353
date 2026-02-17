import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Plus } from 'lucide-react'

export function MeetingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Meetings & Agendas</h1>
          <p className="text-muted-foreground mt-1">Plan meetings and convert outcomes to actions.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> New meeting</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming meetings</CardTitle>
          <CardDescription>Agenda builder, minutes & actions, calendar sync.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No meetings scheduled. Create one to get started.</p>
        </CardContent>
      </Card>
    </div>
  )
}
