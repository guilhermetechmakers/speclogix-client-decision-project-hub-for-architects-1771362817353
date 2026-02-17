import { api } from '@/lib/api'
import type { SignupLoginRecord, LoginCredentials, SignupCredentials, MagicLinkRequest } from '@/types/auth'

export interface AuthSession {
  access_token: string
  user?: { id: string; email?: string }
}

/** Login with email/password. On success, store token and return session. */
export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const res = await api.post<AuthSession>('/auth/login', credentials)
  if (res?.access_token) {
    try {
      localStorage.setItem('access_token', res.access_token)
    } catch {
      // ignore
    }
  }
  return res as AuthSession
}

/** Sign up with email, password, company name. */
export async function signup(credentials: SignupCredentials): Promise<AuthSession> {
  const res = await api.post<AuthSession>('/auth/signup', credentials)
  if (res?.access_token) {
    try {
      localStorage.setItem('access_token', res.access_token)
    } catch {
      // ignore
    }
  }
  return res as AuthSession
}

/** Request magic link to email. */
export async function requestMagicLink(data: MagicLinkRequest): Promise<void> {
  await api.post('/auth/magic-link', data)
}

/** Initiate Google OAuth (redirect or return URL). */
export function getGoogleOAuthUrl(): string {
  const base = import.meta.env.VITE_API_URL ?? ''
  return `${base}/auth/oauth/google`
}

/** Initiate SAML/SSO (redirect URL). */
export function getSamlSsoUrl(): string {
  const base = import.meta.env.VITE_API_URL ?? ''
  return `${base}/auth/sso`
}

/** Fetch current user's signup_login records (for profile/settings). */
export async function getSignupLoginRecords(): Promise<SignupLoginRecord[]> {
  const res = await api.get<SignupLoginRecord[]>('/signup-login')
  return res ?? []
}
