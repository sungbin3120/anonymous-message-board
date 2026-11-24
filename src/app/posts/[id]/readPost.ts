import { notFound } from 'next/navigation'
import { getPost, PostApiError } from '@/src/services/postApi'
import { isMockBoard, mockPosts } from '../mockPosts'

export async function readPost(id: string, countView = true) {
  if (!/^[1-9]\d*$/.test(id)) notFound()
  if (isMockBoard()) {
    const post = mockPosts.find(post => String(post.id) === id)
    if (!post) notFound()
    return post
  }
  try {
    return await getPost(id, countView)
  } catch (error) {
    if (error instanceof PostApiError && error.status === 404) notFound()
    throw error
  }
}
