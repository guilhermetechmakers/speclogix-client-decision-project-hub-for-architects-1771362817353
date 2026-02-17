import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

const schema = z.object({ email: z.string().email('Invalid email') })
type Form = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  const onSubmit = (_data: Form) => {
    toast.success('Check your email for the reset link.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>Enter your email and we'll send a reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@firm.com" {...form.register('email')} />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">Send reset link</Button>
            <Button variant="link" className="w-full" asChild>
              <Link to="/login">Back to login</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
