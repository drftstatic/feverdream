export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { BigOutSchema } from '@/lib/schema'
import { renderTrailerZip } from '@/lib/export/trailer'

export async function POST(req: Request) {
  try {
    const { bigOut } = await req.json()
    const parsed = BigOutSchema.safeParse(bigOut)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid bigOut' }, { status: 400 })
    }
    const zip = await renderTrailerZip(parsed.data)
    return new NextResponse(zip, {
      headers: {
        'content-type': 'application/zip',
        'content-disposition': 'attachment; filename="trailer.zip"'
      }
    })
  } catch (e: any) {
    return NextResponse.json({ error: 'Export failed', message: e?.message }, { status: 500 })
  }
}
