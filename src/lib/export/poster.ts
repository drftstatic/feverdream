// Poster generator using node-canvas if available; fallback to a tiny PNG placeholder
import type { SmallOut } from '@/lib/schema'

async function renderWithCanvas(spec: SmallOut['posterSpec']): Promise<Uint8Array> {
  const { createCanvas } = await import('@napi-rs/canvas')
  const width = 800
  const height = 1200
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // background
  ctx.fillStyle = spec.palette[0] || '#0b0b0b'
  ctx.fillRect(0, 0, width, height)

  // subtle noise
  const noiseDensity = 0.03
  const noiseCount = Math.floor(width * height * noiseDensity)
  for (let i = 0; i < noiseCount; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const a = Math.random() * 0.08
    ctx.fillStyle = `rgba(255,255,255,${a})`
    ctx.fillRect(x, y, 1, 1)
  }

  // placeholder art block
  ctx.fillStyle = spec.palette[1] || '#f7e6c4'
  const pad = 60
  ctx.fillRect(pad, pad * 2, width - pad * 2, height * 0.55)

  // title
  ctx.fillStyle = spec.palette[2] || '#b41d1d'
  ctx.font = 'bold 64px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(spec.title, width / 2, height * 0.75)

  // tagline
  ctx.fillStyle = '#fff'
  ctx.font = '28px sans-serif'
  ctx.fillText(spec.tagline, width / 2, height * 0.83)

  // footer
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = '16px monospace'
  ctx.fillText('Fever Dream Cinema • mock preview', width / 2, height - 40)

  const buf: Buffer = canvas.toBuffer('image/png') as unknown as Buffer
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
}

function tinyPlaceholder(): Uint8Array {
  // 1x1 transparent PNG
  const b64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottQAAAABJRU5ErkJggg=='
  const buf = Buffer.from(b64, 'base64')
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
}

export async function renderPoster(spec: SmallOut['posterSpec']): Promise<Uint8Array> {
  try {
    return await renderWithCanvas(spec)
  } catch {
    return tinyPlaceholder()
  }
}
