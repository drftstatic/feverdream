import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Fever Dream Cinema',
  description: 'Turn seeds into surreal cinema artifacts'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-dvh">
            <header className="border-b sticky top-0 bg-background/80 backdrop-blur z-10">
              <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
                <h1 className="text-xl font-semibold">Fever Dream Cinema</h1>
                <span className="text-xs opacity-70">mock mode ready</span>
              </div>
            </header>
            <main className="max-w-6xl mx-auto p-4">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

