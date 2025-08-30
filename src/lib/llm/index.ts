import { type Bundle } from '@/lib/schema'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function generateText(system: string, prompt: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    // Deterministic mock for local dev: echo simple JSON-like outputs based on system directive
    if (system.includes('SMALL')) {
      return JSON.stringify({
        caption: 'Static-laced recollection of a summer that never ended.',
        posterSpec: {
          title: 'Fever Dream Cinema',
          tagline: 'VHS heat haze over 16mm Americana',
          palette: ['#0b0b0b', '#f7e6c4', '#b41d1d'],
          layout: 'full'
        }
      })
    }
    if (system.includes('MEDIUM')) {
      return JSON.stringify({
        logline: 'A drifter chases a memory through a haunted roadside America.',
        acts: { i: 'Inciting wanderlust', ii: 'Ghost towns and false leads', iii: 'Confronting the invented past' },
        moodKeywords: ['VHS', 'Americana', 'Heat-haze', 'Rust', 'Neon', 'Lullaby']
      })
    }
    if (system.includes('BIG')) {
      return JSON.stringify({
        beats: [
          { t: '0-5s', cue: 'Radio static over empty highway' },
          { t: '5-10s', cue: 'Rearview mirror face flicker' },
          { t: '10-15s', cue: 'Gas station neon hum' },
          { t: '15-20s', cue: 'Polaroids ignite' },
          { t: '20-25s', cue: 'Title slam' }
        ],
        voLines: [
          'I remember the roads more than the names.',
          'Every mile erased a face.',
          'The static spoke louder than the voices.',
          'I thought the past would wait.',
          'It didn’t.'
        ],
        storyboardFrames: Array.from({ length: 9 }).map((_, i) => ({ label: `Frame ${i + 1}`, desc: 'Grainy Americana tableau' }))
      })
    }
    if (system.includes('WRONG')) {
      return JSON.stringify([
        { variant: 'Cyberpunk Tokyo 2088', delta: ['Era shifted to future', 'Lead changed to android', 'Cause: corporate amnesia virus'] },
        { variant: 'Victorian seaside mystery', delta: ['Era 1890s', 'Lead: lighthouse keeper', 'Cause: cursed fog'] },
        { variant: 'Space-western lunar caravan', delta: ['Era: far future', 'Lead: caravan scout', 'Cause: memory cloning gone wrong'] }
      ])
    }
    return JSON.stringify({ note: 'unrecognized mock prompt' })
  }

  // Real client adapter (OpenAI-compatible). Keep minimal & swappable.
  // For now, return a safe placeholder until wired to your preferred SDK.
  return JSON.stringify({ note: 'Real LLM not configured in this scaffold.' })
}

export type { Bundle }

