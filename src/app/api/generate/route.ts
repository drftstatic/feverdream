export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { GenerateRequestSchema, BundleSchema } from '@/lib/schema'
import { runAll } from '@/lib/pipeline/big'

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = GenerateRequestSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }
    const bundle = await runAll(parsed.data)
    const safe = BundleSchema.parse(bundle)
    return NextResponse.json({ bundle: safe })
  } catch (e: any) {
    return NextResponse.json({ error: 'Generation failed', message: e?.message }, { status: 500 })
  }
}
