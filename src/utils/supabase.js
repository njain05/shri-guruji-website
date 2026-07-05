import { createClient } from '@supabase/supabase-js'

const SUPABASE_ENABLED = import.meta.env.VITE_SUPABASE_ENABLED === 'true'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null

if (SUPABASE_ENABLED && SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  console.info('Supabase connected')
} else {
  console.info('Supabase disabled or not configured. Running in local mode.')
}

export { supabase }
