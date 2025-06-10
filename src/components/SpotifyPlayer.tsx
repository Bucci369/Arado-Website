'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useRef } from 'react'

interface SpotifyPlayerProps {
  trackId: string
  trackName: string
  artistName: string
  spotifyUri?: string
  delay?: number
}

export default function SpotifyPlayer({ 
  trackName, 
  artistName, 
  spotifyUri,
  delay = 0 
}: SpotifyPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const playerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()

  // Parallax effect for floating
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])

  const createRipple = (event: React.MouseEvent) => {
    if (!playerRef.current) return
    
    const rect = playerRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
    }
    
    setRipples(prev => [...prev, newRipple])
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 1200)
  }

  const togglePlay = (event: React.MouseEvent) => {
    createRipple(event)
    
    if (spotifyUri) {
      // Open Spotify with specific track URI for 30-second preview
      const spotifyUrl = `https://open.spotify.com/track/${spotifyUri}?utm_source=embed_player&utm_content=${spotifyUri}&utm_campaign=track_preview`
      window.open(spotifyUrl, '_blank', 'width=400,height=600')
    } else {
      // Fallback: Try to open Spotify Web Player with search
      const searchQuery = encodeURIComponent(`${artistName} ${trackName}`)
      const spotifySearchUrl = `https://open.spotify.com/search/${searchQuery}`
      window.open(spotifySearchUrl, '_blank', 'width=400,height=600')
    }
    
    setIsPlaying(!isPlaying)
    
    // Auto-reset playing state after preview duration
    setTimeout(() => {
      setIsPlaying(false)
    }, 30000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      style={{ y }}
      transition={{ 
        delay: delay,
        type: "spring", 
        damping: 15, 
        stiffness: 100 
      }}
      className="relative"
    >
      {/* Enhanced Floating Thread Effect */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 origin-bottom"
        style={{ height: '80px', marginTop: '-80px' }}
        animate={{
          scaleY: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.6 : 0.3,
          rotateZ: isHovered ? [0, 2, -2, 0] : 0,
        }}
        transition={{ 
          duration: isHovered ? 0.3 : 2,
          repeat: isHovered ? 0 : Infinity,
          ease: "easeInOut"
        }}
      >
        <div 
          className="w-px h-full bg-gradient-to-b from-transparent via-gray-400/40 to-transparent"
          style={{
            filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.2))',
          }}
        />
      </motion.div>

      {/* Main Player Container with Enhanced Floating */}
      <motion.div
        ref={playerRef}
        className="relative w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={togglePlay}
        animate={{
          y: [0, -8, 0],
          rotateZ: isHovered ? [0, 2, -2, 0] : [0, 1, -1, 0],
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{
          y: {
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay * 0.5,
          },
          rotateZ: {
            duration: isHovered ? 0.3 : 4 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
          scale: {
            duration: 0.2,
          }
        }}
        whileHover={{ 
          y: [0, -12, 0],
          transition: { duration: 0.4, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Enhanced Vinyl Record Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-800 via-black to-gray-900 shadow-2xl">
          {/* Multiple vinyl grooves for realism */}
          <div className="absolute inset-1 rounded-full border border-gray-600/30" />
          <div className="absolute inset-3 rounded-full border border-gray-600/25" />
          <div className="absolute inset-5 rounded-full border border-gray-600/20" />
          <div className="absolute inset-7 rounded-full border border-gray-600/15" />
          
          {/* Vinyl shine effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: '#000000',
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* Enhanced Center Label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-400/30 flex items-center justify-center relative overflow-hidden"
            animate={{
              boxShadow: isPlaying ? 
                '0 0 20px rgba(64, 224, 208, 0.4), 0 0 40px rgba(64, 224, 208, 0.2)' : 
                '0 0 10px rgba(64, 224, 208, 0.1)',
            }}
          >
            {/* Play/Pause Icon */}
            <motion.div
              animate={{
                scale: isPlaying ? 1.2 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {isPlaying ? (
                // Pause Icon
                <div className="flex space-x-1">
                  <div className="w-1.5 h-6 bg-white rounded-sm" />
                  <div className="w-1.5 h-6 bg-white rounded-sm" />
                </div>
              ) : (
                // Play Icon
                <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
              )}
            </motion.div>
            
            {/* Spotify logo overlay */}
            <div className="absolute bottom-1 right-1 w-3 h-3 opacity-60">
              <svg viewBox="0 0 24 24" fill="#1DB954">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Pulsing Waves Effect */}
        {isPlaying && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-cyan-400/60"
              animate={{
                scale: [1, 1.4, 1.8],
                opacity: [0.8, 0.4, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-purple-400/40"
              animate={{
                scale: [1, 1.6, 2.2],
                opacity: [0.6, 0.3, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.5,
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border border-white/20"
              animate={{
                scale: [1, 2, 3],
                opacity: [0.4, 0.2, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeOut",
                delay: 1,
              }}
            />
          </>
        )}

        {/* Enhanced Ripple Effects */}
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute pointer-events-none rounded-full border-2 border-cyan-400/50"
            style={{
              left: ripple.x - 30,
              top: ripple.y - 30,
              width: 60,
              height: 60,
            }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ 
              scale: 6, 
              opacity: 0,
              borderWidth: 0,
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        ))}
      </motion.div>

      {/* Enhanced Track Info */}
      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
      >
        <h3 className="text-sm md:text-base font-semibold text-gray-800 truncate">
          {trackName}
        </h3>
        <p className="text-xs md:text-sm text-gray-600 truncate">
          {artistName}
        </p>
        <div className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          30s Preview
        </div>
      </motion.div>
    </motion.div>
  )
}