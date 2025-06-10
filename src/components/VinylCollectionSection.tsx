'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'

export default function VinylCollectionSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  // Diese useMotionValue und useSpring Hooks MÜSSEN IMMER auf Top-Level sein und IMMER ausgeführt werden.
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  // Parallax-Transformationen
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const stackY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])
  
  // WICHTIG: useTransform MUSS ebenfalls IMMER auf Top-Level ausgeführt werden.
  // Es gibt ein MotionValue zurück, das dann im Style-Prop verwendet wird.
  // Das MotionValue existiert auch auf dem Server, ist dort aber inaktiv.
  const rotateSectionX = useTransform(springY, [-100, 100], [-5, 5]) 
  const rotateSectionY = useTransform(springX, [-100, 100], [5, -5]) 
  // ENDE der Hooks, die IMMER auf Top-Level sein müssen.

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
          // Optional: Wenn du möchtest, dass Animationen zurückgesetzt werden, wenn sie aus dem Blickfeld sind
          // setIsVisible(false); 
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    // Mausbewegungs-Handler für Parallax-Effekt
    // Dieser Listener wird nur auf dem Client hinzugefügt, da er window benötigt.
    const handleMouseMove = (e: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect()
      if (rect) {
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height
        mouseX.set(x * 100) 
        mouseY.set(y * 100)
      }
    }

    // `isMounted` ist hier wichtig, damit `window` nicht während SSR aufgerufen wird
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
  // animatedStackStyle kann jetzt direkt die MotionValues nutzen, da sie immer existieren.
  // Bei SSR sind sie inaktiv, bei Client-Render aktiv.
  const animatedStackStyle = { y: stackY, rotateY: rotateSectionY, rotateX: rotateSectionX };

  // Kreis-Formation für Vinyls (stabiler)
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
      className="vinyl-collection-section"
      style={{
        background: 'radial-gradient(ellipse at center, #1a2832 0%, #0a0f14 60%, #030509 100%)',
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
          opacity: 0.3
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
              background: `radial-gradient(circle at center, transparent 0%, rgba(34, 211, 238, ${0.1 - i * 0.02}) 40%, transparent 70%)`,
            }}
            animate={isMounted ? { // Animation nur auf dem Client
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
          // Maus-Parallax auf den Header - direkt MotionValues verwenden
          // Bei SSR sind sie inaktiv, bei Client-Render aktiv
          x: springX, 
          y: springY
        }}
      >
        <motion.h2 
          animate={isVisible ? {
            textShadow: [
              '0 0 0 transparent',
              '2px 2px 0 #22d3ee, -2px -2px 0 #f43f5e',
              '0 0 0 transparent',
              '-2px 2px 0 #a855f7, 2px -2px 0 #3b82f6',
              '0 0 0 transparent'
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          style={{
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            fontWeight: 900,
            color: '#FFFFFF',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            filter: 'contrast(2)'
          }}
        >
          <span style={{ display: 'block' }}>My</span>
          <motion.span 
            style={{ 
              display: 'block',
              background: 'linear-gradient(45deg, #22d3ee, #06b6d4, #a855f7, #f43f5e)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            Collection
          </motion.span>
        </motion.h2>
        
        {/* Pulsierender Unterstrich */}
        <motion.div 
          animate={{
            width: ['60px', '120px', '60px'],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, #22d3ee, #a855f7, #f43f5e)',
            margin: '0 auto',
            borderRadius: '2px',
            boxShadow: '0 0 20px rgba(34, 211, 238, 0.8)'
          }}
        />
      </motion.div>

      {/* 3D Vinyl-Spirale */}
      <motion.div 
        className="vinyl-spiral-container"
        style={{ 
          // Hier können MotionValues direkt verwendet werden
          ...animatedStackStyle, 
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
          const isHovered = hoveredIndex === index
          
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
                scale: isHovered ? 1.3 : 1, 
                x: position.x, 
                y: position.y, 
                z: isHovered ? 200 : position.z, 
                rotateY: 0, 
                rotateZ: 0, 
                rotateX: isHovered ? 0 : 0
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
              // onHoverStart/End nur auf dem Client aktivieren
              onHoverStart={isMounted ? () => setHoveredIndex(index) : undefined} 
              onHoverEnd={isMounted ? () => setHoveredIndex(null) : undefined} 
              style={{
                position: 'absolute', 
                width: '280px',
                height: '280px',
                borderRadius: '50%',
                overflow: 'hidden',
                cursor: 'pointer',
                left: '50%',
                top: '50%',
                marginLeft: '-140px', 
                marginTop: '-140px', 
                transformStyle: 'preserve-3d',
                boxShadow: isHovered 
                  ? '0 50px 100px rgba(34, 211, 238, 0.5), 0 0 0 10px rgba(255, 255, 255, 0.2), inset 0 0 50px rgba(168, 85, 247, 0.5)'
                  : '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(255, 255, 255, 0.1)',
                border: isHovered ? '4px solid #22d3ee' : '4px solid #1a1a1a',
                filter: isHovered ? 'brightness(1.2) contrast(1.1)' : 'brightness(1)',
                zIndex: isHovered ? 1000 : (20 - index) 
              }}
            >
              {/* Glühender Rand-Effekt beim Hover */}
              {isHovered && (
                <motion.div
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '-20px',
                    right: '-20px',
                    bottom: '-20px',
                    background: 'conic-gradient(from 0deg, #22d3ee, #a855f7, #f43f5e, #22d3ee)',
                    borderRadius: '50%',
                    zIndex: -1,
                    filter: 'blur(20px)',
                    opacity: 0.8
                  }}
                  animate={{
                    rotate: 360
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              )}
              
              {/* Vinyl Bild - Rotiert beim Hover */}
              <motion.div
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative'
                }}
                animate={isHovered ? {
                  rotateZ: 360 
                } : {}}
                transition={{
                  duration: 3,
                  repeat: isHovered ? Infinity : 0, 
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
                    border: `1px solid rgba(255, 255, 255, ${isHovered ? 0.3 : 0.1})`, 
                    borderRadius: '50%',
                    boxShadow: isHovered ? `0 0 10px rgba(34, 211, 238, ${0.5 - i * 0.1})` : 'none'
                  }}
                />
              ))}
            </motion.div>
          )
        })}

        {/* Zentraler Energie-Kern - Z-Index angepasst, damit Vinyls darüber schweben können */}
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
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(34, 211, 238, 0.2) 40%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            zIndex: 0
          }}
        />

        {/* Schwebende Partikel - jetzt mit Z-Achsen-Bewegung */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: '#22d3ee',
              borderRadius: '50%',
              left: '50%',
              top: '50%',
              boxShadow: '0 0 10px #22d3ee'
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
            textShadow: '0 2px 20px rgba(34, 211, 238, 0.5)'
          }}
        >
          {/* Text mit Glow-Animation */}
          <motion.span
            animate={{
              textShadow: [
                '0 2px 20px rgba(34, 211, 238, 0.5)',
                '0 2px 40px rgba(168, 85, 247, 0.8)',
                '0 2px 20px rgba(34, 211, 238, 0.5)'
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

      {/* Futuristischer Scroll-Indikator */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, delay: 4, type: "spring" }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          color: 'rgba(255, 255, 255, 0.6)',
          zIndex: 10
        }}
      >
        <motion.span 
          style={{ 
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#22d3ee',
            fontWeight: 500
          }}
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Jetzt anhören
        </motion.span>
        
        {/* Animierter Pfeil */}
        <motion.div
          style={{
            width: '30px',
            height: '50px',
            border: '2px solid #22d3ee',
            borderRadius: '25px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <motion.div
            animate={{
              y: [0, 20, 0],
              opacity: [1, 0, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: '4px',
              height: '12px',
              background: '#22d3ee',
              borderRadius: '2px',
              position: 'absolute',
              left: '50%',
              top: '8px',
              marginLeft: '-2px',
              boxShadow: '0 0 10px #22d3ee'
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}