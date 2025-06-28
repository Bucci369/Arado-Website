'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface TextRevealProps {
  children: string
  className?: string
  delay?: number
  stagger?: number
  animationType?: 'slide' | 'fade' | 'split' | 'glitch'
}

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function TextReveal({ 
  children, 
  className = '', 
  delay = 0,
  stagger = 0.05,
  animationType = 'slide'
}: TextRevealProps) {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const textElement = textRef.current
    if (!textElement) return

    // Split text into individual characters
    const text = children
    const chars = text.split('')
    
    // Clear the original text and create spans for each character
    textElement.innerHTML = ''
    
    chars.forEach((char) => {
      const span = document.createElement('span')
      span.textContent = char === ' ' ? '\u00A0' : char // Non-breaking space
      span.style.display = 'inline-block'
      span.style.position = 'relative'
      span.classList.add('reveal-char')
      
      // Set initial animation state based on type
      switch (animationType) {
        case 'slide':
          span.style.transform = 'translateY(100px) rotateX(90deg)'
          span.style.opacity = '0'
          break
        case 'fade':
          span.style.opacity = '0'
          span.style.transform = 'scale(0.5)'
          break
        case 'split':
          span.style.transform = 'translateY(50px)'
          span.style.opacity = '0'
          break
        case 'glitch':
          span.style.transform = 'translateX(-20px) skewX(10deg)'
          span.style.opacity = '0'
          span.style.filter = 'blur(3px)'
          break
      }
      
      textElement.appendChild(span)
    })

    // GSAP Animation
    const spans = textElement.querySelectorAll('.reveal-char')
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: textElement,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    })

    // Animate based on type
    switch (animationType) {
      case 'slide':
        tl.to(spans, {
          duration: 0.8,
          y: 0,
          rotateX: 0,
          opacity: 1,
          ease: 'power3.out',
          stagger: stagger,
          delay: delay
        })
        break
        
      case 'fade':
        tl.to(spans, {
          duration: 0.6,
          opacity: 1,
          scale: 1,
          ease: 'back.out(1.7)',
          stagger: stagger,
          delay: delay
        })
        break
        
      case 'split':
        tl.to(spans, {
          duration: 0.7,
          y: 0,
          opacity: 1,
          ease: 'power2.out',
          stagger: stagger,
          delay: delay
        })
        break
        
      case 'glitch':
        tl.to(spans, {
          duration: 0.5,
          x: 0,
          skewX: 0,
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'power2.out',
          stagger: stagger,
          delay: delay
        })
        break
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [children, delay, stagger, animationType])

  return (
    <div 
      ref={textRef}
      className={`text-reveal ${className}`}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </div>
  )
}