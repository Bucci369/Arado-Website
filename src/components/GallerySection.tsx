'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react' // AKTION: useMemo hinzugefügt
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface GalleryImage {
  src: string
  alt: string
  size: 'small' | 'medium' | 'large'
  width: number
  height: number
  objectPosition?: string
}

const LazyGalleryImage = ({ 
  image, 
  index, 
  onClick 
}: { 
  image: GalleryImage
  index: number
  onClick: (src: string) => void 
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (imageRef.current) {
      observer.observe(imageRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        delay: index * 0.05,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      ref={imageRef}
      className={`gallery-item gallery-item--${image.size} cursor-pointer`}
      variants={itemVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(image.src)}
    >
      <div className="gallery-image relative w-full h-full">
        {isInView && (
          <>
            {!isLoaded && (
              <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg" />
            )}
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{
                objectFit: 'cover',
                objectPosition: image.objectPosition || 'center',
              }}
              className={`gallery-img transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsLoaded(true)}
              loading="lazy"
            />
          </>
        )}
        <motion.div 
          className="gallery-overlay"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="zoom-icon"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </motion.div>
        </motion.div>
        <div className="gallery-info">
          <h3>{image.alt}</h3>
        </div>
      </div>
    </motion.div>
  )
}

export default function OptimizedGallerySection() {
  const sectionRef = useRef<HTMLElement>(null)
  
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  
  // AKTION: images Array mit useMemo umschließen
  const images: GalleryImage[] = useMemo(() => [
    { src: "/assets/images/image8.jpg", alt: "ARADO Profile", size: 'large', width: 800, height: 1200, objectPosition: 'center 20%' },
    { src: "/assets/images/image6.jpg", alt: "Studio Session", size: 'small', width: 1920, height: 1080, objectPosition: 'center top' },
    { src: "/assets/images/image9.jpg", alt: "Festival Crowd", size: 'medium', width: 1080, height: 1920, objectPosition: 'center center' },
    { src: "/assets/images/image2.jpg", alt: "DJ Setup", size: 'small', width: 1600, height: 900 },
    { src: "/assets/images/image5.jpg", alt: "Backstage", size: 'large', width: 1200, height: 800, objectPosition: 'center 30%' },
    { src: "/assets/images/image7.jpg", alt: "Live Performance", size: 'medium', width: 1920, height: 1280 },
    { src: "/assets/images/image4.jpg", alt: "Pacha Event", size: 'small', width: 900, height: 1600 },
  ], []) // AKTION: Leeres Abhängigkeitsarray, da die Bilder statisch sind.

  const openModal = useCallback((imageSrc: string) => {
    const image = images.find(img => img.src === imageSrc)
    if (image) setSelectedImage(image)
  }, [images]) // AKTION: `images` als Abhängigkeit für `useCallback` hinzufügen

  const closeModal = useCallback(() => {
    setSelectedImage(null)
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    
    if (selectedImage) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [selectedImage, closeModal])

  return (
    <>
      <section 
        ref={sectionRef} 
        className="min-h-screen py-20 px-8"
      >
        {/* Hier motion.div um den section-header entfernt */}
        <div className="section-header"> 
          <h2 className="section-title">
            <span className="title-line">Visual</span>
            <span className="title-line">Journey</span>
          </h2>
          <div className="title-underline" />
        </div>

        <div className="gallery-container max-w-7xl mx-auto">
          <div className="gallery-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">
            {images.map((image, index) => (
              <LazyGalleryImage
                key={image.src}
                image={image}
                index={index}
                onClick={openModal}
              />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative max-w-[90vw] max-h-[90vh]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={selectedImage.width}
                height={selectedImage.height}
                className="rounded-lg"
                style={{ 
                  maxWidth: '90vw', 
                  maxHeight: '90vh', 
                  width: 'auto', 
                  height: 'auto' 
                }}
                priority
              />
              <motion.button
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={closeModal}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}