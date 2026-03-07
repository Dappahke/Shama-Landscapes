import { createClient } from '@supabase/supabase-js'

// We assign the values from your environment variables to the names the client expects
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// This creates the connection
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase