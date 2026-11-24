'use client'

import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { getEditToken, savePost } from '@/src/services/postApi'
import type { Post } from '@/src/types/post'

export default function PostForm({ post, preview = false }: { post?: Post; preview?: boolean }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const back = post ? '/posts/' + post.id : '/posts'
  const submitLabel = post ? '수정 저장' : '게시하기'

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending || preview) return

    const data = new FormData(event.currentTarget)
    const title = String(data.get('title')).trim()
    const content = String(data.get('content')).trim()
    if (!title || title.length > 100 || !content || content.length > 5000) {
      setError('제목(1~100자)과 본문(1~5000자)을 입력하세요.')
      return
    }

    setPending(true)
    setError('')
    try {
      const edit = post && { id: post.id, token: getEditToken(post.id) }
      const id = await savePost({ title, content }, edit)
      window.location.assign('/posts/' + id)
    } catch (error) {
      setError(error instanceof Error ? error.message : '게시글을 저장하지 못했습니다.')
      setPending(false)
    }
  }

  return (
    <form className="post-form" onSubmit={submit}>
      <label>제목 <input name="title" defaultValue={post?.title} required /></label>
      <label>본문 <textarea name="content" defaultValue={post?.content} rows={10} required /></label>
      {preview && <p>Mock 모드에서는 작성 화면을 미리 볼 수 있습니다.</p>}
      {error && <p role="alert" className="error">{error}</p>}
      <div className="actions">
        <Link href={back} prefetch={false}>취소</Link>
        <button className="primary" type="submit" disabled={pending || preview}>{pending ? '저장 중…' : submitLabel}</button>
      </div>
    </form>
  )
}
