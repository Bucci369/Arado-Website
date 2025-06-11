// src/app/components/VinylCollectionSection.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useMotionValue } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function VinylCollectionSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  
  const [isVisible, setIsVisible] = useState(false) 
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

  const vinylCovers = [
    { src: '/assets/images/IMG_1954.avif', alt: 'Vinyl Cover 1', delay: 0.05 },
    { src: '/assets/images/IMG_1955.avif', alt: 'Vinyl Cover 2', delay: 0.10 },
    { src: '/assets/images/IMG_1956.avif', alt: 'Vinyl Cover 3', delay: 0.15 },
    { src: '/assets/images/IMG_1957.avif', alt: 'Vinyl Cover 4', delay: 0.20 },
    { src: '/assets/images/IMG_1958.avif', alt: 'Vinyl Cover 5', delay: 0.25 },
    { src: '/assets/images/IMG_1959.avif', alt: 'Vinyl Cover 6', delay: 0.30 },
    { src: '/assets/images/IMG_1966.avif', alt: 'Vinyl Cover 7', delay: 0.35 },
    { src: '/assets/images/IMG_1967.avif', alt: 'Vinyl Cover 8', delay: 0.40 },
    { src: '/assets/images/IMG_1953.avif', alt: 'Vinyl Cover 9', delay: 0.45 },
    { src: '/assets/images/IMG_1951.avif', alt: 'Vinyl Cover 10', delay: 0.50 },
    { src: '/assets/images/IMG_1952.avif', alt: 'Vinyl Cover 11', delay: 0.55 },
  ]

  useEffect(() => {
    // Stellen Sie sicher, dass dieser Code nur im Browser ausgeführt wird.
    if (typeof window === 'undefined') return; //

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )

    const currentSectionRef = sectionRef.current
    if (currentSectionRef) {
      observer.observe(currentSectionRef)
    }

    const handleMouseMove = (e: MouseEvent) => {
      // AKTION: Maus-Effekt für Mobilgeräte deaktivieren
      const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      if (isTouchDevice) return;

      const rect = currentSectionRef?.getBoundingClientRect()
      if (rect) {
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height
        mouseX.set(x * 100) 
        mouseY.set(y * 100)
      }
    }
    
    // AKTION: Event Listener nur auf Nicht-Touch-Geräten hinzufügen
    if (!window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
        window.addEventListener('mousemove', handleMouseMove)
    }

    // Eigene GSAP-Animation für den beschreibenden Text HINZUFÜGEN
    const descriptionText = sectionRef.current?.querySelector('.vinyl-description-text');
    if (descriptionText) {
      gsap.fromTo(descriptionText,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: descriptionText,
            start: "top 90%",
            toggleActions: "play none none reverse",
          }
        }
      );
    }
    const innerSpan = sectionRef.current?.querySelector('.vinyl-description-text span');
    if (innerSpan) {
      gsap.fromTo(innerSpan,
        { opacity: 0 },
        {
          opacity: 0.8,
          duration: 1,
          delay: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: innerSpan,
            start: "top 95%",
            toggleActions: "play none none reverse",
          }
        }
      );
    }

    return () => {
      if (currentSectionRef) observer.unobserve(currentSectionRef)
      // AKTION: Event Listener nur entfernen, wenn er hinzugefügt wurde
      if (!window.matchMedia("(hover: none) and (pointer: coarse)").matches) {
          window.removeEventListener('mousemove', handleMouseMove)
      }
      // Wichtig: Auch die ScrollTriggers für den Beschreibungstext killen
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === descriptionText || trigger.trigger === innerSpan) {
          trigger.kill();
        }
      });
    }
  }, [mouseX, mouseY]) 

  const animatedBackgroundStyle = { y: backgroundY }
  
  const getCirclePosition = (index: number, total: number) => {
    // AKTION: Radien und Z-Index für Mobilgeräte anpassen
    // Diese Bedingung muss auch Client-seitig geprüft werden
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768; //
    
    // Kleinere Radii für Mobilgeräte
    const radius = isMobile ? 120 : 350; 
    const yMultiplier = isMobile ? 0.3 : 0.5; // Weniger vertikale Streckung auf Mobilgeräten
    const zBase = isMobile ? 20 : 50; // Weniger Tiefe auf Mobilgeräten
    const zRange = isMobile ? 40 : 80;

    const angle = (index / total) * Math.PI * 2 - Math.PI / 2 
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius * yMultiplier 
    const z = Math.cos(angle * 2) * zRange + zBase; 
    return { x, y, z, rotate: 0 } 
  }

  return (
    <section
      ref={sectionRef}
      className="vinyl-collection-section page-section"
      style={{
        background: 'transparent',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '4rem 2rem',
        paddingTop: '6rem', 
      }}
    >
      <motion.div 
        className="vinyl-bg-waves"
        style={{ ...animatedBackgroundStyle, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.1 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            style={{ position: 'absolute', width: '200%', height: '200%', left: '-50%', top: '-50%', background: `radial-gradient(circle, transparent 0%, rgba(255, 255, 255, ${0.05 - i * 0.01}) 40%, transparent 70%)` }}
            animate={{ scale: [1 + i * 0.2, 2 + i * 0.2, 1 + i * 0.2], rotate: [0, 180, 360] }}
            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </motion.div>

      <div className="section-header">
        <h2 className="section-title">
          <span className="title-line">
            Vinyl Cosmos
          </span>
        </h2>
        <div className="title-underline"></div> 
      </div>

      <motion.div 
        className="vinyl-spiral-container"
        style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '1200px', 
          height: '600px', 
          perspective: '2000px', 
          zIndex: 5, 
          transformStyle: 'preserve-3d', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          // AKTION: Höhe für Mobilgeräte anpassen
          maxHeight: typeof window !== 'undefined' && window.innerWidth <= 768 ? '400px' : '600px' //
        }}
      >
        {vinylCovers.map((vinyl, index) => {
          const position = getCirclePosition(index, vinylCovers.length)
          // AKTION: Vinyl-Größe für Mobilgeräte anpassen
          const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768; //
          const vinylSize = isMobile ? '120px' : '280px';
          const marginLeft = isMobile ? '-60px' : '-140px';
          const marginTop = isMobile ? '-60px' : '-140px';

          return (
            <motion.div
              key={index}
              className="vinyl-record"
              initial={{ opacity: 0, scale: 0, x: 0, y: -500, z: -1000, rotateY: -180, rotateZ: -720 }}
              animate={isVisible ? { opacity: 1, scale: 1, x: position.x, y: position.y, z: position.z, rotateY: 0, rotateZ: 0, rotateX: 0 } : {}}
              transition={{ duration: 2.5, delay: vinyl.delay * 2, type: "spring", stiffness: 40, damping: 15, scale: { duration: 0.3 } }}
              style={{ 
                position: 'absolute', 
                width: vinylSize, 
                height: vinylSize, 
                borderRadius: '50%', 
                overflow: 'hidden', 
                cursor: 'default', 
                left: '50%', 
                top: '50%', 
                marginLeft: marginLeft, 
                marginTop: marginTop, 
                transformStyle: 'preserve-3d', 
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(255, 255, 255, 0.1)', 
                border: '4px solid #1a1a1a', 
                filter: 'brightness(1)', 
                zIndex: (20 - index) 
              }}
            >
              <motion.div style={{ width: '100%', height: '100%', position: 'relative' }} animate={{ rotateZ: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
                <Image src={vinyl.src} alt={vinyl.alt} fill style={{ objectFit: 'cover' }} sizes={vinylSize} />
              </motion.div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60px', height: '60px', background: 'radial-gradient(circle, #000 45%, #1a1a1a 60%, #333 100%)', borderRadius: '50%', border: '2px solid #222', zIndex: 10, boxShadow: 'inset 0 0 15px rgba(0,0,0,0.9), 0 0 5px rgba(0,0,0,0.5)' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '20px', height: '20px', background: '#000', borderRadius: '50%', border: '1px solid #111' }} />
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      <p className="vinyl-description-text" style={{ textAlign: 'center', marginTop: '4rem', zIndex: 10, position: 'relative', fontSize: '1.4rem', color: '#FFFFFF', maxWidth: '700px', lineHeight: '1.8', margin: '0 auto', fontWeight: 300, letterSpacing: '0.05em', textShadow: '0 2px 20px rgba(255, 255, 255, 0.3)' }}>
        Jedes Vinyl erzählt eine Geschichte, jeder Beat erschafft eine Erinnerung.
        <br />
        <span>
          Das ist meine musikalische Reise durch Klang und Rhythmus.
        </span>
      </p>
    </section>
  )
}