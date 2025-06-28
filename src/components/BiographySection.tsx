// src/components/BiographySection.tsx
'use client'

import { useEffect, useRef } from 'react' // useState wurde entfernt
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

function BiographySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const bioImageWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Sicherstellen, dass die Code-Ausführung nur im Browser stattfindet
    if (typeof window === 'undefined') return

    const section = sectionRef.current
    const bioImageWrapper = bioImageWrapperRef.current

    if (!section || !bioImageWrapper) return

    // --- Bio Image Animation (Vereinfacht & Korrigiert) ---
    const bioImage = section.querySelector('.bio-image') as HTMLElement
    if (bioImage) {
      // GSAP-Animation, die dank "once: true" nur einmal ausgeführt wird.
      // Der "hasImageAnimated"-State ist nicht mehr nötig.
      gsap.to(bioImage, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bioImage,
          start: "top 85%", // Startet, wenn das Bild zu 85% im Viewport ist
          once: true, // Stellt sicher, dass es nur einmal passiert
        },
      })
    }

    // --- Parallax-Effekt für das Profilbild ---
    const parallaxIntensityImage = 10
    const liftAmountImage = 10
    const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches

    // Wir fügen die Event-Listener nur auf Nicht-Touch-Geräten hinzu
    if (!isTouchDevice) {
      const handleMouseMove = (e: MouseEvent) => {
        requestAnimationFrame(() => {
          if (!bioImageWrapper) return;
          const rect = bioImageWrapper.getBoundingClientRect()
          const mouseXpercent = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2))
          const mouseYpercent = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2))
          
          const rotateY = mouseXpercent * parallaxIntensityImage
          const rotateX = -mouseYpercent * parallaxIntensityImage * 0.6
          
          gsap.to(bioImageWrapper, {
            duration: 0.5,
            ease: 'power1.out',
            transform: `rotateX(${rotateX - 8}deg) rotateY(${rotateY}deg) translateZ(${liftAmountImage}px)`
          });
        })
      }

      const handleMouseLeave = () => {
        gsap.to(bioImageWrapper, {
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)',
          transform: 'rotateX(-8deg) rotateY(0deg) translateZ(0px)'
        });
      }

      bioImageWrapper.addEventListener('mousemove', handleMouseMove)
      bioImageWrapper.addEventListener('mouseleave', handleMouseLeave)
      
      // Initial-Rotation setzen
      gsap.set(bioImageWrapper, { transform: 'rotateX(-8deg) rotateY(0deg) translateZ(0px)' });

      // Cleanup-Funktion
      return () => {
        bioImageWrapper.removeEventListener('mousemove', handleMouseMove)
        bioImageWrapper.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, []) // Leeres Array ist jetzt korrekt, da keine externen Abhängigkeiten mehr bestehen.

  return (
    <section 
      ref={sectionRef}
      id="ueber-mich" // ID war "about-me", aber in der CSS ist sie "#ueber-mich"
      className="page-section"
    >
      <div className="section-header">
        <h2 className="section-title">
          <span className="title-line">The</span>
          <span className="title-line">Journey</span>
        </h2>
        <div className="title-underline"></div>
      </div>
      
      <div className="bio-content">
        {/* Die Inline-Styles wurden entfernt und sind jetzt im CSS */}
        <div ref={bioImageWrapperRef} className="bio-image-wrapper">
          <div className="bio-image">
            <Image
              src="/assets/images/Profilbild1.jpg"
              alt="Foto von DJ ARADO"
              width={320}
              height={400}
              className="bio-image-img"
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGBkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              quality={75}
            />
            <div className="image-overlay"></div>
          </div>
        </div>
        
        <div className="bio-text">
          <p className="bio-paragraph">
            From Desolat and Remote Area to Moon Harbour via Düsseldorf – in short, that&apos;s how Arado&apos;s story is best summed up. With the spotlight getting brighter for this talented German export, he&apos;s already accrued a world-wide scroll of premium parties at Cocoon and Watergate Germany, Tenax in Italy, Café D&apos;Anvers in Belgium, WMC in Miami, and a legendary closing finale last season at Space in Ibiza.
          </p>
          <p className="bio-paragraph">
            Arado is genuine proof that almost everything is possible with the right amount of dedication and perseverance. As an undeniably talented producer - his &quot;Uganda Express&quot; release, signed by Loco Dice for his Desolat label, kick-started his career to international status.
          </p>
          <p className="bio-paragraph">
            Following this acclaimed release came other outstanding productions on labels such as All Inn and Dame Music, which ultimately led to an EP on Matthias Tanzmann&apos;s Moon Harbour label that even took him aboard their booking squad.
          </p>
          <p className="bio-paragraph">
            Whether in the beginning in partnership with Den Ishu or nowadays in collaboration with Italian Marco Faraone, Arada simply knows a thing or two about rocking the Deep & Tech House Floors worldwide. His raw, driving grooves with a Chicago edge enjoy the support of the international DJ elite, and are responsible for propelling him to the top of the rankings as an electronic music artist.
          </p>
        </div>
      </div>
    </section>
  )
}

export default BiographySection