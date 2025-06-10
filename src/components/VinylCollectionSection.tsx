'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'

export default function VinylCollectionSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  // const [hoveredIndex, setHoveredIndex] = useState<number | null>(null) // DIESE ZEILE ENTFERNEN

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

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
    { src: '/assets/images/IMG_1952.avif', alt: 'Vinyl Cover 11', delay: 1.0 },
  ]

  useEffect(() => {
    setIsMounted(true)
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        } else {
          // setIsVisible(false); // Kannst du aktivieren, wenn Animationen beim Verlassen zurückgesetzt werden sollen
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    // ACHTUNG: Die Mausbewegungs-Handler sind immer noch da,
    // aber ihre Werte werden nicht mehr direkt auf die Überschrift angewendet.
    // Sie werden aber noch für die rotateSectionX/Y in animatedStackStyle verwendet.
    // Wenn du den Parallax-Effekt auf die Vinyls ebenfalls entfernen willst,
    // müsste der handleMouseMove Listener ganz entfernt werden.
    const handleMouseMove = (e: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect()
      if (rect) {
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height
        mouseX.set(x * 100) 
        mouseY.set(y * 100)
      }
    }

    if (isMounted) { 
      window.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
      observer.disconnect()
      if (isMounted) { 
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [isMounted, mouseX, mouseY]) 

  const animatedBackgroundStyle = isMounted ? { y: backgroundY } : { y: '0%' }
  
  const getCirclePosition = (index: number, total: number) => {
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2 
    const radius = 350 
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius * 0.5 
    const z = Math.cos(angle * 2) * 80 + 50; 
    return { x, y, z, rotate: 0 } 
  }

  return (
    <section 
      ref={sectionRef}
      className="vinyl-collection-section page-section section-is-white new-style-section"
      style={{
        background: '#000000',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4rem 2rem'
      }}
    >
      {/* Animierte Hintergrund-Wellen */}
      <motion.div 
        className="vinyl-bg-waves"
        style={{ 
          ...animatedBackgroundStyle,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.1
        }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '200%',
              height: '200%',
              left: '-50%',
              top: '-50%',
              background: `radial-gradient(circle at center, transparent 0%, rgba(255, 255, 255, ${0.05 - i * 0.01}) 40%, transparent 70%)`,
            }}
            animate={isMounted ? {
              scale: [1 + i * 0.2, 2 + i * 0.2, 1 + i * 0.2],
              rotate: [0, 180, 360],
            } : {}}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </motion.div>

      {/* Glitch-Effekt für den Header */}
      <motion.div
        className="section-header"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isVisible ? { 
          opacity: 1, 
          scale: 1,
        } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 100 }}
        style={{ 
          textAlign: 'center',
          marginBottom: '3rem',
          zIndex: 10,
          position: 'relative',
          // x: springX,  <-- DIESE ZEILE ENTFERNT
          // y: springY   <-- DIESE ZEILE ENTFERNT
        }}
      >
        <motion.div
  className="section-header"
  initial={{ opacity: 0, y: -50 }}
  animate={isVisible ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
  style={{ zIndex: 10 }}
>
  {/* Diese h2 benutzt jetzt die globalen CSS-Klassen */}
  <h2 className="section-title">
    <span className="title-line">
      Vinyl Cosmos
    </span>
  </h2>
  
  
</motion.div>
        
        {/* Pulsierender Unterstrich */}
        <motion.div 
          animate={{
            width: ['60px', '120px', '60px'],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, #666666, #ffffff, #666666)',
            margin: '0 auto',
            borderRadius: '2px',
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
          }}
        />
      </motion.div>

      {/* 3D Vinyl-Spirale */}
      <motion.div 
        className="vinyl-spiral-container"
        style={{ 
          // ...animatedStackStyle, // <-- DIESE ZEILE KANN AUCH ENTFERNT WERDEN, wenn Parallax ganz weg soll
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          height: '600px',
          perspective: '2000px',
          zIndex: 5,
          transformStyle: 'preserve-3d',
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center'
        }}
      >
        {vinylCovers.map((vinyl, index) => {
          const position = getCirclePosition(index, vinylCovers.length)
          
          return (
            <motion.div
              key={index}
              className="vinyl-record"
              initial={{
                opacity: 0,
                scale: 0,
                x: 0, 
                y: -500, 
                z: -1000, 
                rotateY: -180, 
                rotateZ: -720
              }}
              animate={isVisible ? {
                opacity: 1,
                scale: 1, 
                x: position.x, 
                y: position.y, 
                z: position.z, 
                rotateY: 0, 
                rotateZ: 0, 
                rotateX: 0
              } : {}}
              transition={{
                duration: 2.5,
                delay: vinyl.delay * 2, 
                type: "spring",
                stiffness: 40,
                damping: 15,
                scale: {
                  duration: 0.3
                }
              }}
              style={{
                position: 'absolute', 
                width: '280px',
                height: '280px',
                borderRadius: '50%',
                overflow: 'hidden',
                cursor: 'default',
                left: '50%',
                top: '50%',
                marginLeft: '-140px', 
                marginTop: '-140px', 
                transformStyle: 'preserve-3d',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(255, 255, 255, 0.1)',
                border: '4px solid #1a1a1a',
                filter: 'brightness(1)',
                zIndex: (20 - index),
              }}
            >
              {/* Vinyl Bild - Rotiert jetzt konstant, da Hover entfernt */}
              <motion.div
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative'
                }}
                animate={{
                  rotateZ: 360
                }}
                transition={{
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Image
                  src={vinyl.src}
                  alt={vinyl.alt}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="280px"
                />
              </motion.div>
              
              {/* Zentrum OHNE Drehung mit dem Bild - bleibt immer in der Mitte des Vinyls */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '60px',
                  height: '60px',
                  background: 'radial-gradient(circle, #000 45%, #1a1a1a 60%, #333 100%)',
                  borderRadius: '50%',
                  border: '2px solid #222',
                  zIndex: 10, 
                  boxShadow: 'inset 0 0 15px rgba(0,0,0,0.9), 0 0 5px rgba(0,0,0,0.5)'
                }}
              >
                {/* Innerer Kreis für mehr Realismus */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '20px',
                    height: '20px',
                    background: '#000',
                    borderRadius: '50%',
                    border: '1px solid #111'
                  }}
                />
              </div>
              
              {/* Rillen OHNE Drehung mit dem Bild - bleibt in Position zum Vinyl */}
              {[20, 40, 60].map((size, i) => (
                <div 
                  key={i}
                  style={{ 
                    position: 'absolute',
                    top: `${size}px`,
                    left: `${size}px`,
                    right: `${size}px`,
                    bottom: `${size}px`,
                    border: `1px solid rgba(255, 255, 255, 0.1)`,
                    boxShadow: 'none'
                  }}
                />
              ))}
            </motion.div>
          )
        })}

        {/* Zentraler Energie-Kern */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isVisible ? { 
            scale: [0, 1.5, 1],
            opacity: [0, 0.8, 0.6]
          } : {}}
          transition={{ 
            duration: 3,
            delay: 1,
            scale: {
              repeat: Infinity,
              repeatType: "reverse",
              duration: 4
            }
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(30px)',
            zIndex: 0
          }}
        />

        {/* Schwebende Partikel */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: '#ffffff',
              borderRadius: '50%',
              left: '50%',
              top: '50%',
              boxShadow: '0 0 8px #ffffff'
            }}
            animate={isVisible ? {
              x: [0, Math.random() * 600 - 300], 
              y: [0, Math.random() * 600 - 300], 
              z: [0, Math.random() * 400 - 200], 
              opacity: [0, 1, 0],
              scale: [0, Math.random() * 2 + 1, 0]
            } : {}}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>

      {/* Unterer Text mit Typewriter-Effekt */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 3 }}
        style={{
          textAlign: 'center',
          marginTop: '4rem',
          zIndex: 10,
          position: 'relative'
        }}
      >
        <motion.p 
          style={{
            fontSize: '1.4rem',
            color: '#FFFFFF',
            maxWidth: '700px',
            lineHeight: '1.8',
            margin: '0 auto',
            fontWeight: 300,
            letterSpacing: '0.05em',
            textShadow: '0 2px 20px rgba(255, 255, 255, 0.3)'
          }}
        >
          <motion.span
            animate={{
              textShadow: [
                '0 2px 20px rgba(255, 255, 255, 0.3)',
                '0 2px 40px rgba(255, 255, 255, 0.5)',
                '0 2px 20px rgba(255, 255, 255, 0.3)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Jedes Vinyl erzählt eine Geschichte, jeder Beat erschafft eine Erinnerung.
          </motion.span>
          <br />
          <motion.span
            style={{ opacity: 0.8 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 3.5 }}
          >
            Das ist meine musikalische Reise durch Klang und Rhythmus.
          </motion.span>
        </motion.p>
      </motion.div>

      {/* Futuristischer Scroll-Indikator (Dieser Block wurde bereits in der vorherigen Antwort entfernt) */}
    </section>
  )
}