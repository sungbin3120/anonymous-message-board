import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { createHash, randomBytes } from 'node:crypto'

let connection: DatabaseSync | undefined
export function db() {
  if (!connection) {
    mkdirSync('data', { recursive: true })
    const sqlite = new DatabaseSync('data/board.sqlite')
    sqlite.exec(`CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL,
      author TEXT NOT NULL DEFAULT '익명', createdAt TEXT NOT NULL, views INTEGER NOT NULL DEFAULT 0,
      owner TEXT NOT NULL)`)
    connection = sqlite
  }
  return connection
}

export const columns = 'id,title,author,createdAt,views'
export const detail = columns + ',content'
export const token = () => randomBytes(32).toString('hex')
export const digest = (value: string) => createHash('sha256').update(value).digest('hex')
export const error = (message: string, status: number) => Response.json({message}, {status})

export async function fields(request: Request) {
  const body: unknown = await request.json().catch(() => null)
  if (!body || typeof body !== 'object' || !('title' in body) || !('content' in body)) return null
  if (typeof body.title !== 'string' || typeof body.content !== 'string') return null
  const title = body.title.trim()
  const content = body.content.trim()
  return title && title.length <= 100 && content && content.length <= 5000 ? {title, content} : null
}
