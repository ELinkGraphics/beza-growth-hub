
import type { Database } from './types'

const supabaseUrl = "https://zxjeierbgixwirzcfxzl.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4amVpZXJiZ2l4d2lyemNmeHpsIiwicm9sZUFDVEIOb24iLCJpYXQiOjE3NDcwNTQyNjMsImV4cCI6MjA2MjYzMDI2M30.0pJckGVFUcPst7QVBV7ubnI4KuF4kCnVJIw1AcY8oyU"

// Dynamic import to bypass TypeScript issues
const createSupabaseClient = async () => {
  const supabaseModule = await import('@supabase/supabase-js')
  const createClient = supabaseModule.createClient || (supabaseModule as any).default?.createClient || (supabaseModule as any).default
  
  if (!createClient) {
    throw new Error('Could not find createClient in @supabase/supabase-js')
  }
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    }
  })
}

// Create a promise-based client that resolves to the actual Supabase client
let supabaseClientPromise: Promise<any> | null = null

const getSupabaseClient = () => {
  if (!supabaseClientPromise) {
    supabaseClientPromise = createSupabaseClient()
  }
  return supabaseClientPromise
}

// Export a proxy that handles async resolution
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    if (prop === 'then' || prop === 'catch' || prop === 'finally') {
      return getSupabaseClient()[prop as keyof Promise<any>].bind(getSupabaseClient())
    }
    
    return async (...args: any[]) => {
      const client = await getSupabaseClient()
      const method = client[prop]
      if (typeof method === 'function') {
        return method.apply(client, args)
      }
      return method
    }
  }
})
