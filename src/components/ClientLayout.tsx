'use client'

import GSAPInitializer from '@/components/GSAPInitializer'
import GalaxyBackground from '@/components/GalaxyBackground'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <GSAPInitializer />
      <GalaxyBackground />
      <main>{children}</main>
    </>
  )
}