
import type { Database } from './types'

const supabaseUrl = "https://zxjeierbgixwirzcfxzl.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4amVpZXJiZ2l4d2lyemNmeHpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNTQyNjMsImV4cCI6MjA2MjYzMDI2M30.0pJckGVFUcPst7QVBV7ubnI4KuF4kCnVJIw1AcY8oyU"

// Use dynamic import but handle it synchronously
let supabaseClient: any = null

const initializeSupabase = async () => {
  if (supabaseClient) return supabaseClient
  
  try {
    // Import the entire module
    const supabaseModule = await import('@supabase/supabase-js')
    
    // Get createClient from the module - handle different export patterns
    let createClient: any
    
    // Try named export first
    if ('createClient' in supabaseModule) {
      createClient = (supabaseModule as any).createClient
    }
    // Try default export
    else if (supabaseModule.default && 'createClient' in supabaseModule.default) {
      createClient = supabaseModule.default.createClient
    }
    // Try if default itself is createClient
    else if (typeof supabaseModule.default === 'function') {
      createClient = supabaseModule.default
    }
    else {
      throw new Error('Could not find createClient function')
    }
    
    // Create the client without type arguments to avoid TS2347
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        persistSession: true,
        autoRefreshToken: true,
      }
    })
    
    return supabaseClient
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error)
    throw error
  }
}

// Initialize immediately
initializeSupabase().catch(console.error)

// Export a proxy that waits for initialization
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    // If client is already initialized, return the property directly
    if (supabaseClient) {
      const value = supabaseClient[prop]
      return typeof value === 'function' ? value.bind(supabaseClient) : value
    }
    
    // If not initialized, return an async wrapper
    return async (...args: any[]) => {
      const client = await initializeSupabase()
      const method = client[prop]
      if (typeof method === 'function') {
        return method.apply(client, args)
      }
      return method
    }
  }
})
