import * as React from 'react'
import { cn } from '@/lib/utils'

export function Tabs({ value, onValueChange, children }: { value: string; onValueChange: (v: string) => void; children: React.ReactNode }) {
  return <div data-value={value}>{children}</div>
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="inline-flex rounded-md border p-1 bg-muted/50">{children}</div>
}

export function TabsTrigger({ value, active, onClick, children }: { value: string; active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 text-sm rounded-md',
        active ? 'bg-background shadow border' : 'opacity-70 hover:opacity-100'
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, active, children }: { value: string; active: boolean; children: React.ReactNode }) {
  if (!active) return null
  return <div className="pt-4">{children}</div>
}

