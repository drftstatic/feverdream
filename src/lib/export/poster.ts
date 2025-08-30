// Poster generator using pure JS PNG (pngjs) for serverless compatibility
import type { SmallOut } from '@/lib/schema'
import { PNG } from 'pngjs'

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '')
  const bigint = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 }
}

export async function renderPoster(spec: SmallOut['posterSpec']): Promise<Uint8Array> {
  const width = 800
  const height = 1200
  const png = new PNG({ width, height })

  const bg = hexToRgb(spec.palette[0] || '#0b0b0b')
  const accent = hexToRgb(spec.palette[1] || '#f7e6c4')

  // background fill
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2
      png.data[idx] = bg.r
      png.data[idx + 1] = bg.g
      png.data[idx + 2] = bg.b
      png.data[idx + 3] = 255
    }
  }

  // art block
  const pad = 60
  const ax = pad
  const ay = pad * 2
  const aw = width - pad * 2
  const ah = Math.floor(height * 0.55)
  for (let y = ay; y < ay + ah; y++) {
    for (let x = ax; x < ax + aw; x++) {
      const idx = (width * y + x) << 2
      png.data[idx] = accent.r
      png.data[idx + 1] = accent.g
      png.data[idx + 2] = accent.b
      png.data[idx + 3] = 255
    }
  }

  // subtle noise
  const noiseDensity = 0.02
  const noiseCount = Math.floor(width * height * noiseDensity)
  for (let i = 0; i < noiseCount; i++) {
    const x = Math.floor(Math.random() * width)
    const y = Math.floor(Math.random() * height)
    const idx = (width * y + x) << 2
    const v = Math.floor(Math.random() * 40)
    png.data[idx] = Math.min(255, png.data[idx] + v)
    png.data[idx + 1] = Math.min(255, png.data[idx + 1] + v)
    png.data[idx + 2] = Math.min(255, png.data[idx + 2] + v)
    png.data[idx + 3] = 255
  }

  const buf: Buffer = PNG.sync.write(png)
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
}
