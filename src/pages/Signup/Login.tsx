import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  AuthTabs,
  EmailFormLogin,
  EmailFormSignup,
  SSOButtons,
  MagicLinkOption,
  ForgotPasswordLink,
  TermsAndPrivacyCheckbox,
  ClientQuickAccess,
} from '@/components/signup-login'
import type { AuthTabValue } from '@/components/signup-login'
import { login, signup, requestMagicLink, getGoogleOAuthUrl, getSamlSsoUrl } from '@/api/auth'
import type { ApiError } from '@/lib/api'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})

const signupSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[a-zA-Z]/, 'Include letters and numbers')
    .regex(/\d/, 'Include letters and numbers'),
  company_name: z.string().min(1, 'Company name required'),
  termsAccepted: z
    .boolean()
    .refine((v) => v === true, { message: 'You must accept the Terms and Privacy Policy.' }),
})

type LoginForm = z.infer<typeof loginSchema>
type SignupForm = z.infer<typeof signupSchema>

const PAGE_TITLE = 'Sign in or Sign up | SpecLogix'
const PAGE_DESCRIPTION = 'Unified authentication: sign in or create an account with email, SSO, or magic link.'

export default function SignupLoginPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<AuthTabValue>('login')
  const [loading, setLoading] = useState(false)
  const [magicLinkEmail, setMagicLinkEmail] = useState('')
  const [magicLinkLoading, setMagicLinkLoading] = useState(false)
  const [magicLinkError, setMagicLinkError] = useState<string | undefined>(undefined)

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      company_name: '',
      termsAccepted: false,
    },
  })

  const onLogin = async (data: LoginForm) => {
    setLoading(true)
    try {
      await login(data)
      toast.success('Signed in successfully')
      navigate('/dashboard')
    } catch (err) {
      const message = (err as ApiError).message ?? 'Invalid email or password'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const onSignup = async (data: SignupForm) => {
    setLoading(true)
    try {
      await signup({
        email: data.email,
        password: data.password,
        company_name: data.company_name,
      })
      toast.success('Account created. Check your email to verify.')
      navigate('/dashboard')
    } catch (err) {
      const message = (err as ApiError).message ?? 'Sign up failed. Try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const onMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!magicLinkEmail.trim()) {
      setMagicLinkError('Enter your email address.')
      return
    }
    setMagicLinkError(undefined)
    setMagicLinkLoading(true)
    try {
      await requestMagicLink({ email: magicLinkEmail.trim() })
      toast.success('Check your email for the sign-in link.')
      setMagicLinkEmail('')
    } catch (err) {
      const message = (err as ApiError).message ?? 'Failed to send magic link.'
      setMagicLinkError(message)
      toast.error(message)
    } finally {
      setMagicLinkLoading(false)
    }
  }

  const onGoogle = () => {
    window.location.href = getGoogleOAuthUrl()
  }

  const onSamlSso = () => {
    window.location.href = getSamlSsoUrl()
  }

  useEffect(() => {
    const prevTitle = document.title
    document.title = PAGE_TITLE
    const metaDesc = document.querySelector('meta[name="description"]')
    const prevContent = metaDesc?.getAttribute('content') ?? ''
    if (metaDesc) metaDesc.setAttribute('content', PAGE_DESCRIPTION)
    return () => {
      document.title = prevTitle
      if (metaDesc) metaDesc.setAttribute('content', prevContent)
    }
  }, [])

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-fade-in" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <Card className="w-full max-w-md relative z-10 border-border shadow-card transition-all duration-300 hover:shadow-card-hover rounded-xl overflow-hidden">
          <CardHeader className="text-center pb-2">
            <Link
              to="/"
              className="text-xl font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              SpecLogix
            </Link>
            <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight mt-2">
              Welcome
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in or create an account to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AuthTabs
              value={activeTab}
              onValueChange={setActiveTab}
              loginContent={
                <EmailFormLogin
                  register={loginForm.register}
                  errors={loginForm.formState.errors}
                  onSubmit={loginForm.handleSubmit(onLogin)}
                  isLoading={loading}
                  forgotPasswordLink={<ForgotPasswordLink />}
                />
              }
              signupContent={
                <EmailFormSignup
                  register={signupForm.register}
                  errors={signupForm.formState.errors}
                  watch={signupForm.watch}
                  onSubmit={signupForm.handleSubmit(onSignup)}
                  isLoading={loading}
                  termsCheckbox={
                    <TermsAndPrivacyCheckbox
                      register={signupForm.register}
                      errors={signupForm.formState.errors}
                    />
                  }
                />
              }
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider text-muted-foreground">
                Or continue with
              </div>
            </div>

            <SSOButtons
              onGoogle={onGoogle}
              onSamlSso={onSamlSso}
              isLoading={loading}
            />

            <Separator />

            <MagicLinkOption
              email={magicLinkEmail}
              onEmailChange={(v) => {
                setMagicLinkEmail(v)
                setMagicLinkError(undefined)
              }}
              onSubmit={onMagicLink}
              isLoading={magicLinkLoading}
              error={magicLinkError}
            />

            <ClientQuickAccess />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
