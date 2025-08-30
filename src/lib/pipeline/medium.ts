import { generateText } from '@/lib/llm'
import { buildMediumPrompt } from './prompts'
import { MediumOutSchema, type GenerateRequest, type MediumOut } from '@/lib/schema'

export async function runMedium(input: GenerateRequest): Promise<MediumOut> {
  const { system, prompt } = buildMediumPrompt(input)
  const raw = await generateText(system, prompt)
  const parsed = MediumOutSchema.safeParse(JSON.parse(raw))
  if (!parsed.success) {
    return {
      logline: 'A traveler hunts a false memory along the rust belt.',
      acts: { i: 'Departure', ii: 'Chase', iii: 'Unraveling' },
      moodKeywords: ['VHS', 'Heat', 'Dust', 'Neon', 'Static', 'Lull']
    }
  }
  return parsed.data
}

