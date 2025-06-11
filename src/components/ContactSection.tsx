'use client'

import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  // VORHER: const [ setHoveredCard] = useState<string | null>(null)
  // AKTION: 'hoveredCard' wurde entfernt, da es nicht verwendet wird.
  // Das 'setHoveredCard' wird weiterhin vom Linter als "never used" markiert,
  // wenn es direkt im useState-Array dekonstruiert wird.
  // Da die onMouseEnter/onMouseLeave Events keine state-Änderung auslösen müssen,
  // wenn der Wert nicht verwendet wird, kann der useState-Hook ganz entfernt werden.
  // Wenn du in Zukunft eine Hover-Logik brauchst, füge den useState-Hook wieder hinzu.
  
  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Animate contact cards on scroll
      gsap.from('.contact-card', {
        y: 100,
        opacity: 0,
        // rotationY: -30, <--- Diese Zeile wurde entfernt, um die Neigung zu entfernen
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      })

      // Animate social links
      gsap.from('.social-link', {
        scale: 0,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.social-links',
          start: 'top 85%'
        }
      })

      // Parallax effect for cards on mouse move
      const handleMouseMove = (e: MouseEvent) => {
        const cards = document.querySelectorAll('.contact-card')
        const { clientX, clientY } = e
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        
        cards.forEach((card, index) => {
          // Die Tiefe wurde angepasst, um subtiler zu sein, da die Karten nicht geneigt sind
          const depth = (index + 1) * 0.15 // Reduziert von 0.3 für subtileren Effekt
          const moveX = (clientX - centerX) * depth / 100
          const moveY = (clientY - centerY) * depth / 100
          
          gsap.to(card, {
            x: moveX,
            y: moveY,
            duration: 0.6,
            ease: 'power2.out'
          })
        })
      }
      
      window.addEventListener('mousemove', handleMouseMove)
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const contactMethods = [
    {
      id: 'email',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>
      ),
      title: 'Email',
      value: 'booking@djarado.com',
      link: 'mailto:booking@djarado.com',
      color: 'rgba(147, 51, 234, 0.6)',
      glow: 'rgba(147, 51, 234, 0.3)'
    },
    {
      id: 'phone',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
        </svg>
      ),
      title: 'Phone',
      value: '+49 (0) 123 456 789',
      link: 'tel:+49123456789',
      color: 'rgba(59, 130, 246, 0.6)',
      glow: 'rgba(59, 130, 246, 0.3)'
    },
    {
      id: 'location',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      title: 'Based in',
      value: 'Berlin, Germany',
      link: '#',
      color: 'rgba(236, 72, 153, 0.6)',
      glow: 'rgba(236, 72, 153, 0.3)'
    }
  ]

  const socialLinks = [
    {
      name: 'Spotify',
      url: 'https://open.spotify.com/artist/DEIN_ARTIST_ID',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      ),
      color: '#1DB954'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/DEIN_INSTAGRAM_NAME',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      color: '#E4405F'
    },
    {
      name: 'SoundCloud',
      url: 'https://soundcloud.com/DEIN_SOUNDCLOUD_NAME',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 17.939h-1v-8.068c.308-.231.639-.429 1-.566v8.634zm3 0h1v-9.224c-.229.265-.443.548-.621.857l-.379-.184v8.551zm2 0h1v-8.448c-.277.055-.557.144-.828.251l-.172-.103v8.3zm1 0h1v-7.774c-.172.5-.34 1.018-.49 1.53l-.51-.045v6.289zm2 0h1v-5.154c-.038-.404-.086-.799-.151-1.185l-.849-.07v6.409zm2 0h1v-2.146c-.084-.523-.151-1.035-.207-1.538l-.793-.083v3.767zm2 0h1v-1.279c-.034-.229-.063-.459-.088-.687l-.912-.096v2.062zm3 0h1v-.916c-.022-.119-.042-.238-.063-.357l-.937-.099v1.372zm2 0h1v-.73c-.016-.103-.032-.207-.047-.312l-.953-.1v1.142zm2 0h1v-.571c-.014-.093-.027-.187-.04-.281l-.96-.101v.953zm1 0h1v-.502c-.017-.104-.033-.209-.05-.313l-.95-.1v.915z"/>
        </svg>
      ),
      color: '#FF8800'
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/user/DEIN_YOUTUBE_KANAL',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      color: '#FF0000'
    }
  ]

  return (
    <section 
      ref={sectionRef} 
      id="contact" 
      className="page-section new-style-section"
      style={{
        background: 'transparent',
        position: 'relative',
        minHeight: '100vh'
      }}
    >
      <div className="section-header">
        <h2 className="section-title">
          <span className="title-line">Contact &</span>
          <span className="title-line">Transmissions</span>
        </h2>
        <div className="title-underline"></div>
      </div>

      <div className="section-content-container">
        {/* Contact Cards Grid */}
        <div className="contact-cards-grid">
          {contactMethods.map((method) => (
            <div
              key={method.id}
              className="contact-card"
              // AKTION: onMouseEnter/onMouseLeave Events entfernt, da `setHoveredCard` nicht genutzt wird.
              // onMouseEnter={() => (method.id)}
              // onMouseLeave={() => (null)}
              style={{
                '--card-color': method.color,
                '--card-glow': method.glow
              } as React.CSSProperties}
            >
              <a href={method.link} className="card-link">
                <div className="card-icon">
                  {method.icon}
                </div>
                <h3 className="card-title">{method.title}</h3>
                <p className="card-value">{method.value}</p>
                <div className="card-background" />
                <div className="card-glow" />
              </a>
            </div>
          ))}
        </div>

        {/* Social Links Section */}
        <div className="social-links">
          <h3 className="social-title">Follow My Journey</h3>
          <div className="social-grid">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                style={{ '--social-color': link.color } as React.CSSProperties}
                aria-label={link.name}
              >
                <span className="social-icon">{link.icon}</span>
                <span className="social-glow" />
              </a>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="contact-cta">
          <p className="cta-text">Ready for an unforgettable night?</p>
          <h3 className="cta-title">Let&apos;s create sonic memories together</h3> {/* AKTION: Apostroph escaped */}
        </div>
      </div>

      <style jsx>{`
        .contact-cards-grid {
          display: flex; /* Flexbox für Zentrierung */
          justify-content: center; /* Zentriert die Karten horizontal */
          align-items: flex-start; /* Hält die obere Kante der Karten auf gleicher Höhe */
          flex-wrap: wrap; /* Ermöglicht den Karten, in die nächste Zeile zu springen */
          gap: 2rem; /* Abstand zwischen den Karten */
          margin-bottom: 5rem;
          perspective: 1000px;
          max-width: 1000px; /* Begrenzt die Gesamtbreite der Kartengruppe */
          margin-left: auto; /* Zentriert den gesamten Grid-Container */
          margin-right: auto; /* Zentriert den gesamten Grid-Container */
        }
        
        .contact-card {
          flex-basis: 300px; /* Bevorzugte Breite jeder Karte */
          flex-grow: 1; /* Erlaubt Karten, bei verfügbarem Platz zu wachsen */
          max-width: 350px; /* Maximale Breite für einzelne Karten */
          
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .contact-card:hover {
          transform: translateZ(20px) scale(1.02);
        }

        .card-link {
          display: block;
          position: relative;
          padding: 3rem 2rem;
          text-decoration: none;
          color: white;
          overflow: hidden;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          transition: all 0.4s ease;
        }

        .card-link:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--card-color);
        }

        .card-icon {
          width: 60px;
          height: 60px;
          margin-bottom: 1.5rem;
          color: var(--card-color);
          transition: transform 0.4s ease;
        }

        .contact-card:hover .card-icon {
          transform: scale(1.2) rotate(10deg);
        }

        .card-icon svg {
          width: 100%;
          height: 100%;
        }

        .card-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .card-value {
          font-family: 'Inter', sans-serif;
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.8);
          transition: color 0.3s ease;
        }

        .contact-card:hover .card-value {
          color: white;
        }

        .card-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at center, var(--card-glow) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: -1;
        }

        .contact-card:hover .card-background {
          opacity: 0.3;
        }

        .card-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: var(--card-color);
          filter: blur(20px);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: -2;
          border-radius: 20px;
        }

        .contact-card:hover .card-glow {
          opacity: 0.5;
        }

        .social-links {
          text-align: center;
          margin-bottom: 4rem;
        }

        .social-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 2rem;
          background: linear-gradient(90deg, #40e0d0, #ff4757);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .social-grid {
          display: flex;
          gap: 2rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .social-link {
          position: relative;
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          overflow: hidden;
        }

        .social-link:hover {
          transform: translateY(-8px) scale(1.1);
          background: var(--social-color);
          border-color: var(--social-color);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        }

        .social-icon {
          position: relative;
          z-index: 2;
          transition: transform 0.4s ease;
        }

        .social-link:hover .social-icon {
          transform: scale(1.2) rotate(360deg);
        }

        .social-icon svg {
          width: 30px;
          height: 30px;
          fill: white;
        }

        .social-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          background: var(--social-color);
          filter: blur(30px);
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .social-link:hover .social-glow {
          opacity: 0.6;
        }

        .contact-cta {
          text-align: center;
          margin-top: 4rem;
        }

        .cta-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }

        .cta-title {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          line-height: 1.2;
          background: linear-gradient(45deg, #ff4757, #40e0d0, #ff4757);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 3s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @media (max-width: 768px) {
          .social-grid {
            gap: 1rem;
          }

          .social-link {
            width: 55px;
            height: 55px;
          }

          .social-icon svg {
            width: 24px;
            height: 24px;
          }
          
          .card-icon {
            width: 50px;
            height: 50px;
            margin-bottom: 1rem;
          }
          
          .card-title {
            font-size: 1rem;
          }
          
          .card-value {
            font-size: 0.9rem;
          }
          
          .card-link {
            padding: 2rem 1.5rem;
          }
        }

        /* Alte, redundante Grid-Media-Queries entfernen */
        @media (max-width: 968px) {
          .contact-cards-grid {
            /* flex-basis: calc(50% - 0.75rem); bleibt in .contact-card */
            gap: 1.5rem;
          }
        }
        
        @media (max-width: 640px) {
          .contact-cards-grid {
            /* flex-basis: 100%; bleibt in .contact-card */
            gap: 1.5rem;
            max-width: 400px;
          }
        }
      `}</style>
    </section>
  )
}