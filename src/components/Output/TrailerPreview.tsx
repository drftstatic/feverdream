"use client"
import { Button } from '@/components/ui/button'
import type { BigOut } from '@/lib/schema'

export function TrailerPreview({ data }: { data?: BigOut }) {
  if (!data) return <div className="text-sm opacity-70">No trailer pack yet.</div>

  const exportZip = async () => {
    const res = await fetch('/api/export/trailer', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ bigOut: data })
    })
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'trailer.zip'
    a.click()
  }

  return (
    <div className="space-y-3">
      <div>
        <div className="font-semibold mb-1">Beats</div>
        <ul className="text-sm space-y-1">
          {data.beats.map((b, i) => (
            <li key={i} className="opacity-90">{b.t} — {b.cue}</li>
          ))}
        </ul>
      </div>
      <div>
        <div className="font-semibold mb-1">VO</div>
        <ul className="text-sm space-y-1">
          {data.voLines.map((v, i) => (
            <li key={i} className="opacity-90">{v}</li>
          ))}
        </ul>
      </div>
      <div>
        <div className="font-semibold mb-2">Storyboard Frames</div>
        <div className="grid grid-cols-3 gap-2">
          {data.storyboardFrames.map((f, i) => (
            <div key={i} className="border rounded p-2 text-xs opacity-90">{f.label}</div>
          ))}
        </div>
      </div>
      <Button type="button" onClick={exportZip}>Export ZIP</Button>
    </div>
  )
}

