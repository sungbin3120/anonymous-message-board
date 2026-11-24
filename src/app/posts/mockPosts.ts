import type { Post, PostList } from '@/src/types/post'

export function isMockBoard() {
  return process.env.BOARD_MOCK === '1'
}

export const mockPosts: Post[] = [
  {
    id: 2,
    title: '게시판 사용 후기',
    content: '제목을 클릭하면 게시글 상세 화면을 볼 수 있습니다.',
    author: '익명',
    createdAt: '2026-01-02T09:00:00.000Z',
    views: 7,
  },
  {
    id: 1,
    title: '첫 번째 예시 게시글',
    content: '익명 게시판에 오신 것을 환영합니다.',
    author: '익명',
    createdAt: '2026-01-01T09:00:00.000Z',
    views: 12,
  },
]

export function listMockPosts(q: string, page: number): PostList {
  const size = 10
  const query = q.toLowerCase()
  const matches = mockPosts.filter(post => post.title.toLowerCase().includes(query))
  return { posts: matches.slice((page - 1) * size, page * size), total: matches.length, page, size }
}
