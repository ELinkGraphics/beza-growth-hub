// @ts-nocheck
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = "https://zxjeierbgixwirzcfxzl.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4amVpZXJiZ2l4d2lyemNmeHpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNTQyNjMsImV4cCI6MjA2MjYzMDI2M30.0pJckGVFUcPst7QVBV7ubnI4KuF4kCnVJIw1AcY8oyU"

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)