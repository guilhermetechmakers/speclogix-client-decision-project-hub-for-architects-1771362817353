/** Record for signup_/_login table (user session/metadata). */
export interface SignupLoginRecord {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  company_name: string
}

export interface MagicLinkRequest {
  email: string
}
