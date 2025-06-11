// src/components/GlobalStars.tsx
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function GlobalStars({ count = 5 }) { // <--- Reduziere die Standardanzahl drastisch, z.B. auf 5
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    if (!container) return;

    const activeTweens: gsap.core.Tween[] = [];

    const createShootingStar = (starContainer: HTMLDivElement) => {
      const star = document.createElement('div');
      star.classList.add('shooting-star');

      star.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 0; /* Bleibt bei 0 */
        opacity: 0;
        filter: blur(1px);
      `;

      starContainer.appendChild(star);

      const setupStarAnimation = () => {
        const startX = window.innerWidth * (1 + Math.random() * 0.5);
        const startY = window.innerHeight * (-0.5 - Math.random() * 0.5);
        const endX = window.innerWidth * (-0.5 - Math.random() * 0.5);
        const endY = window.innerHeight * (1 + Math.random() * 0.5);
        const duration = 4 + Math.random() * 4; // <--- Erhöhe die Dauer (4s bis 8s), damit sie langsamer sind
        const initialDelay = Math.random() * 15; // <--- Erhöhe die Verzögerung (0s bis 15s), damit sie seltener starten

        gsap.set(star, {
          x: startX,
          y: startY,
          opacity: 0,
          rotation: -45,
          scale: 0.5,
          filter: 'blur(1px)'
        });

        const tween = gsap.to(star, {
          x: endX,
          y: endY,
          opacity: 0.3,
          duration: duration,
          ease: 'none',
          delay: initialDelay,
          onComplete: () => {
            gsap.to(star, {
              opacity: 0,
              duration: 0.5,
              onComplete: setupStarAnimation
            });
          }
        });
        activeTweens.push(tween);
      };

      setupStarAnimation();
      
      return () => {
        if (star.parentNode) {
          star.parentNode.removeChild(star);
        }
        gsap.killTweensOf(star);
      };
    };

    const cleanups: (() => void)[] = [];
    for (let i = 0; i < count; i++) {
      cleanups.push(createShootingStar(container));
    }

    return () => {
      cleanups.forEach(cleanup => cleanup());
      activeTweens.forEach(tween => tween.kill());
      gsap.globalTimeline.clear();
    };
  }, [count]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0, /* Bleibt bei 0 */
      }}
    ></div>
  );
}