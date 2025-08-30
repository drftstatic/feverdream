export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { MediumOutSchema } from '@/lib/schema'
import { renderTreatmentPDF } from '@/lib/export/treatment'

export async function POST(req: Request): Promise<Response> {
  try {
    const { mediumOut } = await req.json()
    const parsed = MediumOutSchema.safeParse(mediumOut)
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid mediumOut' }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      })
    }
    const pdf = await renderTreatmentPDF(parsed.data)
    const ab = pdf.buffer.slice(pdf.byteOffset, pdf.byteOffset + pdf.byteLength)
    return new Response(ab, {
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': 'attachment; filename="treatment.pdf"'
      }
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'Export failed', message: e?.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    })
  }
}
