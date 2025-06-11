// src/components/GlobalStars.tsx
'use client'; // Wichtig, da DOM-Manipulation und useEffect verwendet werden

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function GlobalStars({ count = 10 }) { // Count ist jetzt 10, gut zum Testen
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const container = containerRef.current; // Hier wird 'container' aus containerRef.current zugewiesen
    if (!container) return;

    // Speichert alle GSAP Tweens, damit sie im Cleanup ordentlich getötet werden können
    const activeTweens: gsap.core.Tween[] = [];

    // 'container' als Argument an createShootingStar übergeben
    const createShootingStar = (starContainer: HTMLDivElement) => { // <-- Argument hinzugefügt
      const star = document.createElement('div');
      star.classList.add('shooting-star');

      const startX = window.innerWidth * (1 + Math.random() * 0.5);
      const startY = window.innerHeight * (-0.5 - Math.random() * 0.5);
      
      const endX = window.innerWidth * (-0.5 - Math.random() * 0.5);
      const endY = window.innerHeight * (1 + Math.random() * 0.5);

      const duration = 2 + Math.random() * 4;
      const delay = Math.random() * 10;

      star.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        transform: translate(${startX}px, ${startY}px) rotate(-45deg) scale(0.5);
        opacity: 0;
        filter: blur(1px);
        pointer-events: none;
        z-index: 0; /* z-index auf 0 setzen, um vor body::before/after zu liegen */
      `;

      starContainer.appendChild(star); // <-- HIER: starContainer verwenden

      // Hier die GSAP-Animation für den Stern, die sich wiederholen soll
      // DIESER BEREICH IST KRITISCH FÜR DIE PERFORMANCE (siehe Punkt 2)
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
      activeTweens.push(animation); // Den erstellten Tween zum Array hinzufügen

      return () => {
        if (star.parentNode) {
          star.parentNode.removeChild(star);
        }
        animation.kill();
      };
    };

    const stars: (() => void)[] = [];
    for (let i = 0; i < count; i++) {
      stars.push(createShootingStar(container)); // <-- HIER: 'container' als Argument übergeben
    }

    return () => {
      stars.forEach(cleanup => cleanup());
      activeTweens.forEach(tween => tween.kill()); // Alle gesammelten tweens killen
      gsap.globalTimeline.clear(); // Nur wenn du alle anderen GSAP-Animationen auf der Seite beenden willst
    };
  }, [count]); // Abhängigkeit von count belassen

  return <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}></div>; /* <-- Hier z-index 0 */
}