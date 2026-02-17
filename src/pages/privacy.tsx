import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto max-w-3xl prose prose-neutral dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">
          This page contains our privacy policy. We respect your data and provide export/delete options in your account settings.
        </p>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your data</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Export my data</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
