'use client'

import Image from 'next/image'

export default function VideoSection() {
  return (
    <section 
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
              <p className="video-description">Epic 4-hour journey through techno - Live from Berlin&apos;s legendary club</p>
            </div>
          </div>

          <div className="video-item">
            <div className="video-thumbnail">
              <Image src="/assets/images/Profilbild1.jpg" alt="Studio Session" width={400} height={225} className="video-thumbnail-img" />
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
              <h3 className="video-title">Studio Sessions</h3>
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
              <h3 className="video-title">Festival Highlights</h3>
              <p className="video-description">Best moments from summer festivals</p>
            </div>
          </div>

          <div className="video-item">
            <div className="video-thumbnail">
              <Image src="/assets/images/Profilbild1.jpg" alt="Mix Tutorial" width={400} height={225} className="video-thumbnail-img" />
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
              <h3 className="video-title">DJ Mix Tutorial</h3>
              <p className="video-description">Learn my signature mixing techniques</p>
            </div>
          </div>
        </div>

        <div className="video-cta">
          <div className="cta-badge">
            <div className="live-indicator"></div>
            <span>More Videos on YouTube & Vimeo</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}