// src/app/components/VinylCollectionSection.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Hilfsfunktion, um die Standardwerte für den Server zu bekommen
const getServerSideStyles = () => ({
  containerMaxHeight: '600px',
  vinylSize: '200px',
  vinylMargin: '-100px',
});

export default function VinylCollectionSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  
  // NEU: State für dynamische Styles, initialisiert mit Server-Werten
  const [dynamicStyles, setDynamicStyles] = useState(getServerSideStyles());

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
  ];
  
  // NEU: useEffect, um die Styles auf dem Client zu aktualisieren
  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      const isMobile = vw <= 480;
      const isTablet = vw <= 768;

      if (isMobile) {
        setDynamicStyles({
          containerMaxHeight: '400px',
          vinylSize: '80px',
          vinylMargin: '-40px',
        });
      } else if (isTablet) {
        setDynamicStyles({
          containerMaxHeight: '400px',
          vinylSize: '120px',
          vinylMargin: '-60px',
        });
      } else {
        setDynamicStyles(getServerSideStyles());
      }
    };

    // Führe die Funktion einmal beim Laden aus
    handleResize();

    // Füge einen Event-Listener hinzu, um auf Größenänderungen zu reagieren
    window.addEventListener('resize', handleResize);

    // Cleanup-Funktion
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Leeres Array, damit dieser Hook nur auf dem Client läuft

  useEffect(() => {
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

    return () => {
      if (currentSectionRef) observer.unobserve(currentSectionRef)
    }
  }, []);

  const getCirclePosition = (index: number, total: number) => {
    // Diese Funktion kann window sicher verwenden, da sie von der Render-Logik getrennt ist
    // die jetzt den State verwendet.
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const isMobile = vw <= 480;
    const isTablet = vw <= 768;
    
    let radius = isMobile ? vw * 0.35 : isTablet ? vw * 0.28 : Math.min(350, vw * 0.25);
    const yMultiplier = isMobile ? 0.3 : isTablet ? 0.4 : 0.5;
    const zBase = isMobile ? 10 : isTablet ? 30 : 50;
    const zRange = isMobile ? 20 : isTablet ? 50 : 80;

    const angle = (index / total) * Math.PI * 2 - Math.PI / 2 
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius * yMultiplier 
    const z = Math.cos(angle * 2) * zRange + zBase; 
    return { x, y, z, rotate: 0 } 
  };


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
        style={{ y: backgroundY, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.1 }}
      >
        {/* ... Wellen-Animation ... */}
      </motion.div>

      <div className="section-header">
        <h2 className="section-title"><span className="title-line">Vinyl Cosmos</span></h2>
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
          maxHeight: dynamicStyles.containerMaxHeight, // <-- Wert aus State verwenden
        }}
      >
        {vinylCovers.map((vinyl, index) => {
          const position = getCirclePosition(index, vinylCovers.length);
          return (
            <motion.div
              key={index}
              className="vinyl-record"
              initial={{ opacity: 0, scale: 0, x: 0, y: -500, z: -1000, rotateY: -180, rotateZ: -720 }}
              animate={isVisible ? { opacity: 1, scale: 1, x: position.x, y: position.y, z: position.z, rotateY: 0, rotateZ: 0, rotateX: 0 } : {}}
              transition={{ duration: 2.5, delay: vinyl.delay * 2, type: "spring", stiffness: 40, damping: 15, scale: { duration: 0.3 } }}
              style={{ 
                position: 'absolute', 
                width: dynamicStyles.vinylSize, // <-- Wert aus State verwenden
                height: dynamicStyles.vinylSize, // <-- Wert aus State verwenden
                borderRadius: '50%', 
                overflow: 'hidden', 
                cursor: 'default', 
                left: '50%', 
                top: '50%', 
                marginLeft: dynamicStyles.vinylMargin, // <-- Wert aus State verwenden
                marginTop: dynamicStyles.vinylMargin, // <-- Wert aus State verwenden
                transformStyle: 'preserve-3d', 
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 3px rgba(255, 255, 255, 0.1)', 
                border: '4px solid #1a1a1a', 
                filter: 'brightness(1)', 
                zIndex: (20 - index) 
              }}
            >
              <motion.div style={{ width: '100%', height: '100%', position: 'relative' }} animate={{ rotateZ: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
                <Image src={vinyl.src} alt={vinyl.alt} fill style={{ objectFit: 'cover' }} sizes={dynamicStyles.vinylSize} />
              </motion.div>
              {/* ... Vinyl-Label in der Mitte ... */}
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