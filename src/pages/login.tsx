import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})

const signupSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
  name: z.string().min(1, 'Name required'),
})

type LoginForm = z.infer<typeof loginSchema>
type SignupForm = z.infer<typeof signupSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', name: '' },
  })

  const onLogin = async (_data: LoginForm) => {
    setLoading(true)
    try {
      // Placeholder: would call api.post('/auth/login', data)
      await new Promise((r) => setTimeout(r, 600))
      toast.success('Signed in successfully')
      navigate('/dashboard')
    } catch {
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const onSignup = async (_data: SignupForm) => {
    setLoading(true)
    try {
      // Placeholder: would call api.post('/auth/signup', data)
      await new Promise((r) => setTimeout(r, 600))
      toast.success('Account created. Check your email to verify.')
      navigate('/dashboard')
    } catch {
      toast.error('Sign up failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="text-xl font-semibold text-primary">SpecLogix</Link>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in or create an account to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@firm.com"
                    {...loginForm.register('email')}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    {...loginForm.register('password')}
                  />
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign in'}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Name</Label>
                  <Input
                    id="signup-name"
                    placeholder="Your name"
                    {...signupForm.register('name')}
                  />
                  {signupForm.formState.errors.name && (
                    <p className="text-sm text-destructive">{signupForm.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@firm.com"
                    {...signupForm.register('email')}
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-sm text-destructive">{signupForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Min 8 characters"
                    {...signupForm.register('password')}
                  />
                  {signupForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{signupForm.formState.errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account…' : 'Create account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Client with a magic link? <Link to="/client-access" className="text-primary hover:underline">Quick access</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
