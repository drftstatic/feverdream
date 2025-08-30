export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { MediumOutSchema } from '@/lib/schema'
import { renderTreatmentPDF } from '@/lib/export/treatment'

export async function POST(req: Request) {
  try {
    const { mediumOut } = await req.json()
    const parsed = MediumOutSchema.safeParse(mediumOut)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid mediumOut' }, { status: 400 })
    }
    const pdf = await renderTreatmentPDF(parsed.data)
    return new NextResponse(pdf, {
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': 'attachment; filename="treatment.pdf"'
      }
    })
  } catch (e: any) {
    return NextResponse.json({ error: 'Export failed', message: e?.message }, { status: 500 })
  }
}
