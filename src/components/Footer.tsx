'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    if (!footerRef.current) return

    const ctx = gsap.context(() => {
      // Animate footer elements on scroll
      gsap.from('.footer-content > *', {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 95%',
          toggleActions: 'play none none reverse'
        }
      })

      // Pulse animation for orbs
      gsap.to('.footer-orb', {
        scale: 1.2,
        opacity: 0.6,
        duration: 'random(3, 5)',
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        stagger: {
          each: 0.5,
          from: 'random'
        }
      })

      // Wave animation
      gsap.to('.wave-line', {
        attr: { d: 'M0,20 Q150,5 300,20 T600,20 L600,0 L0,0 Z' },
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }, footerRef)

    return () => ctx.revert()
  }, [])

  
  return (
    <footer ref={footerRef} className="cosmic-footer">
      {/* Animated Wave Top Border */}
      <div className="footer-wave">
        <svg viewBox="0 0 600 40" preserveAspectRatio="none">
          <path 
            className="wave-line"
            d="M0,20 Q150,10 300,20 T600,20 L600,0 L0,0 Z" 
            fill="url(#waveGradient)"
          />
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(147, 51, 234, 0.3)" />
              <stop offset="50%" stopColor="rgba(59, 130, 246, 0.3)" />
              <stop offset="100%" stopColor="rgba(236, 72, 153, 0.3)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Background Effects */}
      <div className="footer-bg-effects">
        <div className="footer-orb footer-orb-1" />
        <div className="footer-orb footer-orb-2" />
        <div className="footer-orb footer-orb-3" />
      </div>

      <div className="footer-content">
        {/* Logo/Brand */}
        <div className="footer-brand">
          <h3 className="footer-logo">ARADO</h3>
          <p className="footer-tagline">Deep & Tech House Artist</p>
        </div>

                
        {/* Copyright */}
        <div className="footer-copyright">
          <p>© {currentYear} DJ ARADO</p>
          <p className="footer-location">Berlin, Germany</p>
        </div>
      </div>

      <style jsx>{`
        .cosmic-footer {
          position: relative;
          background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.8) 50%, #000 100%);
          padding: 4rem 2rem 2rem;
          overflow: hidden;
          margin-top: 5rem;
        }

        .footer-wave {
          position: absolute;
          top: -39px;
          left: 0;
          width: 100%;
          height: 40px;
          overflow: hidden;
        }

        .footer-wave svg {
          width: 100%;
          height: 100%;
        }

        .footer-bg-effects {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .footer-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
        }

        .footer-orb-1 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(147, 51, 234, 0.6) 0%, transparent 70%);
          top: -150px;
          left: -150px;
        }

        .footer-orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%);
          top: -200px;
          right: -200px;
        }

        .footer-orb-3 {
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, transparent 70%);
          bottom: -125px;
          left: 50%;
          transform: translateX(-50%);
        }

        .footer-content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.5rem;
          text-align: center;
        }

        .footer-brand {
          margin-bottom: 1rem;
        }

        .footer-logo {
          font-family: 'Orbitron', sans-serif;
          font-size: 3rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 0.5rem;
          background: linear-gradient(45deg, #ff4757, #40e0d0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 20px rgba(64, 224, 208, 0.5));
        }

        .footer-tagline {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .footer-social {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
        }

        .footer-social-link {
          position: relative;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          overflow: hidden;
        }

        .footer-social-link::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          transition: width 0.3s ease, height 0.3s ease;
        }

        .footer-social-link:hover::before {
          width: 100%;
          height: 100%;
        }

        .footer-social-link:hover {
          transform: translateY(-5px) scale(1.1);
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .social-icon {
          position: relative;
          z-index: 2;
          transition: transform 0.3s ease;
        }

        .footer-social-link:hover .social-icon {
          transform: scale(1.2);
        }

        .social-icon svg {
          width: 24px;
          height: 24px;
          /* Füllfarbe des SVG-Inhalts (Pfade) auf weiß setzen */
          fill: white; 
          /* Der Rand (Stroke) des Kreises wird durch die CSS-Variable gesetzt */
          stroke: var(--social-color); 
          transition: fill 0.3s ease, stroke 0.3s ease;
        }

        .footer-social-link:hover .social-icon svg {
          /* Beim Hover kann der Stroke des Kreises intensiviert oder geändert werden */
          stroke: white; /* Oder eine andere Farbe, die zum Hover-Effekt passt */
          filter: drop-shadow(0 0 8px var(--social-color)); /* Leuchten beim Hover */
        }

        .social-tooltip {
          position: absolute;
          bottom: -35px;
          left: 50%;
          transform: translateX(-50%) scale(0);
          background: rgba(0, 0, 0, 0.9);
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 0.8rem;
          white-space: nowrap;
          opacity: 0;
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .footer-social-link:hover .social-tooltip {
          transform: translateX(-50%) scale(1);
          opacity: 1;
        }
        
        .footer-nav {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          font-family: 'Inter', sans-serif;
        }

        .footer-link {
          position: relative;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          transition: color 0.3s ease;
          overflow: hidden;
        }

        .footer-link span {
          position: relative;
          z-index: 2;
        }

        .footer-link::before {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #ff4757, #40e0d0);
          transition: width 0.3s ease;
        }

        .footer-link:hover {
          color: white;
        }

        .footer-link:hover::before {
          width: 100%;
        }

        .footer-separator {
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.8rem;
        }

        .footer-copyright {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.6;
        }

        .footer-location {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.4);
        }

        @media (max-width: 768px) {
          .cosmic-footer {
            padding: 3rem 1.5rem 1.5rem;
          }

          .footer-logo {
            font-size: 2rem;
          }

          
          .footer-nav {
            flex-direction: column;
            gap: 1rem;
          }

          .footer-separator {
            display: none;
          }
        }
      `}</style>
    </footer>
  )
}