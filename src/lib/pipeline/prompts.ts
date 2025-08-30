import type { GenerateRequest } from '@/lib/schema'

export const buildSmallPrompt = (input: GenerateRequest) => {
  const vibe = input.vibes.join(', ')
  const sys = 'SMALL: Generate a poster caption and layout spec. Return JSON: {caption, posterSpec:{title,tagline,palette,layout}}. Tone: fever dream Americana, VHS static, 16mm wash.'
  const p = `Seed: ${input.seed}\nVibes: ${vibe}\nStylize: ${input.stylize}\nChaos: ${input.chaos}`
  return { system: sys, prompt: p }
}

export const buildMediumPrompt = (input: GenerateRequest) => {
  const sys = 'MEDIUM: Generate logline, 3-act beats, 6 mood keywords. Return JSON.'
  const p = `Seed: ${input.seed}\nVibes: ${input.vibes.join(', ')}`
  return { system: sys, prompt: p }
}

export const buildBigPrompt = (input: GenerateRequest) => {
  const sys = 'BIG: Generate 5 beats with timestamps (0–5s etc), 6 VO lines, 9 storyboard frame labels. Return JSON.'
  const p = `Seed: ${input.seed}\nTone: VHS Americana, heat haze`
  return { system: sys, prompt: p }
}

export const buildWrongPrompt = (input: GenerateRequest) => {
  const sys = 'WRONG: Generate 3 incorrect variations. Each: {variant, delta[3]} where variant alters era, lead, cause.'
  const p = `Seed: ${input.seed}`
  return { system: sys, prompt: p }
}

