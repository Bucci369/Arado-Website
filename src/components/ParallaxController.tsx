'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion'

interface ParallaxSectionProps {
  children: ReactNode
  offset?: number
  className?: string
  id?: string
}

// Custom hook for parallax calculations
function useParallax(scrollY: MotionValue<number>, offset: number = 0) {
  const y = useTransform(scrollY, (value) => value * offset)
  const opacity = useTransform(
    scrollY,
    [0, 300, 600],
    [1, 0.8, 0.6]
  )
  const scale = useTransform(
    scrollY,
    [0, 500],
    [1, 0.95]
  )
  
  return { y, opacity, scale }
}

// Individual parallax section component
export function ParallaxSection({ 
  children, 
  offset = 0.5, 
  className = '', 
  id 
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const { y, opacity, scale } = useParallax(scrollY, offset)

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`page-section gpu-accelerated ${className}`}
      style={{
        y,
        opacity,
        scale,
      }}
    >
      {children}
    </motion.section>
  )
}

// Main parallax controller that wraps the entire page
interface ParallaxControllerProps {
  children: ReactNode
}

export default function ParallaxController({ children }: ParallaxControllerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Performance optimization: throttle scroll events
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Update parallax calculations here if needed
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Intersection Observer for lazy loading
    const observerOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('loaded')
          // Load images or heavy content here
        }
      })
    }, observerOptions)
    
    // Observe all sections
    const sections = document.querySelectorAll('.page-section')
    sections.forEach(section => observer.observe(section))
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])
  
  return (
    <div ref={containerRef} className="parallax-wrapper">
      {children}
    </div>
  )
}

