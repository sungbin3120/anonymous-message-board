export type PostSummary = {
  id: number
  title: string
  author: '익명'
  createdAt: string
  views: number
}

export type Post = PostSummary & { content: string }
export type PostFields = Pick<Post, 'title' | 'content'>
export type PostList = { posts: PostSummary[]; total: number; page: number; size: number }
export type CreatedPost = { post: Post; editToken: string }
