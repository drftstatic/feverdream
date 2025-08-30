"use client"
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const OPTIONS = ['VHS', 'Americana', '16mm', 'Heat-Haze', 'Rust', 'Neon', 'Liminal']

export function Vibes({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (v: string) => {
    const has = value.includes(v)
    onChange(has ? value.filter((x) => x !== v) : [...value, v])
  }
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((v) => (
        <Button
          key={v}
          type="button"
          variant={value.includes(v) ? 'default' : 'outline'}
          className={cn('h-7')}
          onClick={() => toggle(v)}
        >
          {v}
        </Button>
      ))}
    </div>
  )
}

