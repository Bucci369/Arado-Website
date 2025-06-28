// src/app/components/VideoSection.tsx
'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function VideoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  

  return (
    <section 
      ref={sectionRef} 
      id="videos" 
      className="page-section section-is-white new-style-section"
      style={{
        background: 'transparent',
        position: 'relative'
      }}
    >
      <div className="section-header">
        <h2 className="section-title">
          <span className="title-line">Motion</span>
          <span className="title-line">Moments</span>
        </h2>
        <div className="title-underline"></div>
      </div>

      <div className="video-showcase-container">
        <div className="video-grid">
          <div className="video-item featured-video">
            <div className="video-thumbnail">
              <Image src="/assets/images/image1.jpg" alt="Berghain Set 2024" width={400} height={225} className="video-thumbnail-img" />
              <div className="video-overlay">
                <div className="play-button">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <div className="video-duration">4:32:15</div>
            </div>
            <div className="video-info">
              <h3 className="video-title">Berghain Set 2024</h3>
              <p className="video-description">Epic 4-hour journey through techno - Live from Berlins legendary club</p>
            </div>
          </div>

          <div className="video-item">
            <div className="video-thumbnail">
              <Image src="/assets/images/image2.jpg" alt="Studio Session" width={400} height={225} className="video-thumbnail-img" />
              <div className="video-overlay">
                <div className="play-button">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <div className="video-duration">12:45</div>
            </div>
            <div className="video-info">
              <h3 className="video-title">Dubai</h3>
              <p className="video-description">Behind the scenes production work</p>
            </div>
          </div>

          <div className="video-item">
            <div className="video-thumbnail">
              <Image src="/assets/images/image1.jpg" alt="Festival Highlights" width={400} height={225} className="video-thumbnail-img" />
              <div className="video-overlay">
                <div className="play-button">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <div className="video-duration">8:22</div>
            </div>
            <div className="video-info">
              <h3 className="video-title">Parookaville</h3>
              <p className="video-description">Best moments from summer festivals</p>
            </div>
          </div>

          <div className="video-item">
            <div className="video-thumbnail">
              <Image src="/assets/images/image7.jpg" alt="Mix Tutorial" width={400} height={225} className="video-thumbnail-img" />
              <div className="video-overlay">
                <div className="play-button">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <div className="video-duration">25:10</div>
            </div>
            <div className="video-info">
              <h3 className="video-title">Tomorrowland</h3>
              <p className="video-description"></p>
            </div>
          </div>
        </div>

        
      </div>
    </section>
  )
}