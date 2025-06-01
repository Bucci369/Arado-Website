'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface SpotifyTrack {
  id: string
  name: string
  preview_url: string | null
  external_urls: {
    spotify: string
  }
  album: {
    images: Array<{
      url: string
      height: number
      width: number
    }>
    name: string
  }
  artists: Array<{
    name: string
  }>
  duration_ms: number
  popularity: number
}

export default function MusicSection() {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const [loading, setLoading] = useState(true)
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([])

  const getStoredAradoTracks = (): SpotifyTrack[] => {
    try {
      const stored = localStorage.getItem('aradoTracks')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  const storeAradoTracks = (tracks: SpotifyTrack[]) => {
    try {
      localStorage.setItem('aradoTracks', JSON.stringify(tracks))
    } catch {
      // localStorage not available
    }
  }

  const fetchSpotifyTracks = useCallback(async () => {
    try {
      setLoading(true)
      
      // Get existing good tracks first
      const existingTracks = getStoredAradoTracks()
      console.log('Existing stored Arado tracks:', existingTracks.length)
      
      // If we have good tracks, show them immediately
      if (existingTracks.length > 0) {
        setTracks(existingTracks)
      }
      
      // Try to find additional Arado tracks
      const searches = [
        'artist:"Arado"',
        'artist:"DJ ARADO"',
        '"Uganda Express"',
        'artist:"Arado" techno',
        'artist:"Arado" house',
        'artist:"Arado" electronic',
        'artist:"Arado" minimal',
        'Desolat label',
        '"Den Ishu" Arado'
      ]
      
      let allFoundTracks: SpotifyTrack[] = [...existingTracks]
      
      for (const searchTerm of searches) {
        try {
          const searchResponse = await fetch(`/api/deezer-search?q=${encodeURIComponent(searchTerm)}&limit=10`)
          
          if (searchResponse.ok) {
            const data = await searchResponse.json()
            
            if (data.tracks && data.tracks.length > 0) {
              // Filter for Arado/electronic tracks only
              const filteredTracks = data.tracks.filter((track: SpotifyTrack) => {
                const trackName = track.name.toLowerCase()
                const artistName = track.artists[0]?.name.toLowerCase() || ''
                const albumName = track.album?.name.toLowerCase() || ''
                
                // Check if it's Arado or electronic music related
                const isAradoRelated = 
                  artistName.includes('arado') ||
                  trackName.includes('uganda express') ||
                  albumName.includes('desolat') ||
                  (trackName.includes('techno') && artistName.includes('arado')) ||
                  (trackName.includes('house') && artistName.includes('arado'))
                
                // Don't add duplicates
                const isDuplicate = allFoundTracks.some(existing => existing.id === track.id)
                
                return isAradoRelated && !isDuplicate
              })
              
              // Add new tracks to collection
              allFoundTracks = [...allFoundTracks, ...filteredTracks]
              
              if (allFoundTracks.length > existingTracks.length) {
                console.log(`Found ${allFoundTracks.length - existingTracks.length} new Arado tracks`)
                // Store updated collection
                storeAradoTracks(allFoundTracks.slice(0, 6))
                setTracks(allFoundTracks.slice(0, 6))
              }
            }
          }
        } catch {
          console.log(`Search failed for: ${searchTerm}`)
          continue
        }
      }
      
      // If no tracks found at all, use demo tracks
      if (allFoundTracks.length === 0) {
        console.log('No Arado tracks found, using demo tracks')
        setTracks(getFallbackTracks())
      }
      
    } catch (error) {
      console.error('Error fetching tracks:', error)
      setTracks(getFallbackTracks())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSpotifyTracks()
  }, [fetchSpotifyTracks])

  const getFallbackTracks = (): SpotifyTrack[] => [
    {
      id: '1',
      name: 'Uganda Express',
      preview_url: '/assets/audio/track1.mp3',
      external_urls: { spotify: 'https://open.spotify.com/artist/1RC5ZOxe62bcUrpR50xcQV' },
      album: { 
        name: 'Desolat X005',
        images: [{ url: '/assets/images/image1.jpg', height: 640, width: 640 }] 
      },
      artists: [{ name: 'DJ ARADO' }, { name: 'Den Ishu' }],
      duration_ms: 431000,
      popularity: 65
    },
    {
      id: '2', 
      name: 'Berlin Nights',
      preview_url: '/assets/audio/track2.mp3',
      external_urls: { spotify: 'https://open.spotify.com/artist/1RC5ZOxe62bcUrpR50xcQV' },
      album: { 
        name: 'Desolat Sessions',
        images: [{ url: '/assets/images/Profilbild1.jpg', height: 640, width: 640 }] 
      },
      artists: [{ name: 'DJ ARADO' }],
      duration_ms: 387000,
      popularity: 58
    },
    {
      id: '3',
      name: 'Deep House Therapy', 
      preview_url: '/assets/audio/track3.mp3',
      external_urls: { spotify: 'https://open.spotify.com/artist/1RC5ZOxe62bcUrpR50xcQV' },
      album: { 
        name: 'Underground Collective',
        images: [{ url: '/assets/images/image1.jpg', height: 640, width: 640 }] 
      },
      artists: [{ name: 'DJ ARADO' }],
      duration_ms: 412000,
      popularity: 52
    },
    {
      id: '4',
      name: 'Techno Dreams',
      preview_url: '/assets/audio/track1.mp3',
      external_urls: { spotify: 'https://open.spotify.com/artist/1RC5ZOxe62bcUrpR50xcQV' },
      album: { 
        name: 'Electronic Visions',
        images: [{ url: '/assets/images/Profilbild1.jpg', height: 640, width: 640 }] 
      },
      artists: [{ name: 'DJ ARADO' }],
      duration_ms: 398000,
      popularity: 48
    }
  ]

  const togglePlay = (trackIndex: number) => {
    const track = tracks[trackIndex]
    
    if (!track.preview_url) {
      console.log('No preview available for this track')
      return
    }

    const audio = audioRefs.current[trackIndex]
    if (!audio) return

    // Stop all other tracks
    audioRefs.current.forEach((otherAudio, index) => {
      if (otherAudio && index !== trackIndex) {
        otherAudio.pause()
        otherAudio.currentTime = 0
      }
    })

    if (currentTrack === trackIndex && isPlaying) {
      audio.pause()
      setIsPlaying(false)
      setCurrentTrack(null)
    } else {
      audio.play().catch(error => {
        console.error('Error playing track:', error)
      })
      setIsPlaying(true)
      setCurrentTrack(trackIndex)
    }
  }

  const openSpotify = (spotifyUrl: string) => {
    window.open(spotifyUrl, '_blank')
  }

  useEffect(() => {
    audioRefs.current.forEach((audio) => {
      if (audio) {
        const handleEnded = () => {
          setIsPlaying(false)
          setCurrentTrack(null)
        }
        audio.addEventListener('ended', handleEnded)
        return () => audio.removeEventListener('ended', handleEnded)
      }
    })
  }, [tracks])

  if (loading) {
    return (
      <section 
        id="my-music" 
        className="page-section section-is-white new-style-section"
        style={{
          background: 'linear-gradient(to bottom, #1a2832 0%, #3a5668 100%)',
          position: 'relative'
        }}
      >
        <div className="section-header">
          <h2 className="section-title">
            <span className="title-line">Meine</span>
            <span className="title-line">Musik</span>
          </h2>
          <div className="title-underline"></div>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading tracks...</p>
        </div>
      </section>
    )
  }

  return (
    <section 
      id="my-music" 
      className="page-section section-is-white new-style-section"
      style={{
        background: 'linear-gradient(to bottom, #1a2832 0%, #3a5668 100%)',
        position: 'relative'
      }}
    >
      {/* Subtle Professional Background */}
      <div className="music-bg-subtle">
        <div className="sound-wave wave-1"></div>
        <div className="sound-wave wave-2"></div>
        <div className="sound-wave wave-3"></div>
      </div>

      <div className="section-header">
        <h2 className="section-title">
          <span className="title-line">My</span>
          <span className="title-line">Music</span>
        </h2>
        <div className="title-underline"></div>
      </div>

      <div className="spotify-players-container">
        {tracks.length === 0 && (
          <div style={{ color: 'white', gridColumn: '1 / -1', textAlign: 'center' }}>
            Loading tracks...
          </div>
        )}
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={`spotify-player player-${index + 1} ${
              currentTrack === index && isPlaying ? 'is-playing' : ''
            }`}
            style={{ border: '2px solid #666' }} // Debug border
          >
            {/* Wave Impulses */}
            {currentTrack === index && isPlaying && (
              <div className="wave-impulses">
                <div className="wave-ring ring-1"></div>
                <div className="wave-ring ring-2"></div>
                <div className="wave-ring ring-3"></div>
              </div>
            )}
            
            {/* Album Cover Background */}
            <div 
              className="album-cover"
              style={{
                backgroundImage: `url(${track.album.images[1]?.url || track.album.images[0]?.url || '/assets/images/image1.jpg'})`
              }}
            ></div>
            
            {/* Play Button */}
            <button 
              className="play-button"
              onClick={() => togglePlay(index)}
              aria-label={`Play ${track.name}`}
            >
              {currentTrack === index && isPlaying ? (
                <svg viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
            
            {/* Track Info */}
            <div className="track-info">
              <h3 className="track-title">{track.name}</h3>
              <p className="track-artist">{track.artists[0]?.name}</p>
            </div>
            
            {/* Spotify Link */}
            <button 
              className="spotify-link"
              onClick={() => openSpotify(track.external_urls.spotify)}
              title="Open in Spotify"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </button>
            
            {/* Audio Element */}
            {track.preview_url && (
              <audio
                ref={(el) => {
                  audioRefs.current[index] = el;
                }}
                src={track.preview_url}
                preload="metadata"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}