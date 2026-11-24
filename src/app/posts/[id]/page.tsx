import Link from 'next/link'
import { readPost } from './readPost'
import DeleteButton from './DeleteButton'
import { isMockBoard } from '../mockPosts'

export const dynamic = 'force-dynamic'

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const post = await readPost((await params).id)
  return (
    <article>
      <h1>{post.title}</h1>
      <p className="muted">
        {post.author} · <time dateTime={post.createdAt}>{post.createdAt.slice(0, 10)}</time> · 조회 {post.views}
      </p>
      <p className="post-content">{post.content}</p>
      <div className="actions">
        <Link href="/posts">목록</Link>
        {!isMockBoard() && (
          <>
            <Link href={'/posts/' + post.id + '/edit'}>수정</Link>
            <DeleteButton id={post.id} />
          </>
        )}
      </div>
    </article>
  )
}
