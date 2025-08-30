export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { BigOutSchema } from '@/lib/schema'
import { renderTrailerZip } from '@/lib/export/trailer'

export async function POST(req: Request): Promise<Response> {
  try {
    const { bigOut } = await req.json()
    const parsed = BigOutSchema.safeParse(bigOut)
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid bigOut' }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      })
    }
    const zip = await renderTrailerZip(parsed.data)
    const ab = zip.buffer.slice(zip.byteOffset, zip.byteOffset + zip.byteLength)
    return new Response(ab, {
      headers: {
        'content-type': 'application/zip',
        'content-disposition': 'attachment; filename="trailer.zip"'
      }
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'Export failed', message: e?.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    })
  }
}
