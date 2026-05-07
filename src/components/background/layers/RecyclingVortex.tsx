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
        <torusGeometry args={[3, 0.05, 16, 100]} />
        <meshStandardMaterial 
          color={sceneConfig.colors.vortexRing} 
          emissive={sceneConfig.colors.vortexGlow} 
          emissiveIntensity={5} 
        />
      </mesh>

      {/* Orbiting Cubes */}
      {[...Array(6)].map((_, i) => (
        <group key={i} rotation={[0, (i / 6) * Math.PI * 2, 0]}>
          <mesh position={[3, 0, 0]}>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="#fffaf1" metalness={0.72} roughness={0.18} />
          </mesh>
        </group>
      ))}

      {/* Core Glow */}
      {!quality.isMobile && <pointLight intensity={10} color={sceneConfig.colors.vortexGlow} distance={10} />}
    </group>
  )
}
