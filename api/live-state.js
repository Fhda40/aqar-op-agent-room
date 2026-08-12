import { readFile } from 'node:fs/promises'
import path from 'node:path'

export default async function handler(_request, response) {
  const file = path.join(process.cwd(), 'public', 'data', 'live-state.json')
  const snapshot = JSON.parse(await readFile(file, 'utf8'))
  response.setHeader('Cache-Control', 'no-store, max-age=0')
  response.status(200).json({ ...snapshot, servedAt: new Date().toISOString(), transport: 'vercel-snapshot' })
}
