import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { sceneConfig } from '../../../sceneConfig'
import type { SceneQuality } from '../sceneQuality'

function Ribbon({
  color,
  offset,
  scrollProgress,
  quality,
}: {
  color: string
  offset: number
  scrollProgress: number
  quality: SceneQuality
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const curve = useMemo(() => {
    const points = []
    for (let i = 0; i < 10; i++) {
      points.push(new THREE.Vector3(
        (i - 5) * 4,
        Math.sin(i * 0.8 + offset) * 2,
        Math.cos(i * 0.5 + offset) * 5
      ))
    }
    return new THREE.CatmullRomCurve3(points)
  }, [offset])

  useFrame((state) => {
    if (meshRef.current) {
      const t = quality.reducedMotion ? 0 : state.clock.elapsedTime * (quality.isMobile ? 0.24 : 0.42)
      meshRef.current.rotation.x = Math.sin(t + offset) * 0.1
      
      // Visibility control
      const visibility = THREE.MathUtils.smoothstep(scrollProgress, sceneConfig.scroll.ribbonFadeIn, sceneConfig.scroll.ribbonFull)
      meshRef.current.scale.setScalar(visibility)
      meshRef.current.visible = visibility > 0.01
    }
  })

  return (
    <mesh ref={meshRef}>
      <tubeGeometry args={[curve, 64, 0.05, 8, false]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={quality.isMobile ? 0.6 : 1.25} 
        transparent 
        opacity={quality.isMobile ? 0.42 : 0.7}
      />
    </mesh>
  )
}

export function SortingRibbons({ scrollProgress, quality }: { scrollProgress: number; quality: SceneQuality }) {
  return (
    <group position={[0, quality.isMobile ? 4.2 : 5, -5]}>
      <Ribbon color={sceneConfig.colors.ribbonMetal} offset={0} scrollProgress={scrollProgress} quality={quality} />
      <Ribbon color={sceneConfig.colors.ribbonPlastic} offset={Math.PI * 0.6} scrollProgress={scrollProgress} quality={quality} />
      <Ribbon color={sceneConfig.colors.ribbonGlass} offset={Math.PI * 1.2} scrollProgress={scrollProgress} quality={quality} />
    </group>
  )
}
