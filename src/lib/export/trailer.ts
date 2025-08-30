import type { BigOut } from '@/lib/schema'
import { PNG } from 'pngjs'

async function renderStoryboardPng(labels: string[]): Promise<Uint8Array> {
  const cols = 3
  const rows = 3
  const w = 900
  const h = 900
  const png = new PNG({ width: w, height: h })
  const bg = 0x11
  // Fill background
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (w * y + x) << 2
      png.data[idx] = bg
      png.data[idx + 1] = bg
      png.data[idx + 2] = bg
      png.data[idx + 3] = 255
    }
  }
  // Grid lines
  const line = (x: number, y: number) => {
    const idx = (w * y + x) << 2
    png.data[idx] = 255
    png.data[idx + 1] = 255
    png.data[idx + 2] = 255
    png.data[idx + 3] = 60
  }
  for (let r = 1; r < rows; r++) {
    const y = Math.floor((h / rows) * r)
    for (let x = 0; x < w; x++) line(x, y)
  }
  for (let c = 1; c < cols; c++) {
    const x = Math.floor((w / cols) * c)
    for (let y = 0; y < h; y++) line(x, y)
  }
  const buf: Buffer = PNG.sync.write(png)
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
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

export async function renderTrailerZip(data: BigOut): Promise<Uint8Array> {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()
  const beatsTxt = buildBeatsTxt(data.beats)
  const srt = buildSrt(data.voLines)
  const storyboard = await renderStoryboardPng(data.storyboardFrames.map((f) => f.label))

  zip.file('beats.txt', beatsTxt)
  zip.file('vo.srt', srt)
  zip.file('storyboard.png', storyboard)

  const content = await zip.generateAsync({ type: 'uint8array' })
  return content as Uint8Array
}
