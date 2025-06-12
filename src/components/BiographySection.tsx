'use client'

import { useEffect, useRef } from 'react'
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
    if (typeof window === 'undefined') return

    const section = sectionRef.current
    const bioImageWrapper = bioImageWrapperRef.current

    if (!section || !bioImageWrapper) return

    // Intersection Observer für is-visible Klasse
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: [0.1, 0.5, 0.8]
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.intersectionRatio >= 0.1) {
            section.classList.add('is-visible')
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    observer.observe(section)
  
    
    // Bio Image Animation - VERBESSERT
    const bioImage = section.querySelector('.bio-image') as HTMLElement
    if (bioImage) {
      gsap.set(bioImage, { opacity: 0, scale: 0.95, y: 30 })
      
      gsap.to(bioImage, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bioImage,
          start: "top 95%",
          toggleActions: "play none none reverse"
        }
      })
    }

    // Bio Paragraphs Animation - VERBESSERT
    const bioParagraphs = section.querySelectorAll('.bio-paragraph')
    bioParagraphs.forEach((paragraph, index) => {
      const el = paragraph as HTMLElement
      gsap.set(el, { opacity: 0, y: 15 })
      
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1.0,
        delay: index * 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 95%",
          toggleActions: "play none none reverse"
        }
      })
    })

    // Parallax für Profilbild
    let parallaxAnimationId: number | null = null
    const parallaxIntensityImage = 10
    const liftAmountImage = 10
    const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    const handleMouseMove = (e: Event) => {
      if (isTouchDevice) return;
      const mouseEvent = e as MouseEvent;
      if (!section.classList.contains('is-visible')) return
      
      if (parallaxAnimationId) return
      parallaxAnimationId = requestAnimationFrame(() => {
        const rect = bioImageWrapper.getBoundingClientRect()
        const mouseXpercent = ((mouseEvent.clientX - rect.left - rect.width / 2) / (rect.width / 2))
        const mouseYpercent = ((mouseEvent.clientY - rect.top - rect.height / 2) / (rect.height / 2))
        const rotateY = mouseXpercent * parallaxIntensityImage
        const rotateX = -mouseYpercent * parallaxIntensityImage * 0.6
        bioImageWrapper.style.transition = 'transform 0.05s linear'
        bioImageWrapper.style.transform = `rotateX(${rotateX - 8}deg) rotateY(${rotateY}deg) translateZ(${liftAmountImage}px)`
        parallaxAnimationId = null
      })
    }

    const handleMouseLeave = () => {
      if (isTouchDevice) return;
      if (parallaxAnimationId) {
        cancelAnimationFrame(parallaxAnimationId)
        parallaxAnimationId = null
      }
      bioImageWrapper.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      bioImageWrapper.style.transform = 'rotateX(-8deg) rotateY(0deg) translateZ(0px)'
    }

    if (bioImageWrapper && !isTouchDevice) {
      bioImageWrapper.addEventListener('mousemove', handleMouseMove)
      bioImageWrapper.addEventListener('mouseleave', handleMouseLeave)
    }

    // Cleanup
    return () => {
      observer.disconnect()
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      if (bioImageWrapper && !isTouchDevice) {
        bioImageWrapper.removeEventListener('mousemove', handleMouseMove)
        bioImageWrapper.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <section 
      ref={sectionRef}
      id="about-me" 
      className="page-section"
      style={{
        background: 'transparent',
        position: 'relative'
      }}
    >
            
      <div className="section-header">
        <h2 className="section-title">
          <span className="title-line">The</span>
          <span className="title-line">journey</span>
        </h2>
        <div className="title-underline"></div>
      </div>
      
      <div className="bio-content">
        <div 
          ref={bioImageWrapperRef}
          className="bio-image-wrapper"
          style={{ 
            perspective: '800px',
            position: 'relative',
            width: '100%',
            maxWidth: '320px',
            margin: '0 auto',
            willChange: 'transform'
          }}
        >
          <div 
            className="bio-image"
            style={{
              position: 'relative',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.08)',
              opacity: 0,
              transform: 'translateY(50px) rotateX(10deg) scale(0.95)',
              willChange: 'transform, opacity'
            }}
          >
            <Image
              src="/assets/images/Profilbild1.jpg"
              alt="Foto von DJ ARADO"
              width={320}
              height={400}
              className="bio-image-img"
              priority
              style={{ 
                width: '100%', 
                height: 'auto', 
                display: 'block',
                transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                willChange: 'transform'
              }}
            />
            <div 
              className="image-overlay"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(64, 224, 208, 0.05) 0%, transparent 35%, transparent 65%, rgba(255, 71, 87, 0.05) 100%)',
                opacity: 0.5,
                transition: 'opacity 0.4s ease',
                willChange: 'opacity'
              }}
            ></div>
          </div>
        </div>
        
        <div 
           
          style={{ color: '#FFFFFF' }} 
        >
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