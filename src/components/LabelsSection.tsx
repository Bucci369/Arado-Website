// src/app/components/LabelsSection.tsx
'use client'

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LabelsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  const labels = [
    "Desolat", "Moon Harbour", "Remote Area", "All Inn Records",
    "Dame Music", "Saved Records", "Viva Music", "Snatch! Records"
  ];

  useEffect(() => {
    const sectionElement = sectionRef.current;
    const listContainer = listContainerRef.current;
    const listItems = listContainer?.querySelectorAll('.zoom-list-item');

    if (sectionElement && listItems && listItems.length > 0) {
      let hasAnimated = false;

      const triggerAnimation = () => {
        if (hasAnimated) return;
        hasAnimated = true;

        // Smooth Animation: Items starten normal, dann smooth fade-in mit leichtem Slide-up
        gsap.fromTo(listItems, 
          { 
            opacity: 1, // Start normal sichtbar
            y: 20,      // Nur leichter Slide-up Effekt
            // Kein scale oder blur!
          }, 
          { 
            opacity: 1,  // Bleibt sichtbar
            y: 0,        // Slide to position
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.1,
          }
        );
      };

      // ScrollTrigger für smooth Animation
      ScrollTrigger.create({
        trigger: listContainer,
        start: 'top 85%',
        end: 'bottom 15%',
        once: true,
        onEnter: () => {
          triggerAnimation();
        }
      });

      // Fallback IntersectionObserver
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              triggerAnimation();
            }
          });
        },
        { 
          threshold: [0.3, 0.5, 0.7],
          rootMargin: '10% 0px 10% 0px'
        }
      );

      if (listContainer) {
        observer.observe(listContainer);
      }

      return () => {
        observer.disconnect();
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger === listContainer) {
            trigger.kill();
          }
        });
      };
    }
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="labels" 
      className="page-section section-is-white min-h-screen py-20 px-8 flex flex-col items-center justify-center text-white"
      style={{ background: 'transparent', position: 'relative' }}
    >
      <div className="section-header mb-16">
        <h2 className="section-title text-4xl md:text-5xl lg:text-6xl font-extrabold text-white uppercase tracking-wide text-center mb-4">
          <span className="title-line block">Sonic</span>
          <span className="title-line block">Alliances</span>
        </h2>
        <div className="title-underline w-12 h-1 bg-gradient-to-r from-cyan-300 to-cyan-500 mx-auto"></div>
      </div>
      
      <div ref={listContainerRef} className="zoom-list-container max-w-3xl w-full text-center">
        <ul className="zoom-list list-none p-0 m-0">
          {labels.map((label, index) => (
            <li 
              key={index}
              className="zoom-list-item text-2xl md:text-3xl lg:text-4xl font-semibold text-white py-4 mb-2 will-change-transform cursor-pointer hover:text-cyan-300 transition-colors duration-300"
            >
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}