'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase env vars not configured')
  return createClient(url, key)
}

export async function addLink(formData: FormData) {
  const url = formData.get('url') as string
  const title = formData.get('title') as string
  const memo = formData.get('memo') as string
  const tagsRaw = formData.get('tags') as string
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : []

  const supabase = getClient()
  await supabase.from('links').insert({ url, title, memo, tags })
  revalidatePath('/', 'page')
}

export async function deleteLink(id: string) {
  const supabase = getClient()
  await supabase.from('links').delete().eq('id', id)
  revalidatePath('/', 'page')
}
