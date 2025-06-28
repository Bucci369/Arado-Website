'use client'

import { useEffect, useRef } from 'react'

export default function AmbientEffects() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create floating particles
    const createParticle = () => {
      const particle = document.createElement('div')
      particle.className = 'particle'
      
      // Random positioning
      particle.style.left = Math.random() * 100 + '%'
      particle.style.top = Math.random() * 100 + '%'
      
      // Random animation duration
      particle.style.animationDuration = (4 + Math.random() * 4) + 's'
      particle.style.animationDelay = -Math.random() * 6 + 's'
      
      container.appendChild(particle)
      
      // Remove particle after animation completes
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      }, 8000)
    }

    // Create initial particles
    for (let i = 0; i < 15; i++) {
      setTimeout(() => createParticle(), i * 200)
    }

    // Continuously create new particles
    const interval = setInterval(createParticle, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="ambient-particles" ref={containerRef}>
      {/* Static light blur effects */}
      <div className="light-blur light-blur-1" />
      <div className="light-blur light-blur-2" />
      <div className="light-blur light-blur-3" />
    </div>
  )
}