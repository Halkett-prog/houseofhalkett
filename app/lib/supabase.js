// app/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mtjnljeavnbhpzjtuyeg.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10am5samVhdm5iaHB6anR1eWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMTc4MjQsImV4cCI6MjA2OTc5MzgyNH0.s1idL47uwk3NKUo6dBLi2E7fIZlLGC94VfObzm5zDAY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)