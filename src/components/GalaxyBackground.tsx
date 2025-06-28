'use client'

<<<<<<< HEAD
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { Suspense, memo } from 'react'
=======
import { Canvas } from '@react-three/fiber' // useFrame, useRef, useMemo werden nicht mehr benötigt
import { Stars } from '@react-three/drei'
// import { useRef, useMemo } from 'react' // Nicht mehr benötigt
// import * as THREE from 'three' // Nicht mehr benötigt, da ShootingStar und PulsatingStar entfernt werden
>>>>>>> 283e2a89e6e0729170b28fa60c074a015b83bf7d

// Shooting Star Component wurde hier entfernt

// Pulsating Star Component wurde hier entfernt

<<<<<<< HEAD
// Main Galaxy Scene - Memoized for performance
const GalaxyScene = memo(() => {
=======
// Main Galaxy Scene
function GalaxyScene() {
  // pulsatingStars useMemo wurde hier entfernt, da PulsatingStar nicht mehr verwendet wird
  // const pulsatingStars = useMemo(() =>
  //   Array.from({ length: 15 }, () => ({
  //     position: [
  //       (Math.random() - 0.5) * 100,
  //       (Math.random() - 0.5) * 100,
  //       (Math.random() - 0.5) * 50 - 25
  //     ] as [number, number, number],
  //     size: Math.random() * 0.3 + 0.1,
  //     speed: Math.random() * 2 + 1
  //   })), []
  // )

>>>>>>> 283e2a89e6e0729170b28fa60c074a015b83bf7d
  return (
    <>
      <ambientLight intensity={0.1} />

      <Stars
        radius={80}
        depth={50}
<<<<<<< HEAD
        count={2000} // Reduced from 3000
=======
        count={3000}
>>>>>>> 283e2a89e6e0729170b28fa60c074a015b83bf7d
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      <Stars
        radius={120}
        depth={80}
<<<<<<< HEAD
        count={1500} // Reduced from 2000
=======
        count={2000}
>>>>>>> 283e2a89e6e0729170b28fa60c074a015b83bf7d
        factor={2}
        saturation={0}
        fade
        speed={0.3}
      />
      <Stars
        radius={150}
        depth={100}
<<<<<<< HEAD
        count={800} // Reduced from 1000
=======
        count={1000}
>>>>>>> 283e2a89e6e0729170b28fa60c074a015b83bf7d
        factor={1}
        saturation={0}
        fade
        speed={0.1}
      />
<<<<<<< HEAD
    </>
  )
})

GalaxyScene.displayName = 'GalaxyScene'

const GalaxyBackground = memo(() => {
=======

      {/* Die ShootingStar Instanzen wurden hier entfernt */}
      {/* Die PulsatingStar Instanzen wurden hier ebenfalls entfernt */}
    </>
  )
}

export default function GalaxyBackground() {
>>>>>>> 283e2a89e6e0729170b28fa60c074a015b83bf7d
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
<<<<<<< HEAD
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
=======
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        dpr={[1, 2]} // Limit pixel ratio for performance
        performance={{ min: 0.5 }} // Performance optimization
      >
        <GalaxyScene />
      </Canvas>
    </div>
  )
}
>>>>>>> 283e2a89e6e0729170b28fa60c074a015b83bf7d
