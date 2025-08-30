"use client"
import { Button } from '@/components/ui/button'
import type { SmallOut } from '@/lib/schema'

export function PosterPreview({ data }: { data?: SmallOut; }) {
  if (!data) return <div className="text-sm opacity-70">No poster yet.</div>

  const exportPng = async () => {
    const res = await fetch('/api/export/poster', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ posterSpec: data.posterSpec })
    })
    const blob = await res.blob()
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'poster.png'
    a.click()
  }

  return (
    <div className="space-y-3">
      <div className="rounded border p-3">
        <div className="text-lg font-semibold">{data.posterSpec.title}</div>
        <div className="text-sm opacity-80">{data.posterSpec.tagline}</div>
        <div className="text-xs opacity-70 mt-2">Layout: {data.posterSpec.layout} • Palette: {data.posterSpec.palette.join(', ')}</div>
      </div>
      <div className="text-sm">Caption: {data.caption}</div>
      <Button type="button" onClick={exportPng}>Export PNG</Button>
    </div>
  )
}

