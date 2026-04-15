import { Suspense } from 'react'
import { cacheTag, cacheLife } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { addLink, deleteLink } from './actions'
import type { Link } from '@/lib/supabase'

// Cached data layer — PPR: prerendered at build, revalidated on tag
async function LinkList() {
  'use cache'
  cacheTag('links')
  cacheLife('minutes')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: links } = await supabase
    .from('links')
    .select('*')
    .order('created_at', { ascending: false })

  if (!links?.length) {
    return (
      <p className="text-zinc-500 text-sm py-8 text-center">
        저장된 링크가 없습니다. 첫 번째 링크를 추가해보세요.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-zinc-100">
      {(links as Link[]).map(link => (
        <li key={link.id} className="py-4 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-zinc-900 hover:text-blue-600 truncate block"
            >
              {link.title || link.url}
            </a>
            {link.memo && (
              <p className="text-xs text-zinc-500 mt-0.5">{link.memo}</p>
            )}
            {link.tags.length > 0 && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {link.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-zinc-400 mt-1">
              {new Date(link.created_at).toLocaleDateString('ko-KR')}
            </p>
          </div>
          <form action={deleteLink.bind(null, link.id)}>
            <button
              type="submit"
              className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
            >
              삭제
            </button>
          </form>
        </li>
      ))}
    </ul>
  )
}

export default function Page() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-8">링크 저장소</h1>

        {/* Add Link Form */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-8">
          <h2 className="text-sm font-medium text-zinc-700 mb-4">새 링크 추가</h2>
          <form action={addLink} className="space-y-3">
            <input
              name="url"
              type="url"
              required
              placeholder="https://example.com"
              className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            <input
              name="title"
              type="text"
              placeholder="제목 (선택)"
              className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            <input
              name="memo"
              type="text"
              placeholder="메모 (선택)"
              className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            <input
              name="tags"
              type="text"
              placeholder="태그 (쉼표로 구분: react, typescript)"
              className="w-full text-sm border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
            <button
              type="submit"
              className="w-full bg-zinc-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              저장
            </button>
          </form>
        </div>

        {/* Links — static shell + cached list streamed in */}
        <div className="bg-white rounded-xl border border-zinc-200 p-6">
          <h2 className="text-sm font-medium text-zinc-700 mb-4">저장된 링크</h2>
          <Suspense
            fallback={
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-zinc-100 rounded animate-pulse" />
                ))}
              </div>
            }
          >
            <LinkList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
