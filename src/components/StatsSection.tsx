// src/app/components/StatsSection.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const hasAnimatedRef = useRef(false)

  const stats = [
    {
      number: 25,
      label: "Years in Business",
      startValue: 10
    },
    {
      number: 192,
      label: "Clubs Played",
      startValue: 0
    },
    {
      number: 12,
      label: "Awards",
      startValue: 0
    },
    {
      number: 492,
      label: "Releases",
      startValue: 0
    }
  ]

  const spotifyStats = {
    number: 34822,
    label: "Spotify Plays",
    startValue: 0
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    const section = sectionRef.current
    const container = containerRef.current
    if (!section || !container) return

    // Number formatting function
    const formatNumberDE = (value: number) => {
      return Math.round(value).toLocaleString('de-DE')
    }

    function animateNumbers() {
      if (hasAnimatedRef.current || !container) return
      hasAnimatedRef.current = true

      const statsItems = container.querySelectorAll('.stat-item')
      
      statsItems.forEach((item, index) => {
        const statNumberElement = item.querySelector('.stat-number') as HTMLElement
        if (statNumberElement) {
          const targetValue = parseFloat(statNumberElement.dataset.targetValue || '0')
          let startValue = parseFloat(statNumberElement.dataset.startValue || '0')
          
          if (isNaN(targetValue)) return
          if (isNaN(startValue)) { startValue = 0 }

          statNumberElement.textContent = formatNumberDE(startValue)
          const animatedValue = { val: startValue }

          // Gestaffelte Animation mit Delay
          gsap.to(animatedValue, {
            val: targetValue,
            duration: 2.5,
            delay: index * 0.15, // Etwas mehr Delay für dramatischen Effekt
            ease: "power2.out",
            onUpdate: () => { 
              statNumberElement.textContent = formatNumberDE(animatedValue.val)
            },
            onComplete: () => { 
              statNumberElement.textContent = formatNumberDE(targetValue)
            }
          })

          // Fade-in Effekt für die Labels
          gsap.from(item, {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: index * 0.15,
            ease: "power2.out"
          })
        }
      })
    }

    // Option 1: ScrollTrigger mit mehreren Trigger-Punkten
    const st = ScrollTrigger.create({
      trigger: container,
      start: "top 95%", // Startet erst wenn 70% der Container im View ist
      end: "bottom 30%",
      markers: false, // Setze auf true zum Debuggen
      onEnter: () => {
        console.log('Stats section entered viewport')
        setIsVisible(true)
        animateNumbers()
      },
      onLeaveBack: () => {
        // Reset wenn user nach oben scrollt
        setIsVisible(false)
      },
      once: false // Animation kann wiederholt werden
    })

    // Option 2: Zusätzlicher Fallback mit IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) { // Mindestens 50% sichtbar
            console.log('Stats section 50% visible')
            if (!hasAnimatedRef.current) {
              animateNumbers()
            }
          }
        })
      },
      {
        threshold: [0.5, 0.7, 0.9], // Multiple Schwellenwerte
        rootMargin: '0px'
      }
    )

    observer.observe(container)

    // Option 3: Time-based Fallback
    // Falls der User sehr lange in der vorherigen Section bleibt
    const checkVisibility = () => {
      const rect = container.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const isInView = rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3
      
      if (isInView && !hasAnimatedRef.current) {
        console.log('Stats section in view - manual check')
        animateNumbers()
      }
    }

    // Check alle 500ms ob Section sichtbar ist
    const intervalId = setInterval(checkVisibility, 500)

    // Cleanup
    return () => {
      st.kill()
      observer.disconnect()
      clearInterval(intervalId)
      gsap.killTweensOf('.stat-number')
    }
  }, [])

  // Manual trigger Button für Notfälle
  const manualTrigger = () => {
    hasAnimatedRef.current = false
    const container = containerRef.current
    if (!container) return
    
    // Reset alle Zahlen
    container.querySelectorAll('.stat-number').forEach(el => {
      const startValue = parseFloat(el.getAttribute('data-start-value') || '0')
      el.textContent = startValue.toLocaleString('de-DE')
    })
    
    // Warte kurz, dann animiere
    setTimeout(() => {
      const section = sectionRef.current
      if (!section) return
      
      const event = new Event('scroll')
      window.dispatchEvent(event)
      ScrollTrigger.refresh()
    }, 100)
  }

  return (
    <section 
      ref={sectionRef}
      id="stats" 
      className="page-section section-is-white new-style-section min-h-screen py-20 px-8 flex flex-col items-center justify-center text-white relative"
      style={{
        background: 'transparent',
        position: 'relative'
      }}
    >
            
      <div className="section-header mb-16">
        <h2 className="section-title text-4xl md:text-5xl lg:text-6xl font-extrabold text-white uppercase tracking-wide text-center mb-4">
          <span className="title-line block">Career</span>
          <span className="title-line block">Milestones</span>
        </h2>
        <div className="title-underline w-12 h-1 bg-gradient-to-r from-cyan-400 to-cyan-600 mx-auto"></div>
      </div>

      <div ref={containerRef} className="stats-container max-w-4xl w-full mx-auto px-4">
        <div className="stats-grid grid grid-cols-2 gap-8 mb-10">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item text-center">
              <span 
                className="stat-number block text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-2"
                data-target-value={stat.number}
                data-start-value={stat.startValue}
              >
                {stat.startValue}
              </span>
              <hr className="stat-separator w-12 h-0.5 bg-cyan-400 border-none mx-auto my-2" />
              <span className="stat-label text-sm md:text-base text-cyan-200 uppercase tracking-widest font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <div className="spotify-item stat-item text-center">
          <span 
            className="stat-number spotify-plays block text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight mb-4"
            data-target-value={spotifyStats.number}
            data-start-value={spotifyStats.startValue}
          >
            {spotifyStats.startValue}
          </span>
          <hr className="stat-separator w-16 h-0.5 bg-cyan-400 border-none mx-auto my-3" />
          <span className="stat-label text-lg md:text-xl text-cyan-200 uppercase tracking-widest font-medium">
            {spotifyStats.label}
          </span>
        </div>
      </div>
    </section>
  )
}