import { createClient } from '@supabase/supabase-js'

// Next.js uses process.env to access your variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Safety check: prevent the app from crashing if env vars are missing
if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase URL or Key is missing from .env.local")
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase