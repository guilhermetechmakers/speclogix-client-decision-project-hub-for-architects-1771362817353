const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export type ApiError = {
  message: string
  code?: string
  status?: number
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = localStorage.getItem('access_token')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`
  const headers = await getAuthHeaders()
  const config: RequestInit = {
    ...options,
    headers: { ...headers, ...options.headers },
  }
  const res = await fetch(url, config)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const err: ApiError = {
      message: (body as { message?: string }).message ?? res.statusText,
      code: (body as { code?: string }).code,
      status: res.status,
    }
    throw err
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(endpoint: string, body?: unknown) =>
    apiRequest<T>(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' }),
}
