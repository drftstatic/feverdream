"use client"
import { Button } from '@/components/ui/button'
import type { MediumOut } from '@/lib/schema'

export function TreatmentPreview({ data }: { data?: MediumOut }) {
  if (!data) return <div className="text-sm opacity-70">No treatment yet.</div>

  const exportPdf = async () => {
    const res = await fetch('/api/export/treatment', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ mediumOut: data })
    })
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'treatment.pdf'
    a.click()
  }

  return (
    <div className="space-y-3">
      <div>
        <div className="font-semibold">Logline</div>
        <div className="text-sm opacity-90">{data.logline}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div><div className="font-semibold">Act I</div><div className="text-sm opacity-90">{data.acts.i}</div></div>
        <div><div className="font-semibold">Act II</div><div className="text-sm opacity-90">{data.acts.ii}</div></div>
        <div><div className="font-semibold">Act III</div><div className="text-sm opacity-90">{data.acts.iii}</div></div>
      </div>
      <div>
        <div className="font-semibold">Mood</div>
        <div className="text-sm opacity-90">{data.moodKeywords.join(', ')}</div>
      </div>
      <Button type="button" onClick={exportPdf}>Export PDF</Button>
    </div>
  )
}

