export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { SmallOutSchema } from '@/lib/schema'
import { renderPoster } from '@/lib/export/poster'

export async function POST(req: Request) {
  try {
    const { posterSpec } = await req.json()
    const parsed = SmallOutSchema.pick({ posterSpec: true }).safeParse({ posterSpec })
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid posterSpec' }, { status: 400 })
    }
    const png = await renderPoster(parsed.data.posterSpec)
    const body = new Blob([png], { type: 'image/png' })
    return new NextResponse(body, {
      headers: {
        'content-type': 'image/png',
        'content-disposition': 'attachment; filename="poster.png"'
      }
    })
  } catch (e: any) {
    return NextResponse.json({ error: 'Export failed', message: e?.message }, { status: 500 })
  }
}
