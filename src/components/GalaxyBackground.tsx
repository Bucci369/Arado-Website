'use client'

import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { Suspense, memo } from 'react'

// Main Galaxy Scene - Memoized for performance
const GalaxyScene = memo(() => {
  return (
    <>
      <ambientLight intensity={0.1} />

      <Stars
        radius={80}
        depth={50}
        count={2000} // Reduced from 3000
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      <Stars
        radius={120}
        depth={80}
        count={1500} // Reduced from 2000
        factor={2}
        saturation={0}
        fade
        speed={0.3}
      />
      <Stars
        radius={150}
        depth={100}
        count={800} // Reduced from 1000
        factor={1}
        saturation={0}
        fade
        speed={0.1}
      />
    </>
  )
})

GalaxyScene.displayName = 'GalaxyScene'

const GalaxyBackground = memo(() => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      zIndex: -1,
      background: 'radial-gradient(ellipse at center, #0a0a1f 0%, #000511 40%, #000000 100%)'
    }}>
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 1], fov: 75 }}
          dpr={[1, 1.5]} // Reduced from [1, 2] for better performance
          performance={{ min: 0.5 }}
          frameloop="demand" // Only render when needed
        >
          <GalaxyScene />
        </Canvas>
      </Suspense>
    </div>
  )
})

GalaxyBackground.displayName = 'GalaxyBackground'

export default GalaxyBackground
