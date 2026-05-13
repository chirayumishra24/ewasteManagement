import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sceneConfig } from '../../../sceneConfig'
import type { SceneQuality } from '../sceneQuality'

export function RecyclingVortex({ scrollProgress, quality }: { scrollProgress: number; quality: SceneQuality }) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const time = quality.reducedMotion ? 0 : state.clock.elapsedTime
    
    if (groupRef.current) {
      const visibility = THREE.MathUtils.smoothstep(scrollProgress, sceneConfig.scroll.vortexFadeIn, sceneConfig.scroll.vortexFull)
      groupRef.current.scale.setScalar(visibility)
      groupRef.current.visible = visibility > 0.01
      groupRef.current.rotation.y = time * (quality.isMobile ? 0.22 : 0.42)
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = time * (quality.isMobile ? 0.6 : 1.15)
    }
  })

  return (
    <group ref={groupRef} position={[0, quality.isMobile ? 6.2 : 7.8, quality.isMobile ? -4 : -2.4]}>
      {/* Central Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[3, 0.08, 16, 100]} />
        <meshStandardMaterial 
          color="#FFD93D" 
          emissive="#FFFFFF" 
          emissiveIntensity={4} 
        />
      </mesh>

      {/* Orbiting Sparkles */}
      {[...Array(8)].map((_, i) => {
        const colors = ['#FF6B9D', '#60A5FA', '#4ECDC4', '#A78BFA', '#FB923C', '#FBBF24', '#67E8F9', '#F472B6']
        return (
          <group key={i} rotation={[0, (i / 8) * Math.PI * 2, 0]}>
            <mesh position={[3, Math.sin(i) * 0.5, 0]}>
              <octahedronGeometry args={[0.3, 0]} />
              <meshStandardMaterial 
                color={colors[i]} 
                emissive={colors[i]} 
                emissiveIntensity={2} 
                metalness={0.9} 
                roughness={0.1} 
              />
            </mesh>
          </group>
        )
      })}

      {/* Core Glow */}
      {!quality.isMobile && <pointLight intensity={15} color="#FFFFFF" distance={12} />}
    </group>
  )
}
