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
    const listItems = listContainerRef.current?.querySelectorAll('.zoom-list-item');

    if (sectionElement && listItems && listItems.length > 0) {
      gsap.fromTo(listItems, 
        { // Start-Zustand: Unsichtbar und leicht verkleinert
          opacity: 0,
          scale: 0.8
        }, 
        { // End-Zustand: Voll sichtbar und in normaler Größe
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: listContainerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );
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
              className="zoom-list-item text-2xl md:text-3xl lg:text-4xl font-semibold text-white py-4 mb-2 will-change-[opacity,transform] cursor-pointer hover:text-cyan-300 transition-colors duration-300"
            >
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}