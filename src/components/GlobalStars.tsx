// src/components/GlobalStars.tsx
'use client';

import { useEffect, useRef, useCallback, memo } from 'react';
import { gsap } from 'gsap';

interface GlobalStarsProps {
  count?: number;
}

const GlobalStars = memo(({ count = 5 }: GlobalStarsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const createShootingStar = useCallback((starContainer: HTMLDivElement) => {
    const activeTweens: gsap.core.Tween[] = []; // Move activeTweens inside the function
    
    const star = document.createElement('div');
    star.classList.add('shooting-star');

    star.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 0;
      opacity: 0;
      filter: blur(1px);
      will-change: transform, opacity;
    `;

    starContainer.appendChild(star);

    const setupStarAnimation = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const startX = (Math.random() * 2 - 0.5) * viewportWidth;
      const startY = (Math.random() * 2 - 0.5) * viewportHeight;
      const endX = startX - (Math.random() * 0.5 + 1) * viewportWidth;
      const endY = startY + (Math.random() * 0.5 + 1) * viewportHeight;

      const duration = 6 + Math.random() * 4;
      const initialDelay = Math.random() * 20;

      const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);

      gsap.set(star, {
        x: startX,
        y: startY,
        opacity: 0,
        rotation: angle,
        scale: 0.5,
        filter: 'blur(1px)'
      });

      const tween = gsap.to(star, {
        x: endX,
        y: endY,
        opacity: 0.2,
        duration: duration,
        ease: 'none',
        delay: initialDelay,
        onComplete: () => {
          gsap.to(star, {
            opacity: 0,
            duration: 1,
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
      activeTweens.forEach(tween => tween.kill());
      gsap.killTweensOf(star);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    if (!container) return;

    const cleanups: (() => void)[] = [];
    
    for (let i = 0; i < count; i++) {
      cleanups.push(createShootingStar(container));
    }

    return () => {
      cleanups.forEach(cleanup => cleanup());
      gsap.globalTimeline.clear();
    };
  }, [count, createShootingStar]);

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
        zIndex: 0,
      }}
    ></div>
  );
});

GlobalStars.displayName = 'GlobalStars';

export default GlobalStars;
