import { generateText } from '@/lib/llm'
import { buildBigPrompt, buildWrongPrompt } from './prompts'
import {
  BigOutSchema,
  WrongMemoryOutSchema,
  type GenerateRequest,
  type BigOut,
  type WrongMemoryOut,
  type Bundle
} from '@/lib/schema'

export async function runBig(input: GenerateRequest): Promise<BigOut> {
  const { system, prompt } = buildBigPrompt(input)
  const raw = await generateText(system, prompt)
  const parsed = BigOutSchema.safeParse(JSON.parse(raw))
  if (!parsed.success) {
    return {
      beats: [
        { t: '0-5s', cue: 'Highway mirage' },
        { t: '5-10s', cue: 'Dashboard glow' },
        { t: '10-15s', cue: 'Phone booth in cornfield' },
        { t: '15-20s', cue: 'Polaroid burns' },
        { t: '20-25s', cue: 'Title card' }
      ],
      voLines: ['I almost remember you.', 'But the road remembers better.'],
      storyboardFrames: Array.from({ length: 9 }).map((_, i) => ({ label: `Frame ${i + 1}`, desc: 'Grainy tableau' }))
    }
  }
  return parsed.data
}

export async function runWrong(input: GenerateRequest): Promise<WrongMemoryOut> {
  const { system, prompt } = buildWrongPrompt(input)
  const raw = await generateText(system, prompt)
  const parsed = WrongMemoryOutSchema.safeParse(JSON.parse(raw))
  if (!parsed.success) {
    return [
      { variant: 'Alternate 1', delta: ['Era shift', 'Lead shift', 'Cause shift'] },
      { variant: 'Alternate 2', delta: ['Era shift', 'Lead shift', 'Cause shift'] },
      { variant: 'Alternate 3', delta: ['Era shift', 'Lead shift', 'Cause shift'] }
    ]
  }
  return parsed.data
}

export async function runAll(
  input: GenerateRequest
): Promise<Bundle> {
  const tiers = input.tiers ?? ['small', 'medium', 'big']
  const out: Bundle = {}
  if (tiers.includes('small')) out.small = await (await import('./small')).runSmall(input)
  if (tiers.includes('medium')) out.medium = await (await import('./medium')).runMedium(input)
  if (tiers.includes('big')) out.big = await runBig(input)
  if (input.wrongMemory) out.wrong = await runWrong(input)
  return out
}

