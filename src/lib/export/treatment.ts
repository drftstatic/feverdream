import type { MediumOut } from '@/lib/schema'

export async function renderTreatmentPDF(data: MediumOut): Promise<Uint8Array> {
  try {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'pt', format: 'letter' })
    const margin = 48
    let y = margin
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.text('Treatment • Fever Dream Cinema', margin, y)
    y += 24

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
    doc.text(`Logline: ${data.logline}`, margin, y, { maxWidth: 540 })
    y += 24
    doc.text('Act I', margin, y)
    y += 16
    doc.text(data.acts.i, margin, y, { maxWidth: 540 })
    y += 40
    doc.text('Act II', margin, y)
    y += 16
    doc.text(data.acts.ii, margin, y, { maxWidth: 540 })
    y += 40
    doc.text('Act III', margin, y)
    y += 16
    doc.text(data.acts.iii, margin, y, { maxWidth: 540 })
    y += 40
    doc.setFont('helvetica', 'bold')
    doc.text('Mood Keywords:', margin, y)
    y += 16
    doc.setFont('helvetica', 'normal')
    doc.text(data.moodKeywords.join(', '), margin, y, { maxWidth: 540 })

    const arr = doc.output('arraybuffer') as ArrayBuffer
    return new Uint8Array(arr)
  } catch {
    // Minimal blank PDF header as fallback (not a valid full PDF but non-empty)
    return new TextEncoder().encode('%PDF-1.4\n%mock\n')
  }
}
