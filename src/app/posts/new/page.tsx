import PostForm from '../PostForm'
import { isMockBoard } from '../mockPosts'

export const dynamic = 'force-dynamic'

export default function NewPostPage() {
  return <><h1>글쓰기</h1><PostForm preview={isMockBoard()} /></>
}
