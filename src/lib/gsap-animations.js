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

  // Hero Section Observer
  const heroSection = document.getElementById('hero')
  if (heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          entry.target.classList.add('is-visible')
          
          // Scroll-Indikator einblenden
          const scrollIndicator = entry.target.querySelector('.scroll-down-indicator')
          if (scrollIndicator) {
            gsap.to(scrollIndicator, { 
              opacity: 1, 
              duration: 0.8, 
              delay: 2.5, 
              ease: "power2.out" 
            })
          }
        }
      })
    }, { threshold: 0.5 })
    heroObserver.observe(heroSection)
  }

  // Intersection Observer für alle Sektionen
  const sectionsToObserve = document.querySelectorAll('.page-section')
  if (sectionsToObserve.length > 0) {
    const generalObserverOptions = { 
      root: null, 
      rootMargin: '-10% 0px -10% 0px', 
      threshold: [0.1, 0.5, 0.8] 
    }
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        const section = entry.target
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
          section.classList.add('is-visible')
        }
      })
    }
    
    const observer = new IntersectionObserver(observerCallback, generalObserverOptions)
    sectionsToObserve.forEach(section => observer.observe(section))
  }

  // GSAP ScrollTrigger Animationen
  
  // Basis Sektionen Animation - DISABLED (causes black bars)
  // gsap.utils.toArray(".page-section").forEach((section) => {
  //   gsap.fromTo(section, 
  //     { opacity: 0, y: 80 }, 
  //     {
  //       opacity: 1, 
  //       y: 0, 
  //       duration: 1, 
  //       ease: "power2.out",
  //       scrollTrigger: { 
  //         trigger: section, 
  //         start: "top 80%", 
  //         toggleActions: "play none none reverse" 
  //       }
  //     }
  //   )
  // })

  // Titel Animationen
  gsap.utils.toArray(".title-line").forEach((el, i) => {
    gsap.fromTo(el, 
      { opacity: 0, y: 50 }, 
      {
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        delay: i * 0.15,
        scrollTrigger: { 
          trigger: el, 
          start: "top 85%", 
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
        duration: 0.6,
        scrollTrigger: { 
          trigger: el, 
          start: "top 85%", 
          toggleActions: "play none none reverse" 
        }
      }
    )
  })

  // Bio Bild Animation
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
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bioImage,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    )
  }

  // Bio Paragraphen Animation
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
        duration: 0.8,
        delay: index * 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: paragraph,
          start: "top 90%",
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

        statNumberElement.textContent = formatNumberDE(startValue)
        let animatedValue = { val: startValue }

        gsap.to(animatedValue, {
          val: targetValue,
          duration: 2.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statNumberElement,
            start: "top 90%",
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
  
  // Zoom-In Animation für Listen
  gsap.utils.toArray('.zoom-list-item').forEach((item, index) => {
    gsap.fromTo(item,
      { opacity: 0, scale: 0.5, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.7,
        delay: index * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
          toggleActions: "play none none reverse",
        }
      }
    )
  })

  // Spotify Player Animationen - DISABLED FOR DEBUGGING
  // const musikSection = document.getElementById('meine-musik')
  // if (musikSection) {
  //   gsap.utils.toArray('#meine-musik .spotify-player').forEach((player, index) => {
  //     gsap.fromTo(player,
  //       { 
  //         opacity: 0,
  //         scale: 0.8,
  //         y: 50,
  //         rotation: 15
  //       },
  //       {
  //         opacity: 1,
  //         scale: 1,
  //         y: 0,
  //         rotation: 0,
  //         duration: 0.8,
  //         delay: 0.4 + index * 0.1,
  //         ease: "power2.out",
  //         scrollTrigger: {
  //           trigger: musikSection,
  //           start: "top 70%",
  //           toggleActions: "play none none reverse"
  //         }
  //       }
  //     )
  //   })
  // }

  // Video Items Animation
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
        duration: 0.8,
        delay: index * 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    )
  })

  // Gallery Items Animation
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
        duration: 0.8,
        delay: index * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    )
  })

  // Contact Section Animations
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
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: contactInfo,
          start: "top 85%",
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
        duration: 1,
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: contactForm,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    )
  }

  console.log('GSAP Animationen initialisiert')
}

export function cleanupGSAPAnimations() {
  if (typeof window !== 'undefined') {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    isInitialized = false
  }
}