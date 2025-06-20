
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://wumlallyqfgycagqhkxt.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1bWxhbGx5cWZneWNhZ3Foa3h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzMDYwMjcsImV4cCI6MjA0OTg4MjAyN30.0TaOX3a_K5iRpNZJyxeN1J77VNpzNjADWi_OGPMrRdU"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
