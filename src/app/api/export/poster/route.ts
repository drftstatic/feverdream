export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { SmallOutSchema } from '@/lib/schema'
import { renderPoster } from '@/lib/export/poster'

export async function POST(req: Request): Promise<Response> {
  try {
    const { posterSpec } = await req.json()
    const parsed = SmallOutSchema.pick({ posterSpec: true }).safeParse({ posterSpec })
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid posterSpec' }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      })
    }
    const png = await renderPoster(parsed.data.posterSpec)
    const ab = png.buffer.slice(png.byteOffset, png.byteOffset + png.byteLength)
    return new Response(ab, {
      headers: {
        'content-type': 'image/png',
        'content-disposition': 'attachment; filename="poster.png"'
      }
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'Export failed', message: e?.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    })
  }
}
