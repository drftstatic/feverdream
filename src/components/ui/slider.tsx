import * as React from 'react'

export function Slider({ value, onValueChange, min = 0, max = 100, step = 1 }: {
  value: number
  onValueChange: (n: number) => void
  min?: number
  max?: number
  step?: number
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValueChange(Number(e.target.value))}
        className="w-full h-2 accent-primary"
      />
      <span className="text-xs w-10 text-right">{value}</span>
    </div>
  )
}

