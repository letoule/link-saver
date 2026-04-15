'use server'

import { revalidateTag } from 'next/cache'
import { createClient } from '@supabase/supabase-js'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function addLink(formData: FormData) {
  const url = formData.get('url') as string
  const title = formData.get('title') as string
  const memo = formData.get('memo') as string
  const tagsRaw = formData.get('tags') as string
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : []

  const supabase = getClient()
  await supabase.from('links').insert({ url, title, memo, tags })
  revalidateTag('links')
}

export async function deleteLink(id: string) {
  const supabase = getClient()
  await supabase.from('links').delete().eq('id', id)
  revalidateTag('links')
}
