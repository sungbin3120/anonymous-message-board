import Link from 'next/link'
import { listPosts } from '@/src/services/postApi'
import { isMockBoard, listMockPosts } from './mockPosts'

export const dynamic = 'force-dynamic'

export default async function PostsPage({ searchParams }: {
  searchParams: Promise<{ q?: string | string[]; page?: string | string[] }>
}) {
  const params = await searchParams
  const q = typeof params.q === 'string' ? params.q.trim() : ''
  const requestedPage = typeof params.page === 'string' ? Number(params.page) : 1
  const currentPage = Number.isSafeInteger(requestedPage * 10) && Number.isInteger(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1
  const { posts, total, page, size } = isMockBoard() ? listMockPosts(q, currentPage) : await listPosts(q, currentPage)
  const lastPage = Math.max(1, Math.ceil(total / size))

  function pageHref(nextPage: number) {
    const query = new URLSearchParams({ page: String(nextPage) })
    if (q) query.set('q', q)
    return '/posts?' + query
  }

  return (
    <>
      <h1>게시글 목록</h1>
      <form key={q} className="search" action="/posts" method="get">
        <input name="q" aria-label="제목 검색" placeholder="제목으로 검색" defaultValue={q} />
        <button type="submit">검색</button>
        {q && <Link href="/posts">초기화</Link>}
      </form>
      {posts.length ? (
        <ul className="post-list">
          {posts.map(post => (
            <li key={post.id}>
              <Link href={'/posts/' + post.id} prefetch={false}>{post.title}</Link>
              <span className="muted">{post.author} · <time dateTime={post.createdAt}>{post.createdAt.slice(0, 10)}</time> · 조회 {post.views}</span>
            </li>
          ))}
        </ul>
      ) : <p>{total ? '이 페이지에 게시글이 없습니다.' : q ? '검색 결과가 없습니다.' : '아직 게시글이 없습니다.'}</p>}
      {(lastPage > 1 || page > 1) && (
        <nav className="pagination" aria-label="페이지 이동">
          {page > 1 && <Link href={pageHref(Math.min(page - 1, lastPage))}>이전</Link>}
          <span>{page} / {lastPage}</span>
          {page < lastPage && <Link href={pageHref(page + 1)}>다음</Link>}
        </nav>
      )}
    </>
  )
}
