import Link from 'next/link'

export default function PostNotFound() {
  return <><h1>게시글을 찾을 수 없습니다</h1><Link href="/posts">목록으로</Link></>
}
