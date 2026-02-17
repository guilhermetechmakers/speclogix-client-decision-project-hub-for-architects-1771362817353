import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from 'react-router-dom'

export function ClientAccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Client quick access</CardTitle>
          <CardDescription>Enter your magic link token or sign in with email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">Magic link token</Label>
            <Input id="token" placeholder="Paste link or token" />
          </div>
          <Button className="w-full">Continue</Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline">Firm sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
