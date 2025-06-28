'use client'

import { useRef, useEffect } from 'react'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  intensity?: number
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export default function MagneticButton({ 
  children, 
  className = '', 
  intensity = 15,
  onClick,
  type = 'button'
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    let animationId: number

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      const moveX = (x / rect.width) * intensity
      const moveY = (y / rect.height) * intensity

      if (animationId) cancelAnimationFrame(animationId)
      
      animationId = requestAnimationFrame(() => {
        button.style.transform = `translate(${moveX}px, ${moveY}px)`
      })
    }

    const handleMouseLeave = () => {
      if (animationId) cancelAnimationFrame(animationId)
      
      animationId = requestAnimationFrame(() => {
        button.style.transform = 'translate(0px, 0px)'
      })
    }

    button.addEventListener('mousemove', handleMouseMove)
    button.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      button.removeEventListener('mousemove', handleMouseMove)
      button.removeEventListener('mouseleave', handleMouseLeave)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [intensity])

  return (
    <button
      ref={buttonRef}
      type={type}
      className={`magnetic-button transition-transform duration-300 ease-out ${className}`}
      onClick={onClick}
      style={{
        willChange: 'transform'
      }}
    >
      {children}
    </button>
  )
}