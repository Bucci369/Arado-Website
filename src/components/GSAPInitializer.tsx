'use client'

import { useEffect } from 'react'
import { initGSAPAnimations, cleanupGSAPAnimations } from '@/lib/gsap-animations'

export default function GSAPInitializer() {
  useEffect(() => {
    // Warte bis DOM vollständig geladen ist
    const timer = setTimeout(() => {
      initGSAPAnimations()
    }, 100)

    return () => {
      clearTimeout(timer)
      cleanupGSAPAnimations()
    }
  }, [])

  return null
}