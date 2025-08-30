import type { MediumOut } from '@/lib/schema'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function renderTreatmentPDF(data: MediumOut): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([612, 792]) // Letter size in points
  const { width } = page.getSize()
  const margin = 48
  let y = 792 - margin

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  page.drawText('Treatment • Fever Dream Cinema', {
    x: margin,
    y,
    size: 20,
    font: fontBold,
    color: rgb(0, 0, 0)
  })
  y -= 28

  const drawParagraph = (title: string, text: string) => {
    page.drawText(title, { x: margin, y, size: 12, font: fontBold })
    y -= 16
    const maxWidth = width - margin * 2
    const words = text.split(' ')
    let line = ''
    const size = 12
    while (words.length) {
      const test = line + (line ? ' ' : '') + words[0]
      const w = font.widthOfTextAtSize(test, size)
      if (w > maxWidth) {
        page.drawText(line, { x: margin, y, size, font })
        y -= 14
        line = ''
      } else {
        line = test
        words.shift()
      }
    }
    if (line) {
      page.drawText(line, { x: margin, y, size, font })
      y -= 18
    }
  }

  drawParagraph('Logline', data.logline)
  drawParagraph('Act I', data.acts.i)
  drawParagraph('Act II', data.acts.ii)
  drawParagraph('Act III', data.acts.iii)

  page.drawText('Mood Keywords:', { x: margin, y, size: 12, font: fontBold })
  y -= 16
  page.drawText(data.moodKeywords.join(', '), { x: margin, y, size: 12, font })

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}
