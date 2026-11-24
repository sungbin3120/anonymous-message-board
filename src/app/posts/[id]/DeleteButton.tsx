'use client'

import { useState } from 'react'
import { deletePost } from '@/src/services/postApi'

export default function DeleteButton({ id }: { id: number }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function remove() {
    if (pending || !window.confirm('이 게시글을 삭제할까요?')) return
    setPending(true)
    setError('')
    try {
      await deletePost(id)
      window.location.assign('/posts')
    } catch (error) {
      setError(error instanceof Error ? error.message : '게시글을 삭제하지 못했습니다.')
      setPending(false)
    }
  }

  return (
    <>
      <button type="button" disabled={pending} onClick={remove}>{pending ? '삭제 중…' : '삭제'}</button>
      {error && <p role="alert" className="error">{error}</p>}
    </>
  )
}
