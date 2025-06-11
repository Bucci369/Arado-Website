'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

// Shooting Star Component
function ShootingStar({ delay = 0 }) {
  const meshRef = useRef<THREE.Mesh>(null)

  const startPos = useMemo(() => ({
    x: (Math.random() - 0.5) * 200,
    y: (Math.random() - 0.5) * 100 + 50,
    z: -50 + Math.random() * 30
  }), [])

  useFrame((state) => {
    if (!meshRef.current) return

    const time = (state.clock.elapsedTime + delay) % 20
    const progress = time / 20

    if (progress < 0.1) {
      const activeProgress = progress / 0.1
      meshRef.current.position.x = startPos.x - activeProgress * 150
      meshRef.current.position.y = startPos.y - activeProgress * 100
      meshRef.current.position.z = startPos.z
      // KORREKTUR HIER:
      ;(meshRef.current.material as THREE.MeshBasicMaterial).opacity = activeProgress > 0.1 ? 1 - (activeProgress - 0.1) / 0.2 : activeProgress / 0.1
      meshRef.current.visible = true
    } else {
      meshRef.current.visible = false
    }
  })
  return (
    <mesh ref={meshRef} visible={false}>
      <planeGeometry args={[60, 0.5]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0} />
    </mesh>
  )
}


// Pulsating Star Component
function PulsatingStar({ position, size, speed }: { position: [number, number, number]; size: number; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
    useFrame((state) => {
    if (!meshRef.current) return
    const scale = 1 + Math.sin(state.clock.elapsedTime * speed) * 0.3
    meshRef.current.scale.setScalar(scale * size)
  })
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  )
}

// Main Galaxy Scene
function GalaxyScene() {
  const pulsatingStars = useMemo(() => 
    Array.from({ length: 15 }, () => ({
      position: [
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 50 - 25
      ] as [number, number, number],
      size: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 2 + 1
    })), []
  )

  return (
    <>
      <ambientLight intensity={0.1} />
      
      <Stars 
        radius={80} 
        depth={50} 
        count={3000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.5}
      />
      <Stars 
        radius={120} 
        depth={80} 
        count={2000} 
        factor={2} 
        saturation={0} 
        fade 
        speed={0.3}
      />
      <Stars 
        radius={150} 
        depth={100} 
        count={1000} 
        factor={1} 
        saturation={0} 
        fade 
        speed={0.1}
      />
      
      
      
      <ShootingStar delay={0} />
      <ShootingStar delay={3} />
      <ShootingStar delay={5.5} />
      
      {pulsatingStars.map((star, i) => (
        <PulsatingStar key={i} {...star} />
      ))}
    </>
  )
}
export default function GalaxyBackground() {
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