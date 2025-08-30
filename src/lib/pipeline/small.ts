import { generateText } from '@/lib/llm'
import { buildSmallPrompt } from './prompts'
import { SmallOutSchema, type GenerateRequest, type SmallOut } from '@/lib/schema'

export async function runSmall(input: GenerateRequest): Promise<SmallOut> {
  const { system, prompt } = buildSmallPrompt(input)
  const raw = await generateText(system, prompt)
  const parsed = SmallOutSchema.safeParse(JSON.parse(raw))
  if (!parsed.success) {
    // Fallback deterministic in case of malformed mock
    return {
      caption: 'Ghosts of the interstate sing through the static.',
      posterSpec: {
        title: 'Fever Dream',
        tagline: 'A memory you can’t quite place',
        palette: ['#111111', '#DDCBA4', '#A31919'],
        layout: 'full'
      }
    }
  }
  return parsed.data
}

