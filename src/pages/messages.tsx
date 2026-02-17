import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'

export function MessagesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Contextual Messaging & Comments</h1>
        <p className="text-muted-foreground mt-1">Threaded communication tied to project entities.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Threads</CardTitle>
          <CardDescription>Composer with mentions, thread view, context switcher.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No threads yet. Comments appear when you discuss decisions or files.</p>
        </CardContent>
      </Card>
    </div>
  )
}
