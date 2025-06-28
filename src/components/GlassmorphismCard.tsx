'use client'

import { ReactNode } from 'react'

interface GlassmorphismCardProps {
  children: ReactNode
  className?: string
  intensity?: 'light' | 'medium' | 'strong'
  blur?: number
  opacity?: number
  borderGlow?: boolean
}

export default function GlassmorphismCard({
  children,
  className = '',
  intensity = 'medium',
  blur = 12,
  opacity = 0.1,
  borderGlow = true
}: GlassmorphismCardProps) {
  
  const getIntensityStyles = () => {
    switch (intensity) {
      case 'light':
        return {
          background: `rgba(255, 255, 255, ${opacity * 0.6})`,
          backdropFilter: `blur(${blur * 0.7}px)`,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }
      case 'medium':
        return {
          background: `rgba(255, 255, 255, ${opacity})`,
          backdropFilter: `blur(${blur}px)`,
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }
      case 'strong':
        return {
          background: `rgba(255, 255, 255, ${opacity * 1.5})`,
          backdropFilter: `blur(${blur * 1.3}px)`,
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }
    }
  }

  const styles = getIntensityStyles()

  return (
    <div
      className={`glassmorphism-card ${borderGlow ? 'with-glow' : ''} ${className}`}
      style={{
        ...styles,
        borderRadius: '16px',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.1),
          0 0 0 1px rgba(255, 255, 255, 0.05),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        willChange: 'transform, box-shadow'
      }}
    >
      {children}
    </div>
  )
}