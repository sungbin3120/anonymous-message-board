import { notFound } from 'next/navigation'
import PostForm from '../../PostForm'
import { isMockBoard } from '../../mockPosts'
import { readPost } from '../readPost'

export const dynamic = 'force-dynamic'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  if (isMockBoard()) notFound()
  const post = await readPost((await params).id, false)
  return <><h1>게시글 수정</h1><PostForm post={post} /></>
}
