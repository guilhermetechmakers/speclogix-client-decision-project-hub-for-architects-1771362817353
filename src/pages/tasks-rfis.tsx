import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckSquare, Plus, FileQuestion } from 'lucide-react'

export function TasksRfisPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Tasks & RFIs</h1>
          <p className="text-muted-foreground mt-1">Track tasks and RFIs tied to project items.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> New task</Button>
      </div>
      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="rfis">RFIs</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <CheckSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Kanban and list views. Create a task to get started.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rfis">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">RFI form, lifecycle, and escalation rules.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
