import Link from 'next/link'
import type { ReactNode } from 'react'
import './posts.css'

export default function PostsLayout({ children }: { children: ReactNode }) {
  return (
    <main className="board">
      <header className="board-header">
        <Link href="/posts">익명 게시판</Link>
        <nav aria-label="게시판">
          <Link href="/posts">목록</Link>
          <Link className="primary" href="/posts/new">글쓰기</Link>
        </nav>
      </header>
      <section className="board-panel">{children}</section>
    </main>
  )
}
