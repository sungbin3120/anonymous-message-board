import { db, columns, detail, token, digest, fields, error } from '@/src/server/board'

export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const q = (params.get('q') ?? '').trim().toLowerCase()
  const page = Number(params.get('page') ?? 1)
  const size = Number(params.get('size') ?? 10)
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isInteger(size) || size < 1 || size > 50 || !Number.isSafeInteger(page * size))
    return error('페이지 또는 페이지 크기를 확인하세요.', 400)
  const filter = ' FROM posts WHERE instr(lower(title), ?) > 0'
  const posts = db().prepare('SELECT ' + columns + filter + ' ORDER BY id DESC LIMIT ? OFFSET ?').all(q, size, (page - 1) * size)
  const total = Number(db().prepare('SELECT count(*) AS total' + filter).get(q)?.total)
  return Response.json({posts, total, page, size})
}

export async function POST(request: Request) {
  const data = await fields(request)
  if (!data) return error('제목(1~100자)과 본문(1~5000자)을 입력하세요.', 400)
  const editToken = token()
  const post = db().prepare('INSERT INTO posts(title,content,createdAt,owner) VALUES(?,?,?,?) RETURNING ' + detail)
    .get(data.title, data.content, new Date().toISOString(), digest(editToken))
  return Response.json({post, editToken}, {status: 201, headers: {'Cache-Control':'no-store'}})
}
