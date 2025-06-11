// src/components/GlobalStars.tsx
'use client'; // Wichtig, da DOM-Manipulation und useEffect verwendet werden

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function GlobalStars({ count = 100 }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    if (!container) return;

    const createShootingStar = () => {
      const star = document.createElement('div');
      star.classList.add('shooting-star'); // Nutze deine bestehende CSS-Klasse

      const startX = window.innerWidth * (1 + Math.random() * 0.5); // Startet weit rechts außerhalb
      const startY = window.innerHeight * (-0.5 - Math.random() * 0.5); // Startet weit oben außerhalb
      
      const endX = window.innerWidth * (-0.5 - Math.random() * 0.5); // Endet weit links außerhalb
      const endY = window.innerHeight * (1 + Math.random() * 0.5); // Endet weit unten außerhalb

      const duration = 2 + Math.random() * 4; // Dauer zwischen 2s und 6s
      const delay = Math.random() * 10; // Verzögerung zwischen 0s und 10s

      star.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        transform: translate(${startX}px, ${startY}px) rotate(-45deg) scale(0.5);
        opacity: 0;
        filter: blur(1px);
        pointer-events: none;
        z-index: -1; /* Oder z-index: 0 oder 1, je nachdem wie du es positionieren möchtest */
      `;
      // Hier die animation Eigenschaft direkt hinzufügen,
      // wenn du die CSS-Keyframe-Animation nutzen möchtest,
      // statt der GSAP-to() Methode für die Hauptbewegung.
      // Wenn du GSAP nutzt, dann ist die 'animation' CSS Eigenschaft nicht nötig.
      // Ich gehe davon aus, du willst die GSAP-Animation nutzen, daher die CSS-Animation hier entfernt.

      container.appendChild(star);

      // Hier die GSAP-Animation für den Stern, die sich wiederholen soll
      const animation = gsap.to(star, {
        x: endX,
        y: endY,
        opacity: 0.3,
        filter: 'blur(1px)',
        duration: duration,
        delay: delay,
        ease: 'none',
        repeat: -1,
        onRepeat: function() {
          gsap.set(star, { 
            x: window.innerWidth * (1 + Math.random() * 0.5), 
            y: window.innerHeight * (-0.5 - Math.random() * 0.5), 
            opacity: 0 
          });
          gsap.to(star, { opacity: 0.3, duration: 0.5 });
        }
      });

      return () => {
        if (star.parentNode) {
          star.parentNode.removeChild(star);
        }
        // WICHTIG: Die spezifische GSAP-Tween für diesen Stern killen
        animation.kill(); // Die Variable 'animation' hält die Referenz zur Tween
      };
    };

    // Erstelle mehrere Sternschnuppen
    // Korrektur des Typs: speichere direkt die Cleanup-Funktionen
    const stars: (() => void)[] = []; // <-- Korrektur des Typs hier!
    for (let i = 0; i < count; i++) {
      stars.push(createShootingStar());
    }

    // Cleanup-Funktion für den gesamten useEffect
    return () => {
      stars.forEach(cleanup => cleanup());
      // gsapi.globalTimeline.clear(); // Dies würde alle GSAP-Animationen auf der Seite beenden.
                                   // Wenn du nur die für die Sterne erstellten Animationen beenden möchtest,
                                   // reicht das 'animation.kill()' in der individuellen Cleanup-Funktion.
                                   // Wenn du sicherstellen möchtest, dass nichts übrig bleibt, kannst du es lassen,
                                   // aber sei dir der Auswirkungen auf andere GSAP-Animationen bewusst.
    };
  }, [count]);

  return <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', pointerEvents: 'none', zIndex: -1 }}></div>;
}