import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, key)

export type Link = {
  id: string
  url: string
  title: string | null
  memo: string | null
  tags: string[]
  created_at: string
}
