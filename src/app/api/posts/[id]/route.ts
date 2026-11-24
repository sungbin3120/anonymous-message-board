import { db, detail, fields, digest, error } from '@/src/server/board'

export const dynamic = 'force-dynamic'
type Context = {params: Promise<{id: string}>}
const missing = () => error('게시글을 찾을 수 없습니다.', 404)

export async function GET(request: Request, {params}: Context) {
  const {id} = await params
  const readOnly = new URL(request.url).searchParams.get('view') === '0'
  const sql = readOnly ? 'SELECT ' + detail + ' FROM posts WHERE id=?'
    : 'UPDATE posts SET views=views+1 WHERE id=? RETURNING ' + detail
  const post = db().prepare(sql).get(id)
  return post ? Response.json(post, {headers: {'Cache-Control':'no-store'}}) : missing()
}

async function change(request: Request, {params}: Context, remove: boolean) {
  const {id} = await params
  const bearer = /^Bearer ([a-f0-9]{64})$/.exec(request.headers.get('authorization') ?? '')
  if (!bearer) return error('관리 토큰이 필요합니다.', 401)
  const owner = digest(bearer[1])
  if (remove) {
    if (db().prepare('DELETE FROM posts WHERE id=? AND owner=?').run(id, owner).changes)
      return new Response(null, {status: 204})
  } else {
    const data = await fields(request)
    if (!data) return error('제목(1~100자)과 본문(1~5000자)을 입력하세요.', 400)
    const post = db().prepare('UPDATE posts SET title=?,content=? WHERE id=? AND owner=? RETURNING ' + detail)
      .get(data.title, data.content, id, owner)
    if (post) return Response.json(post)
  }
  return db().prepare('SELECT id FROM posts WHERE id=?').get(id) ? error('수정 또는 삭제 권한이 없습니다.', 403) : missing()
}
export const PATCH = (request: Request, context: Context) => change(request, context, false)
export const DELETE = (request: Request, context: Context) => change(request, context, true)
