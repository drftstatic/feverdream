# Fever Dream Cinema

TypeScript Next.js 14 (App Router) app that turns a short movie seed into:

- Small: social poster PNG + caption
- Medium: 1-page treatment PDF
- Big: trailer pre-vis pack (beat sheet .txt, VO script .srt, storyboard grid PNG)
- Wrong-Memory Mode: 3 intentionally incorrect variations

## Quickstart

1) Install deps

- pnpm install

2) Dev

- pnpm dev

Mock mode is enabled when `OPENAI_API_KEY` is missing. See `.env.local`.

## Stack

- Next.js 14 + TypeScript
- Tailwind + shadcn-like UI primitives
- Zod, Server Route Handlers
- LLM adapter with OpenAI-compatible shape (mocked)
- jsPDF for PDF, node-canvas for PNGs, JSZip for ZIP

## API

- POST `/api/generate` → `{ bundle }`
- POST `/api/export/poster` → image/png
- POST `/api/export/treatment` → application/pdf
- POST `/api/export/trailer` → application/zip

## Notes

- Canvas and jsPDF are dynamically imported with graceful fallbacks so the app runs even without native builds.
- Code is typed and minimally commented; swap the LLM adapter in `src/lib/llm/index.ts` for a real client.

