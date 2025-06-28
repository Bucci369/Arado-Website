// src/app/components/StatsSection.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAnimatedRef = useRef(false)

  const stats = [
    { number: 25, label: "Years in Business", startValue: 10 },
    { number: 192, label: "Clubs Played", startValue: 0 },
    { number: 12, label: "Awards", startValue: 0 },
    { number: 492, label: "Releases", startValue: 0 }
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

          gsap.to(animatedValue, {
            val: targetValue,
            duration: 2.5,
            delay: index * 0.15,
            ease: "power2.out",
            onUpdate: () => { 
              statNumberElement.textContent = formatNumberDE(animatedValue.val)
            },
            onComplete: () => { 
              statNumberElement.textContent = formatNumberDE(targetValue)
            }
          })

<<<<<<< HEAD
          // Smooth fade-in statt harsh opacity change
          gsap.fromTo(item, {
            opacity: 1, // Start normal sichtbar
            y: 15,      // Nur leichter Slide-up
          }, {
            opacity: 1, // Bleibt sichtbar
            y: 0,       // Slide to position
=======
          gsap.from(item, {
            opacity: 0,
            y: 30,
>>>>>>> 283e2a89e6e0729170b28fa60c074a015b83bf7d
            duration: 1,
            delay: index * 0.15,
            ease: "power2.out"
          })
        }
      })
    }

<<<<<<< HEAD
    // Besserer ScrollTrigger - fire and forget, aber garantiert im Viewport
    const st = ScrollTrigger.create({
      trigger: container,
      start: "top 60%", // Früher starten - 60% statt 70%
      end: "bottom 40%", // Längerer Trigger-Bereich
      onEnter: () => {
        animateNumbers()
      },
      once: true // Fire and forget!
    })

    return () => {
      st.kill()
      gsap.killTweensOf('.stat-number')
      gsap.killTweensOf('.stat-item')
=======
    const st = ScrollTrigger.create({
      trigger: container,
      start: "top 70%",
      end: "bottom 30%",
      markers: false,
      onEnter: () => {
        animateNumbers()
      },
      onLeaveBack: () => {
        // Optional: Animation zurücksetzen, wenn man wieder hochscrollt
        // hasAnimatedRef.current = false;
        // // Hier könnte man die Zahlen auf den Startwert zurücksetzen, falls gewünscht
      },
      once: false
    })

    // Der IntersectionObserver ist redundant, da ScrollTrigger die Logik bereits abdeckt.
    // Ich lasse ihn hier auskommentiert, um den Code zu bereinigen.
    /*
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            if (!hasAnimatedRef.current) {
              animateNumbers()
            }
          }
        })
      },
      { threshold: [0.5, 0.7, 0.9], rootMargin: '0px' }
    )
    if (container) { observer.observe(container) }
    */

    // Der Intervall-Check ist ebenfalls redundant zu ScrollTrigger.
    // clearInterval(intervalId)

    return () => {
      st.kill()
      // observer.disconnect()
      // clearInterval(intervalId)
      gsap.killTweensOf('.stat-number')
>>>>>>> 283e2a89e6e0729170b28fa60c074a015b83bf7d
    }
  }, [])

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
                {/* KORREKTUR: Gib nur die rohe Zahl aus */}
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
            {/* KORREKTUR: Gib nur die rohe Zahl aus */}
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