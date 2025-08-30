"use client"
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'

export function Knobs({
  stylize,
  chaos,
  wrongMemory,
  onChange
}: {
  stylize: number
  chaos: number
  wrongMemory: boolean
  onChange: (v: { stylize?: number; chaos?: number; wrongMemory?: boolean }) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm mb-1">Stylize</div>
        <Slider value={stylize} onValueChange={(n) => onChange({ stylize: n })} />
      </div>
      <div>
        <div className="text-sm mb-1">Chaos</div>
        <Slider value={chaos} onValueChange={(n) => onChange({ chaos: n })} />
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={wrongMemory} onCheckedChange={(b) => onChange({ wrongMemory: b })} />
        <span className="text-sm">Wrong-Memory Mode</span>
      </div>
    </div>
  )}

