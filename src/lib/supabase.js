import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with the correct credentials
const supabaseUrl = 'https://kfsxmhmvthexftmtawap.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmc3htaG12dGhleGZ0bXRhd2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNzUwNDAsImV4cCI6MjA2Nzc1MTA0MH0.ZpGtbNzHj_FQdtu_tMRP_OyfUG0icxAfnefT4NA7IJg'

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials')
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export { supabase }