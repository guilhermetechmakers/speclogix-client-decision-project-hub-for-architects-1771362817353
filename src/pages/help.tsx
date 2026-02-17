import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, MessageCircle } from 'lucide-react'

export function HelpPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground mt-2">KB, onboarding checklist, tickets, chat.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="transition-shadow hover:shadow-card-hover">
            <CardHeader>
              <BookOpen className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Knowledge base</CardTitle>
              <CardDescription>Guides and FAQs</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Browse articles</Button>
            </CardContent>
          </Card>
          <Card className="transition-shadow hover:shadow-card-hover">
            <CardHeader>
              <MessageCircle className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Contact support</CardTitle>
              <CardDescription>Submit a ticket or chat</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Get in touch</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
