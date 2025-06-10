'use client'

import { useState, useEffect, useRef, useCallback, KeyboardEvent as ReactKeyboardEvent } from 'react'; // useCallback importiert
import Image from 'next/image';

interface GalleryImage {
  src: string;
  alt: string;
  size: 'small' | 'medium' | 'large';
  width: number;
  height: number;
  objectPosition?: string;
}

export default function GallerySection() {
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  const modalCloseButtonRef = useRef<HTMLButtonElement>(null);

  const images: GalleryImage[] = [ // Deine Bilderliste bleibt hier
    { src: "/assets/images/image8.jpg", alt: "ARADO Profile", size: 'large', width: 800, height: 1200, objectPosition: 'center 20%' },
    { src: "/assets/images/image6.jpg", alt: "Studio Session", size: 'small', width: 1920, height: 1080, objectPosition: 'center top' },
    { src: "/assets/images/image9.jpg", alt: "Festival Crowd", size: 'medium', width: 1080, height: 1920, objectPosition: 'center center' },
    { src: "/assets/images/image2.jpg", alt: "DJ Setup", size: 'small', width: 1600, height: 900 },
    { src: "/assets/images/image5.jpg", alt: "Backstage", size: 'large', width: 1200, height: 800, objectPosition: 'center 30%' },
    { src: "/assets/images/image7.jpg", alt: "Live Performance", size: 'medium', width: 1920, height: 1280 },
    { src: "/assets/images/image4.jpg", alt: "Pacha Event", size: 'small', width: 900, height: 1600 },
  ];

  const selectedImageObject = selectedImageSrc ? images.find(img => img.src === selectedImageSrc) : null;

  const getImageSizesForNextImage = (size: GalleryImage['size']): string => {
    switch (size) {
      case 'small': return "(min-width: 1024px) 16vw, (min-width: 768px) 24vw, 90vw";
      case 'medium': return "(min-width: 1024px) 32vw, (min-width: 768px) 48vw, 90vw";
      case 'large': return "(min-width: 1024px) 48vw, (min-width: 768px) 98vw, 90vw";
      default: return "90vw";
    }
  };

  // openModal mit useCallback memoisiert
  const openModal = useCallback((imageSrc: string, eventTarget: HTMLElement) => {
    lastFocusedElementRef.current = eventTarget;
    setSelectedImageSrc(imageSrc);
  }, []); // Leeres Dependency Array, da setSelectedImageSrc und Ref-Zuweisung stabil sind

  // closeModal mit useCallback memoisiert
  const closeModal = useCallback(() => {
    setSelectedImageSrc(null);
    // Optional: Kleine Verzögerung für zuverlässigeren Fokus-Return
    // setTimeout(() => {
    //   lastFocusedElementRef.current?.focus();
    // }, 0);
    lastFocusedElementRef.current?.focus(); // Direkter Versuch zuerst
  }, []); // Leeres Dependency Array

  // useEffect für Escape-Taste und Fokusmanagement
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => { // Globales KeyboardEvent
      // console.log('Keydown event detected:', event.key); // DEBUG
      if (event.key === 'Escape') {
        // console.log('Escape key pressed - attempting to close modal.'); // DEBUG
        closeModal();
      }
    };

    if (selectedImageSrc) {
      // console.log('Modal opened - Adding ESC key listener.'); // DEBUG
      document.addEventListener('keydown', handleEscKey);
      modalCloseButtonRef.current?.focus();
    }
    // Der 'else'-Block zum Entfernen des Listeners wurde entfernt.
    // Die Cleanup-Funktion ist dafür zuständig.

    return () => {
      // console.log('Effect cleanup - Removing ESC key listener.'); // DEBUG
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [selectedImageSrc, closeModal]); // closeModal wurde zur Dependency-Liste hinzugefügt

  const handleGalleryItemKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>, imageSrc: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal(imageSrc, event.currentTarget);
    }
  };

  // Das JSX bleibt dasselbe wie in deiner letzten Version
  return (
    <>
      <section
        id="gallery"
        className="page-section section-is-white new-style-section"
        style={{
          background: '#000000',
          position: 'relative'
        }}
      >
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-line">Visual</span>
            <span className="title-line">Echos</span>
          </h2>
          <div className="title-underline"></div>
        </div>
        <div className="gallery-container">
          <div className="gallery-grid">
            {images.map((image, index) => (
              <div
                key={image.src}
                className={`gallery-item gallery-item--${image.size}`}
                onClick={(e) => openModal(image.src, e.currentTarget)}
                onKeyDown={(e) => handleGalleryItemKeyDown(e, image.src)}
                role="button"
                tabIndex={0}
                aria-label={`Öffne Bild: ${image.alt}`}
              >
                <div className="gallery-image">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={getImageSizesForNextImage(image.size)}
                    style={{
                      objectFit: 'cover',
                      objectPosition: image.objectPosition || 'center',
                    }}
                    className="gallery-img"
                    priority={index < 3}
                  />
                  <div className="gallery-overlay">
                    <div className="zoom-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} focusable="false" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                  <div className="gallery-info">
                    <h3>{image.alt}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedImageSrc && selectedImageObject && (
        <div
          className="gallery-modal"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={`Vergrößerte Ansicht von ${selectedImageObject.alt}`}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImageObject.src}
              alt={selectedImageObject.alt}
              fill
              className="modal-image"
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 70vw"
            />
            <button
              ref={modalCloseButtonRef}
              aria-label="Schließen"
              onClick={closeModal}
              className="modal-close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} focusable="false" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}