// GSAP Animationen basierend auf der alten Website
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

let isInitialized = false

export function initGSAPAnimations() {
  if (typeof window === 'undefined' || isInitialized) return
  
  gsap.registerPlugin(ScrollTrigger)
  isInitialized = true

  // Hero Section Observer (für Slogan und Scroll-Indikator)
  const heroSection = document.getElementById('hero')
  if (heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Threshold auf 0.1 erhöht für frühere Aktivierung
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
          entry.target.classList.add('is-visible')
          
          // Scroll-Indikator einblenden - reduzierte Verzögerung
          const scrollIndicator = entry.target.querySelector('.scroll-down-indicator')
          if (scrollIndicator) {
            gsap.to(scrollIndicator, { 
              opacity: 1, 
              duration: 0.8, 
              delay: 1.5, // Von 2.0 auf 1.5 reduziert
              ease: "power2.out" 
            })
          }
        }
      })
    }, { threshold: 0.1 }) // Von 0.05 auf 0.1 erhöht
    heroObserver.observe(heroSection)
  }

  // Intersection Observer für alle Sektionen
  const sectionsToObserve = document.querySelectorAll('.page-section')
  if (sectionsToObserve.length > 0) {
    const generalObserverOptions = { 
      root: null, 
      rootMargin: '0px 0px -5% 0px', // Reduziert von -10% auf -5%
      threshold: [0.05, 0.3, 0.6] // Niedrigere Schwellenwerte für frühere Aktivierung
    }
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        const section = entry.target
        if (entry.isIntersecting && entry.intersectionRatio >= 0.05) { // Von 0.1 auf 0.05 reduziert
          section.classList.add('is-visible')
        }
      })
    }
    
    const observer = new IntersectionObserver(observerCallback, generalObserverOptions)
    sectionsToObserve.forEach(section => observer.observe(section))
  }

  // Titel Animationen - frühere Aktivierung
  gsap.utils.toArray(".title-line").forEach((el, i) => {
    gsap.fromTo(el, 
      { opacity: 0, y: 50 }, 
      {
        opacity: 1, 
        y: 0, 
        duration: 0.6, // Von 0.8 auf 0.6 reduziert
        delay: i * 0.1, // Von 0.15 auf 0.1 reduziert
        scrollTrigger: { 
          trigger: el, 
          start: "top 95%", // Von 85% auf 95% erhöht für frühere Aktivierung
          toggleActions: "play none none reverse" 
        }
      }
    )
  })

  gsap.utils.toArray(".title-underline").forEach((el) => {
    gsap.fromTo(el, 
      { opacity: 0, scaleX: 0 }, 
      {
        opacity: 1, 
        scaleX: 1, 
        duration: 0.5, // Von 0.6 auf 0.5 reduziert
        scrollTrigger: { 
          trigger: el, 
          start: "top 95%", // Von 85% auf 95% erhöht
          toggleActions: "play none none reverse" 
        }
      }
    )
  })

  // Bio Bild Animation - frühere Aktivierung
  const bioImage = document.querySelector('.bio-image')
  if (bioImage) {
    gsap.fromTo(bioImage,
      { 
        opacity: 0, 
        scale: 0.8, 
        rotateY: -15, 
        x: -50 
      },
      {
        opacity: 1,
        scale: 1,
        rotateY: 0,
        x: 0,
        duration: 1.0, // Von 1.2 auf 1.0 reduziert
        ease: "power3.out",
        scrollTrigger: {
          trigger: bioImage,
          start: "top 95%", // Von 85% auf 95% erhöht
          toggleActions: "play none none reverse"
        }
      }
    )
  }

  // Bio Paragraphen Animation - frühere Aktivierung
  gsap.utils.toArray('.bio-paragraph').forEach((paragraph, index) => {
    gsap.fromTo(paragraph,
      { 
        opacity: 0, 
        y: 30, 
        x: 20 
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 0.6, // Von 0.8 auf 0.6 reduziert
        delay: index * 0.15, // Von 0.2 auf 0.15 reduziert
        ease: "power2.out",
        scrollTrigger: {
          trigger: paragraph,
          start: "top 95%", // Von 90% auf 95% erhöht
          toggleActions: "play none none reverse"
        }
      }
    )
  })

  // Stats Zahlen Animation
  function formatNumberDE(value) {
    return Math.round(value).toLocaleString('de-DE')
  }

  const statsItemsForNumberAnimation = document.querySelectorAll('#meine-stats .stat-item')
  if (statsItemsForNumberAnimation.length > 0) {
    statsItemsForNumberAnimation.forEach(item => {
      const statNumberElement = item.querySelector('.stat-number')
      if (statNumberElement) {
        const targetValue = parseFloat(statNumberElement.dataset.targetValue)
        let startValue = parseFloat(statNumberElement.dataset.startValue)
        if (isNaN(targetValue)) return
        if (isNaN(startValue)) { startValue = 0 }

        let animatedValue = { val: startValue }

        gsap.to(animatedValue, {
          val: targetValue,
          duration: 2.0, // Von 2.5 auf 2.0 reduziert
          ease: "power2.out",
          scrollTrigger: {
            trigger: statNumberElement,
            start: "top 95%", // Von 90% auf 95% erhöht
            toggleActions: "play none none none",
          },
          onUpdate: () => { 
            statNumberElement.textContent = formatNumberDE(animatedValue.val)
          },
          onComplete: () => { 
            statNumberElement.textContent = formatNumberDE(targetValue)
          }
        })
      }
    })
  }
  
  // Zoom-In Animation für Listen - noch frühere Aktivierung
  gsap.utils.toArray('.zoom-list-item').forEach((item, index) => {
    gsap.fromTo(item,
      { 
        opacity: 0, 
        scale: 0.1, 
        y: 80, 
        rotation: -15, 
        filter: "blur(10px)" 
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: 0,
        filter: "blur(0px)",
        duration: 0.8, // Von 1.2 auf 0.8 reduziert
        delay: index * 0.05, // Von 0.08 auf 0.05 reduziert
        ease: "back.out(2.5)",
        scrollTrigger: {
          trigger: item,
          start: "top 100%", // Von 98% auf 100% erhöht - startet sofort wenn sichtbar
          toggleActions: "play none none reverse",
        }
      }
    )
  })

  // Video Items Animation - frühere Aktivierung
  gsap.utils.toArray('.video-item').forEach((item, index) => {
    gsap.fromTo(item,
      { 
        opacity: 0,
        y: 50,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6, // Von 0.8 auf 0.6 reduziert
        delay: index * 0.1, // Von 0.15 auf 0.1 reduziert
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 95%", // Von 85% auf 95% erhöht
          toggleActions: "play none none reverse"
        }
      }
    )
  })

  // Gallery Items Animation - frühere Aktivierung
  gsap.utils.toArray('.gallery-item').forEach((item, index) => {
    gsap.fromTo(item,
      { 
        opacity: 0,
        y: 50,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6, // Von 0.8 auf 0.6 reduziert
        delay: index * 0.05, // Von 0.1 auf 0.05 reduziert
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 95%", // Von 85% auf 95% erhöht
          toggleActions: "play none none reverse"
        }
      }
    )
  })

  // Contact Section Animations - frühere Aktivierung
  const contactInfo = document.querySelector('.contact-info')
  if (contactInfo) {
    gsap.fromTo(contactInfo,
      { 
        opacity: 0,
        x: -50
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8, // Von 1 auf 0.8 reduziert
        ease: "power2.out",
        scrollTrigger: {
          trigger: contactInfo,
          start: "top 95%", // Von 85% auf 95% erhöht
          toggleActions: "play none none reverse"
        }
      }
    )
  }

  const contactForm = document.querySelector('.contact-form')
  if (contactForm) {
    gsap.fromTo(contactForm,
      { 
        opacity: 0,
        x: 50
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8, // Von 1 auf 0.8 reduziert
        delay: 0.2, // Von 0.3 auf 0.2 reduziert
        ease: "power2.out",
        scrollTrigger: {
          trigger: contactForm,
          start: "top 95%", // Von 85% auf 95% erhöht
          toggleActions: "play none none reverse"
        }
      }
    )
  }

  // Die Musiksektion Karussell-Animation wurde in MusicSection.tsx verschoben
}

export function cleanupGSAPAnimations() {
  if (typeof window !== 'undefined') {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    isInitialized = false
  }
}