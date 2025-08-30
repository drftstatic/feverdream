import { z } from 'zod'

export const TierSchema = z.enum(['small', 'medium', 'big'])

export const MovieSeedSchema = z.object({
  seed: z.string().min(1),
  vibes: z.array(z.string()).default([]),
  wrongMemory: z.boolean().default(false),
  stylize: z.number().min(0).max(100).default(50),
  chaos: z.number().min(0).max(100).default(50)
})

export const PosterLayoutSchema = z.enum(['grid', 'full'])

export const SmallOutSchema = z.object({
  caption: z.string(),
  posterSpec: z.object({
    title: z.string(),
    tagline: z.string(),
    palette: z.array(z.string()),
    layout: PosterLayoutSchema
  })
})

export type SmallOut = z.infer<typeof SmallOutSchema>

export const MediumOutSchema = z.object({
  logline: z.string(),
  acts: z.object({ i: z.string(), ii: z.string(), iii: z.string() }),
  moodKeywords: z.array(z.string())
})
export type MediumOut = z.infer<typeof MediumOutSchema>

export const BigOutSchema = z.object({
  beats: z.array(
    z.object({
      t: z.string(),
      cue: z.string()
    })
  ),
  voLines: z.array(z.string()),
  storyboardFrames: z.array(
    z.object({
      label: z.string(),
      desc: z.string()
    })
  )
})
export type BigOut = z.infer<typeof BigOutSchema>

export const WrongMemoryItemSchema = z.object({ variant: z.string(), delta: z.array(z.string()) })
export const WrongMemoryOutSchema = z.array(WrongMemoryItemSchema)
export type WrongMemoryOut = z.infer<typeof WrongMemoryOutSchema>

export const BundleSchema = z.object({
  small: SmallOutSchema.optional(),
  medium: MediumOutSchema.optional(),
  big: BigOutSchema.optional(),
  wrong: WrongMemoryOutSchema.optional()
})
export type Bundle = z.infer<typeof BundleSchema>

export const GenerateRequestSchema = z.object({
  seed: z.string().min(1),
  vibes: z.array(z.string()).default([]),
  wrongMemory: z.boolean().default(false),
  stylize: z.number().min(0).max(100).default(50),
  chaos: z.number().min(0).max(100).default(50),
  tiers: z.array(TierSchema).optional()
})
export type GenerateRequest = z.infer<typeof GenerateRequestSchema>

