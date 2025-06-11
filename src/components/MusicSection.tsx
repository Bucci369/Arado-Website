// src/app/components/MusicSection.tsx
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const [loading, setLoading] = useState(true)
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([])
  
  const sectionRef = useRef<HTMLElement>(null) 
  const wrapperRef = useRef<HTMLDivElement>(null)

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
      // localStorage nicht verfügbar
    }
  }

  const fetchSpotifyTracks = useCallback(async () => {
    try {
      setLoading(true)
      const existingTracks = getStoredAradoTracks()
      if (existingTracks.length > 0) {
        setTracks(existingTracks)
      }

      const searches = [
        'artist:"Arado"', 'artist:"DJ ARADO"', '"Uganda Express"',
        'artist:"Arado" techno', 'artist:"Arado" house', 'artist:"Arado" minimal',
        'Desolat label', '"Den Ishu" Arado'
      ]
      let allFoundTracks: SpotifyTrack[] = [...existingTracks]

      for (const searchTerm of searches) {
        try {
          const searchResponse = await fetch(`/api/deezer-search?q=${encodeURIComponent(searchTerm)}&limit=10`)
          if (searchResponse.ok) {
            const data = await searchResponse.json()
            if (data.tracks && data.tracks.length > 0) {
              const filteredTracks = data.tracks.filter((track: SpotifyTrack) => {
                const trackName = track.name.toLowerCase()
                const artistName = track.artists[0]?.name.toLowerCase() || ''
                const albumName = track.album?.name.toLowerCase() || ''
                const isAradoRelated = artistName.includes('arado') || trackName.includes('uganda express') || albumName.includes('desolat') || (trackName.includes('techno') && artistName.includes('arado')) || (trackName.includes('house') && artistName.includes('arado'))
                const isDuplicate = allFoundTracks.some(existing => existing.id === track.id)
                return isAradoRelated && !isDuplicate
              })

              allFoundTracks = [...allFoundTracks, ...filteredTracks]
              if (allFoundTracks.length > existingTracks.length) {
                storeAradoTracks(allFoundTracks.slice(0, 6))
                setTracks(allFoundTracks.slice(0, 6))
              }
            }
          }
        } catch (error) {
          console.log(`Search failed for: ${searchTerm}`, error)
          continue
        }
      }
      if (allFoundTracks.length === 0) {
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

  useEffect(() => {
   if (!loading && wrapperRef.current) {
      const container = wrapperRef.current;
      // const rect = container.getBoundingClientRect(); // Nicht mehr benötigt, wenn Container quadratisch
      // const aspect = rect.height > 0 ? rect.width / rect.height : 1; // Nicht mehr benötigt

      const players = gsap.utils.toArray<HTMLElement>(container.children);

      const orbits = [
        { radius: 0, speed: 0, initialAngle: 0 },
        { radius: 200, speed: 18, initialAngle: 0 },
        { radius: 280, speed: 16, initialAngle: 90 },
        { radius: 360, speed: 14, initialAngle: 180 },
        { radius: 440, speed: 12, initialAngle: 270 },
        { radius: 520, speed: 10, initialAngle: 45 },
      ];

      const updatePlanets = (time: number) => {
        players.forEach((player, index) => {
          if(index >= tracks.slice(0, 6).length) return;
          const orbit = orbits[index];
          if (!orbit || orbit.radius === 0) return;

          const angle = (orbit.initialAngle * (Math.PI / 180)) + (time / orbit.speed);

          const x = orbit.radius * Math.cos(angle);
          // Die Y-Berechnung vereinfachen, da der Container jetzt quadratisch ist
          const y = orbit.radius * Math.sin(angle); 

          gsap.set(player, { x: x, y: y, xPercent: -50, yPercent: -50, transformOrigin: 'center center' });
        });
      };

      gsap.ticker.add(updatePlanets);

      return () => {
        gsap.ticker.remove(updatePlanets);
      };
    }
  }, [loading, tracks]);

  const getFallbackTracks = (): SpotifyTrack[] => [
    { id: '1', name: 'Uganda Express', preview_url: '/assets/audio/track1.mp3', external_urls: { spotify: 'https://open.spotify.com/track/REAL_SPOTIFY_ID_1' }, album: { name: 'Desolat X005', images: [{ url: '/assets/images/image1.jpg', height: 640, width: 640 }] }, artists: [{ name: 'DJ ARADO' }, { name: 'Den Ishu' }], duration_ms: 431000, popularity: 65 },
    { id: '2', name: 'Berlin Nights', preview_url: '/assets/audio/track2.mp3', external_urls: { spotify: 'https://open.spotify.com/track/REAL_SPOTIFY_ID_2' }, album: { name: 'Desolat Sessions', images: [{ url: '/assets/images/Profilbild1.jpg', height: 640, width: 640 }] }, artists: [{ name: 'DJ ARADO' }], duration_ms: 387000, popularity: 58 },
    { id: '3', name: 'Deep House Therapy', preview_url: '/assets/audio/track3.mp3', external_urls: { spotify: 'https://open.spotify.com/track/REAL_SPOTIFY_ID_3' }, album: { name: 'Underground Collective', images: [{ url: '/assets/images/image1.jpg', height: 640, width: 640 }] }, artists: [{ name: 'DJ ARADO' }], duration_ms: 412000, popularity: 52 },
    { id: '4', name: 'Techno Dreams', preview_url: '/assets/audio/track1.mp3', external_urls: { spotify: 'https://open.spotify.com/track/REAL_SPOTIFY_ID_4' }, album: { name: 'Electronic Visions', images: [{ url: '/assets/images/Profilbild1.jpg', height: 640, width: 640 }] }, artists: [{ name: 'DJ ARADO' }], duration_ms: 398000, popularity: 48 },
    { id: '5', name: 'Minimal Groove', preview_url: '/assets/audio/track2.mp3', external_urls: { spotify: 'https://open.spotify.com/track/REAL_SPOTIFY_ID_5' }, album: { name: 'Groove Selection', images: [{ url: '/assets/images/image1.jpg', height: 640, width: 640 }] }, artists: [{ name: 'DJ ARADO' }], duration_ms: 360000, popularity: 60 },
    { id: '6', name: 'Morning Light', preview_url: '/assets/audio/track3.mp3', external_urls: { spotify: 'https://open.spotify.com/track/REAL_SPOTIFY_ID_6' }, album: { name: 'Sunrise EP', images: [{ url: '/assets/images/Profilbild1.jpg', height: 640, width: 640 }] }, artists: [{ name: 'DJ ARADO' }], duration_ms: 405000, popularity: 55 }
  ];

  const togglePlay = (trackIndex: number) => {
    const track = tracks[trackIndex]
    if (!track.preview_url) return;
    const audio = audioRefs.current[trackIndex]
    if (!audio) return

    audioRefs.current.forEach((otherAudio, index) => {
      if (otherAudio && index !== trackIndex) {
        otherAudio.pause()
        otherAudio.currentTime = 0
      }
    })

    if (currentTrackIndex === trackIndex && isPlaying) {
      audio.pause()
      setIsPlaying(false)
      setCurrentTrackIndex(null)
    } else {
      audio.play().catch(error => console.error('Error playing track:', error))
      setIsPlaying(true)
      setCurrentTrackIndex(trackIndex)
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
          setCurrentTrackIndex(null)
        }
        audio.addEventListener('ended', handleEnded)
        return () => audio.removeEventListener('ended', handleEnded)
      }
    })
  }, [tracks])

  if (loading) {
    return (
      <section id="my-music" className="page-section section-is-white new-style-section" style={{ background: 'transparent', position: 'relative', minHeight: '100vh', padding: '4rem 2rem' }}>
        {/* Hinzugefügter section-content-container für den Ladezustand */}
        <div className="section-content-container">
          <div className="section-header">
            <h2 className="section-title"><span className="title-line">My</span><span className="title-line">Music</span></h2>
            <div className="title-underline"></div>
          </div>
          <div className="loading-spinner" style={{ color: '#ffffff', marginTop: '4rem' }}><div className="spinner"></div><p>Loading tracks...</p></div>
        </div>
      </section>
    )
  }

  return (
    <section 
      ref={sectionRef} 
      id="my-music" 
      className="page-section section-is-white new-style-section" 
      style={{ 
        background: 'transparent', 
        position: 'relative',
        minHeight: '150vh', // Beibehalten, um ausreichend Scrollraum zu bieten
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // padding und paddingTop hier ENTFERNT!
      }}
    >
      {/* section-content-container für den Titelbereich */}
      <div className="section-content-container">
        <div className="section-header" style={{ marginBottom: '4rem' }}>
          <h2 className="section-title">
            <span className="title-line">Sounds</span>
            <span className="title-line">From Outer World</span>
          </h2>
          <div className="title-underline"></div>
        </div>
      </div>
      
      {/* spotify-players-container ohne eigene Hintergründe */}
      <div className="spotify-players-container" style={{ flex: 1, width: '100%', position: 'relative', marginTop: '2rem' }}>
        <div className="orbit-line orbit-line-1"></div>
        <div className="orbit-line orbit-line-2"></div>
        <div className="orbit-line orbit-line-3"></div>
        <div className="orbit-line orbit-line-4"></div>
        <div className="orbit-line orbit-line-5"></div>
        
        {/* Sternschnuppen hier einfügen, da sie nicht mehr von Pseudo-Elementen generiert werden */}
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>

        <div ref={wrapperRef} className="planets-wrapper" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
          {tracks.slice(0, 6).map((track, index) => (
            <div key={track.id} className={`spotify-player`}>
              <div className="player-disc">
                {currentTrackIndex === index && isPlaying && (
                  <div className="wave-impulses">
                    <div className="wave-ring ring-1"></div><div className="wave-ring ring-2"></div>
                    <div className="wave-ring ring-3"></div><div className="wave-ring ring-4"></div>
                  </div>
                )}
                <div className="album-cover" style={{ backgroundImage: `url(${track.album.images[1]?.url || track.album.images[0]?.url || '/assets/images/image1.jpg'})` }}></div>
                <div className="vinyl-grooves"></div>
                <button className="play-button" onClick={() => togglePlay(index)} aria-label={`Play ${track.name}`}>
                  {currentTrackIndex === index && isPlaying ? (
                    <div className="pause-icon"><div className="pause-bar"></div><div className="pause-bar"></div></div>
                  ) : (
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  )}
                </button>
                <button className="spotify-link" onClick={() => openSpotify(track.external_urls.spotify)} title="Open in Spotify">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                </button>
              </div>
              <div className="track-info">
                <h3 className="track-title">{track.name}</h3>
                <p className="track-artist">{track.artists[0]?.name}</p>
              </div>
              {track.preview_url && (
                <audio ref={(el) => { audioRefs.current[index] = el; }} src={track.preview_url} preload="metadata" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}