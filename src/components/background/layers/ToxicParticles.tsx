import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sceneConfig } from '../../../sceneConfig'
import type { SceneQuality } from '../sceneQuality'
import { deterministicRandom } from '../deterministicRandom'

export function ToxicParticles({ scrollProgress, quality }: { scrollProgress: number; quality: SceneQuality }) {
  const hazeRef = useRef<THREE.Points>(null)
  const sparksRef = useRef<THREE.Points>(null)

  const hazeCount = quality.isMobile ? sceneConfig.performance.mobileParticleCount : sceneConfig.performance.desktopParticleCount
  const sparksCount = quality.isMobile ? sceneConfig.performance.mobileSparkCount : sceneConfig.performance.desktopSparkCount

  const [hazePositions, sparksPositions] = useMemo(() => {
    const hp = new Float32Array(hazeCount * 3)
    const sp = new Float32Array(sparksCount * 3)

    for (let i = 0; i < hazeCount; i++) {
      hp[i * 3] = (deterministicRandom(i + 10.1) - 0.5) * 40
      hp[i * 3 + 1] = deterministicRandom(i + 10.2) * 20 - 5
      hp[i * 3 + 2] = (deterministicRandom(i + 10.3) - 0.5) * 30
    }

    for (let i = 0; i < sparksCount; i++) {
      sp[i * 3] = (deterministicRandom(i + 20.1) - 0.5) * 20
      sp[i * 3 + 1] = deterministicRandom(i + 20.2) * 10 - 2
      sp[i * 3 + 2] = (deterministicRandom(i + 20.3) - 0.5) * 15
    }

    return [hp, sp]
  }, [hazeCount, sparksCount])

  useFrame((state) => {
    const time = quality.reducedMotion ? 0 : state.clock.elapsedTime
    
    if (hazeRef.current) {
      hazeRef.current.rotation.y = time * 0.02
      hazeRef.current.position.y = Math.sin(time * 0.1) * 0.5
    }

    if (sparksRef.current) {
      const positions = sparksRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < sparksCount; i++) {
        // Upward movement
        positions[i * 3 + 1] += (quality.reducedMotion ? 0.004 : 0.018) * (1 - scrollProgress + 0.1)
        if (positions[i * 3 + 1] > 10) positions[i * 3 + 1] = -2
      }
      sparksRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group>
      {/* Toxic Haze */}
      <points ref={hazeRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={hazeCount}
            array={hazePositions}
            itemSize={3}
            args={[hazePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.8}
          color={new THREE.Color(sceneConfig.colors.hazeStart).lerp(new THREE.Color(sceneConfig.colors.hazeEnd), scrollProgress)}
          transparent
          opacity={(quality.isMobile ? 0.14 : 0.18) * (1 - scrollProgress)}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Sparks */}
      <points ref={sparksRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={sparksCount}
            array={sparksPositions}
            itemSize={3}
            args={[sparksPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color={sceneConfig.colors.spark}
          transparent
          opacity={(quality.isMobile ? 0.28 : 0.46) * (1 - scrollProgress)}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}
