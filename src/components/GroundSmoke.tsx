'use client'

import React, { useState, useEffect } from 'react'

export default function GroundSmoke() {
  const [isMounted, setIsMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setIsMounted(true)
    
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isMounted) return null

  // Calculate opacity based on scroll
  const scrollProgress = Math.min(scrollY / (window.innerHeight * 0.3), 1)
  const smokeOpacity = 1 - scrollProgress

  return (
    <>
      <div
        className="absolute bottom-0 left-0 w-full h-80 overflow-hidden pointer-events-none"
        style={{
          opacity: smokeOpacity,
          zIndex: 2
        }}
      >
        {/* Realistic smoke texture using CSS */}
        <div className="smoke-container">
          {Array.from({ length: 25 }, (_, i) => (
            <div 
              key={i} 
              className="smoke-particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 12}s`,
                '--random-x': Math.random() * 200 - 100,
                '--random-y': Math.random() * 100 + 50,
                '--random-scale': 0.5 + Math.random() * 1.5,
                '--random-rotate': Math.random() * 360
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* Dense ground fog */}
        <div className="fog-base" />
        <div className="fog-layer-dense" />
        
        {/* Entrance effect */}
        <div className="smoke-entrance">
          {Array.from({ length: 12 }, (_, i) => (
            <div 
              key={i} 
              className="entrance-puff"
              style={{
                left: `${5 + i * 8}%`,
                animationDelay: `${0.2 + i * 0.15}s`
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .smoke-container {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 100%;
        }

        .smoke-particle {
          position: absolute;
          bottom: -20px;
          width: 80px;
          height: 80px;
          background: 
            radial-gradient(circle at 30% 40%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 30%, transparent 70%),
            radial-gradient(circle at 70% 60%, rgba(240,248,255,0.6) 0%, rgba(240,248,255,0.2) 40%, transparent 80%),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 60%);
          border-radius: 50% 40% 60% 45%;
          filter: blur(2px);
          mix-blend-mode: screen;
          animation: smokeRise infinite ease-out;
          transform-origin: center bottom;
        }

        .fog-base {
          position: absolute;
          bottom: 0;
          width: 120%;
          height: 60px;
          left: -10%;
          background: 
            linear-gradient(to top, 
              rgba(255,255,255,0.4) 0%, 
              rgba(250,252,255,0.25) 40%, 
              rgba(245,250,255,0.1) 70%,
              transparent 100%);
          filter: blur(3px);
          mix-blend-mode: screen;
          animation: fogDrift 20s ease-in-out infinite;
        }

        .fog-layer-dense {
          position: absolute;
          bottom: 0;
          width: 110%;
          height: 40px;
          left: -5%;
          background: 
            linear-gradient(to top, 
              rgba(255,255,255,0.6) 0%, 
              rgba(248,252,255,0.3) 50%, 
              transparent 100%);
          filter: blur(1px);
          mix-blend-mode: screen;
          animation: fogDrift 15s ease-in-out infinite reverse;
        }

        .smoke-entrance {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 100%;
        }

        .entrance-puff {
          position: absolute;
          bottom: 0;
          width: 60px;
          height: 60px;
          background: 
            radial-gradient(circle, 
              rgba(255,255,255,0.9) 0%, 
              rgba(248,252,255,0.6) 30%, 
              rgba(240,248,255,0.3) 60%,
              transparent 90%);
          border-radius: 50% 45% 55% 40%;
          filter: blur(1px);
          mix-blend-mode: screen;
          animation: entrancePuff 3s ease-out forwards;
        }

        @keyframes smokeRise {
          0% {
            transform: 
              translateY(0) 
              translateX(0) 
              scale(var(--random-scale, 1)) 
              rotate(0deg);
            opacity: 0;
            border-radius: 50% 40% 60% 45%;
          }
          10% {
            opacity: 0.8;
            border-radius: 45% 55% 50% 60%;
          }
          25% {
            transform: 
              translateY(-50px) 
              translateX(calc(var(--random-x, 0) * 0.3px)) 
              scale(calc(var(--random-scale, 1) * 1.2)) 
              rotate(calc(var(--random-rotate, 0) * 0.2deg));
            opacity: 0.9;
            border-radius: 55% 45% 65% 35%;
          }
          50% {
            transform: 
              translateY(-120px) 
              translateX(calc(var(--random-x, 0) * 0.6px)) 
              scale(calc(var(--random-scale, 1) * 1.6)) 
              rotate(calc(var(--random-rotate, 0) * 0.5deg));
            opacity: 0.6;
            border-radius: 40% 60% 45% 55%;
          }
          75% {
            transform: 
              translateY(-200px) 
              translateX(calc(var(--random-x, 0) * 0.8px)) 
              scale(calc(var(--random-scale, 1) * 2.1)) 
              rotate(calc(var(--random-rotate, 0) * 0.8deg));
            opacity: 0.3;
            border-radius: 60% 40% 55% 45%;
          }
          100% {
            transform: 
              translateY(calc(var(--random-y, 250) * -1px)) 
              translateX(calc(var(--random-x, 0) * 1px)) 
              scale(calc(var(--random-scale, 1) * 2.8)) 
              rotate(calc(var(--random-rotate, 0) * 1deg));
            opacity: 0;
            border-radius: 45% 55% 40% 60%;
          }
        }

        @keyframes fogDrift {
          0%, 100% {
            transform: translateX(0%) scaleX(1);
            opacity: 0.8;
          }
          25% {
            transform: translateX(-3%) scaleX(1.1);
            opacity: 1;
          }
          50% {
            transform: translateX(2%) scaleX(1.2);
            opacity: 0.9;
          }
          75% {
            transform: translateX(-1%) scaleX(1.15);
            opacity: 1;
          }
        }

        @keyframes entrancePuff {
          0% {
            transform: translateY(0) scale(0.3);
            opacity: 0;
            border-radius: 50%;
          }
          15% {
            transform: translateY(-15px) scale(0.8);
            opacity: 1;
            border-radius: 45% 55% 50% 60%;
          }
          30% {
            transform: translateY(-35px) scale(1.2);
            opacity: 0.9;
            border-radius: 55% 45% 65% 35%;
          }
          60% {
            transform: translateY(-80px) scale(1.8);
            opacity: 0.5;
            border-radius: 40% 60% 45% 55%;
          }
          100% {
            transform: translateY(-150px) scale(2.5);
            opacity: 0;
            border-radius: 60% 40% 55% 45%;
          }
        }

        /* Add noise texture for more realism */
        .smoke-particle::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 20% 30%, transparent 30%, rgba(255,255,255,0.1) 35%, transparent 40%),
            radial-gradient(circle at 80% 70%, transparent 25%, rgba(255,255,255,0.15) 30%, transparent 35%),
            radial-gradient(circle at 60% 20%, transparent 35%, rgba(255,255,255,0.08) 40%, transparent 45%);
          border-radius: inherit;
          mix-blend-mode: overlay;
        }
      `}</style>
    </>
  )
}