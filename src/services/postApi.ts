import type { CreatedPost, Post, PostFields, PostList } from '@/src/types/post'

export class PostApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
  }
}

async function request(path: string, init?: RequestInit) {
  const response = await fetch(path, { ...init, cache: 'no-store' })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new PostApiError(body?.message ?? '요청을 처리하지 못했습니다.', response.status)
  }
  return response
}

function serverUrl(path: string) {
  const port = process.env.PORT
  const base = port ? `http://localhost:${port}` : process.env.API_BASE_URL?.trim() || 'http://localhost:3000'
  return new URL(path, base).href
}

export async function listPosts(q: string, page: number): Promise<PostList> {
  const params = new URLSearchParams({ q, page: String(page) })
  return (await request(serverUrl('/api/posts?' + params))).json()
}

export async function getPost(id: string, countView = true): Promise<Post> {
  const path = '/api/posts/' + encodeURIComponent(id)
  return (await request(serverUrl(path + (countView ? '' : '?view=0')))).json()
}

export async function savePost(fields: PostFields, edit?: { id: number; token: string }) {
  const headers = new Headers({ 'Content-Type': 'application/json' })
  if (edit) headers.set('Authorization', 'Bearer ' + edit.token)
  const response = await request(edit ? '/api/posts/' + edit.id : '/api/posts', {
    method: edit ? 'PATCH' : 'POST',
    headers,
    body: JSON.stringify(fields),
  })
  if (edit) return (await response.json() as Post).id

  const { post, editToken }: CreatedPost = await response.json()
  localStorage.setItem('post-edit-token:' + post.id, editToken)
  return post.id
}

export function getEditToken(id: number) {
  const token = localStorage.getItem('post-edit-token:' + id)
  if (!token) throw new Error('이 브라우저에 저장된 관리 토큰이 없습니다.')
  return token
}

export async function deletePost(id: number) {
  await request('/api/posts/' + id, {
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + getEditToken(id) },
  })
  localStorage.removeItem('post-edit-token:' + id)
}
