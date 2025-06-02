'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'

const smokeVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const smokeFragmentShader = `
  uniform float uTime;
  uniform float uOpacity;
  uniform sampler2D uNoiseTexture;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Improved noise function
  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
  }
  
  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for(int i = 0; i < 6; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Time-based movement
    float time = uTime * 0.1;
    
    // Create flowing smoke movement
    vec3 smokePos = vec3(uv.x * 4.0, uv.y * 2.0 + time, time * 0.5);
    
    // Multiple octaves of noise for realistic smoke
    float noise1 = fbm(smokePos * 0.8);
    float noise2 = fbm(smokePos * 1.6 + vec3(100.0));
    float noise3 = fbm(smokePos * 3.2 + vec3(200.0));
    
    // Combine noises
    float smoke = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
    
    // Ground fade - smoke only at bottom
    float groundMask = smoothstep(0.7, 0.0, uv.y);
    
    // Horizontal fade for natural spread
    float horizontalMask = smoothstep(0.0, 0.2, uv.x) * smoothstep(1.0, 0.8, uv.x);
    
    // Create wispy edges
    smoke = smoothstep(0.1, 0.7, smoke + 0.2);
    
    // Apply masks
    float density = smoke * groundMask * horizontalMask;
    
    // Color - slightly blue-tinted white smoke
    vec3 smokeColor = vec3(0.95, 0.96, 1.0);
    
    // Final opacity
    float alpha = density * uOpacity * 0.4;
    
    gl_FragColor = vec4(smokeColor, alpha);
  }
`

function SmokePlane({ position, rotation, scale }: { position: [number, number, number], rotation: [number, number, number], scale: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: smokeVertexShader,
      fragmentShader: smokeFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 1.0 },
        uNoiseTexture: { value: null }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    })
  }, [])
  
  useFrame((state) => {
    if (shaderMaterial) {
      shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime
    }
  })
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      material={shaderMaterial}
    >
      <planeGeometry args={[1, 1, 64, 64]} />
    </mesh>
  )
}

function SmokeScene() {
  return (
    <>
      {/* Multiple smoke layers for depth */}
      <SmokePlane 
        position={[0, -1, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        scale={[20, 12, 1]}
      />
      <SmokePlane 
        position={[3, -0.8, 2]} 
        rotation={[-Math.PI / 2 + 0.1, 0, 0.3]} 
        scale={[15, 10, 1]}
      />
      <SmokePlane 
        position={[-2, -0.9, -1]} 
        rotation={[-Math.PI / 2 - 0.05, 0, -0.2]} 
        scale={[18, 11, 1]}
      />
      <SmokePlane 
        position={[1, -0.7, 3]} 
        rotation={[-Math.PI / 2 + 0.15, 0, 0.1]} 
        scale={[12, 8, 1]}
      />
    </>
  )
}

export default function VolumetricSmoke() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 4, delay: 2 }}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <Canvas
        camera={{ 
          position: [0, 3, 12], 
          fov: 60,
          near: 0.1,
          far: 100
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'transparent'
        }}
      >
        <SmokeScene />
      </Canvas>
    </motion.div>
  )
}