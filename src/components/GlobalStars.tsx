// src/components/GlobalStars.tsx
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function GlobalStars({ count = 5 }) { // Die Anzahl der Sterne kannst du bei Bedarf anpassen
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
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Startposition: Zufällig von außerhalb des oberen oder rechten Randes
        // Sie sollen von oben rechts kommen, also:
        // x: von einem beliebigen Punkt im sichtbaren Bereich (oder leicht rechts davon) bis doppelte Breite
        // y: von einem beliebigen Punkt im sichtbaren Bereich (oder leicht oberhalb davon) bis zur doppelten Höhe
        const startX = (Math.random() * 2 - 0.5) * viewportWidth; // Startet zwischen -0.5*Width und 1.5*Width (deckt den gesamten horizontalen Bereich oben/rechts ab)
        const startY = (Math.random() * 2 - 0.5) * viewportHeight; // Startet zwischen -0.5*Height und 1.5*Height (deckt den gesamten vertikalen Bereich oben/rechts ab)

        // Endposition: Nach unten links bewegen, also:
        // x: deutlich in den negativen Bereich (links außerhalb des Bildschirms)
        // y: deutlich über den sichtbaren Bereich hinaus (unten außerhalb des Bildschirms)
        const endX = startX - (Math.random() * 0.5 + 1) * viewportWidth; // Geht nach links, mindestens eine Bildschirmbreite weit
        const endY = startY + (Math.random() * 0.5 + 1) * viewportHeight; // Geht nach unten, mindestens eine Bildschirmhöhe weit


        const duration = 4 + Math.random() * 4; // Dauer der Animation (4s bis 8s), damit sie langsamer sind
        const initialDelay = Math.random() * 15; // Verzögerung (0s bis 15s), damit sie seltener starten

        // Berechne die Rotation, damit der Stern in Bewegungsrichtung zeigt
        const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

        gsap.set(star, {
          x: startX,
          y: startY,
          opacity: 0,
          rotation: angle, // Setze die Rotation basierend auf der Bewegungsrichtung
          scale: 0.5, // Beibehalten der ursprünglichen Skalierung
          filter: 'blur(1px)'
        });

        const tween = gsap.to(star, {
          x: endX,
          y: endY,
          opacity: 0.3,
          duration: duration,
          ease: 'none', // Beibehalten der ursprünglichen Ease-Funktion
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