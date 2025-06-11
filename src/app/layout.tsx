// src/app/layout.tsx
// KEIN 'use client' mehr hier oben!

import type { Metadata } from 'next'
import { Poppins, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/ClientLayout' // Importiere unsere neue Client-Komponente

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

// Die Metadaten können jetzt hier bleiben, da es eine Server-Komponente ist
export const metadata: Metadata = {
  title: 'DJ ARADO - Deep & Tech House Artist',
  description: 'Official website of DJ ARADO - Deep & Tech House Artist from Berlin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={`${poppins.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        {/* Wir rufen unsere Client-Komponente auf und übergeben die Kinder */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}