import type { BigOut } from '@/lib/schema'

async function renderStoryboardPng(labels: string[]): Promise<Buffer> {
  try {
    const { createCanvas } = await import('@napi-rs/canvas')
    const cols = 3
    const rows = 3
    const w = 900
    const h = 900
    const canvas = createCanvas(w, h)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    for (let r = 1; r < rows; r++) {
      const y = (h / rows) * r
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }
    for (let c = 1; c < cols; c++) {
      const x = (w / cols) * c
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.stroke()
    }
    ctx.fillStyle = '#fff'
    ctx.font = '20px sans-serif'
    ctx.textAlign = 'center'
    labels.slice(0, 9).forEach((label, i) => {
      const r = Math.floor(i / cols)
      const c = i % cols
      const cx = c * (w / cols) + w / cols / 2
      const cy = r * (h / rows) + h / rows / 2
      ctx.fillText(label, cx, cy)
    })
    return canvas.toBuffer('image/png')
  } catch {
    const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottQAAAABJRU5ErkJggg=='
    return Buffer.from(b64, 'base64')
  }
}

function buildBeatsTxt(beats: BigOut['beats']): string {
  return beats.map((b) => `${b.t} - ${b.cue}`).join('\n') + '\n'
}

function buildSrt(lines: string[]): string {
  // Simple one-line-per-entry with 2s spacing
  function toStamp(n: number) {
    const s = n.toString().padStart(2, '0')
    return `00:00:${s},000`
  }
  return lines
    .map((text, i) => {
      const start = i * 2
      const end = start + 2
      return `${i + 1}\n${toStamp(start)} --> ${toStamp(end)}\n${text}\n\n`
    })
    .join('')
}

export async function renderTrailerZip(data: BigOut): Promise<Buffer> {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()
  const beatsTxt = buildBeatsTxt(data.beats)
  const srt = buildSrt(data.voLines)
  const storyboard = await renderStoryboardPng(data.storyboardFrames.map((f) => f.label))

  zip.file('beats.txt', beatsTxt)
  zip.file('vo.srt', srt)
  zip.file('storyboard.png', storyboard)

  const content = await zip.generateAsync({ type: 'nodebuffer' })
  return content
}
