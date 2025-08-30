"use client"
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Vibes } from '@/components/controls/Vibes'
import { Knobs } from '@/components/controls/Knobs'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { Bundle, SmallOut, MediumOut, BigOut, WrongMemoryOut } from '@/lib/schema'
import { PosterPreview as Small } from '@/components/Output/PosterPreview'
import { TreatmentPreview as Medium } from '@/components/Output/TreatmentPreview'
import { TrailerPreview as Big } from '@/components/Output/TrailerPreview'

export default function Page() {
  const [seed, setSeed] = useState('A dream of driving forever through heat shimmer.')
  const [vibes, setVibes] = useState<string[]>(['VHS', 'Americana'])
  const [stylize, setStylize] = useState(60)
  const [chaos, setChaos] = useState(40)
  const [wrongMemory, setWrong] = useState(false)
  const [activeTab, setActiveTab] = useState<'small' | 'medium' | 'big'>('small')
  const [bundle, setBundle] = useState<Bundle>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (tiers?: ('small' | 'medium' | 'big')[]) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ seed, vibes, stylize, chaos, wrongMemory, tiers })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Generation failed')
      setBundle(data.bundle as Bundle)
    } catch (e: any) {
      setError(e?.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <div>
          <div className="text-sm font-medium mb-1">Movie Seed</div>
          <Textarea value={seed} onChange={(e) => setSeed(e.target.value)} rows={5} />
        </div>
        <div>
          <div className="text-sm font-medium mb-1">Vibes</div>
          <Vibes value={vibes} onChange={setVibes} />
        </div>
        <Knobs
          stylize={stylize}
          chaos={chaos}
          wrongMemory={wrongMemory}
          onChange={(v) => {
            if (v.stylize !== undefined) setStylize(v.stylize)
            if (v.chaos !== undefined) setChaos(v.chaos)
            if (v.wrongMemory !== undefined) setWrong(v.wrongMemory)
          }}
        />
        <div className="flex gap-2 pt-2">
          <Button onClick={() => submit() } disabled={loading}>{loading ? 'Generating…' : 'Generate'}</Button>
          <Button variant="outline" onClick={() => submit([activeTab])} disabled={loading}>Iterate {activeTab}</Button>
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        {bundle?.wrong && (
          <details className="mt-2">
            <summary className="cursor-pointer">Wrong-Memory Variations</summary>
            <ul className="pl-4 list-disc text-sm opacity-90 mt-2">
              {(bundle.wrong as WrongMemoryOut).map((w, i) => (
                <li key={i}><span className="font-medium">{w.variant}</span>: {w.delta.join('; ')}</li>
              ))}
            </ul>
          </details>
        )}
      </div>
      <div className="md:col-span-2">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList>
            <TabsTrigger value="small" active={activeTab === 'small'} onClick={() => setActiveTab('small')}>Small</TabsTrigger>
            <TabsTrigger value="medium" active={activeTab === 'medium'} onClick={() => setActiveTab('medium')}>Medium</TabsTrigger>
            <TabsTrigger value="big" active={activeTab === 'big'} onClick={() => setActiveTab('big')}>Big</TabsTrigger>
          </TabsList>
          <TabsContent value="small" active={activeTab === 'small'}>
            <Small data={bundle.small as SmallOut | undefined} />
          </TabsContent>
          <TabsContent value="medium" active={activeTab === 'medium'}>
            <Medium data={bundle.medium as MediumOut | undefined} />
          </TabsContent>
          <TabsContent value="big" active={activeTab === 'big'}>
            <Big data={bundle.big as BigOut | undefined} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
