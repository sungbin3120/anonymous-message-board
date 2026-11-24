'use client'

export default function PostsError() {
  return (
    <>
      <h1>게시판을 불러오지 못했습니다</h1>
      <button type="button" onClick={() => window.location.reload()}>다시 시도</button>
    </>
  )
}
