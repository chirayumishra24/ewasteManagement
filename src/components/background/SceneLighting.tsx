import { Environment, Lightformer } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Color, Fog } from 'three'
import { sceneConfig } from '../../sceneConfig'
import type { SceneQuality } from './sceneQuality'

export function SceneLighting({ scrollProgress, quality }: { scrollProgress: number; quality: SceneQuality }) {
  const fogRef = useRef<Fog | null>(null)
  const motionFactor = quality.reducedMotion ? 0.35 : 1

  useFrame(() => {
    if (fogRef.current) {
      // Shift fog color from toxic dark to clean white
      const fogColor = new Color(sceneConfig.colors.fogNear).lerp(
        new Color(sceneConfig.colors.fogFar),
        scrollProgress
      )
      fogRef.current.color.copy(fogColor)
    }
  })

  return (
    <>
      <color attach="background" args={[sceneConfig.colors.skyGradientTop]} />
      <fog ref={fogRef} attach="fog" args={[sceneConfig.colors.fogNear, 5, 35]} />

      <hemisphereLight
        intensity={0.56 + scrollProgress * 0.46}
        color={sceneConfig.colors.hazeEnd}
        groundColor={sceneConfig.colors.terrainBase}
      />
      
      <directionalLight
        position={[10, 15, 5]}
        intensity={(1.75 + scrollProgress * 1.55) * motionFactor}
        color="#ffffff"
        castShadow={!quality.isMobile && !quality.reducedMotion}
        shadow-mapSize={quality.isMobile ? [512, 512] : [1536, 1536]}
      />

      <spotLight
        position={[-10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={quality.isMobile ? 0 : 7 * (1 - scrollProgress + 0.25) * motionFactor}
        color={sceneConfig.colors.terrainTrace}
        castShadow={!quality.isMobile && !quality.reducedMotion}
      />

      <Environment resolution={quality.isMobile ? 64 : 128}>
        <Lightformer
          form="rect"
          intensity={quality.isMobile ? 1.4 : 3}
          position={[0, 10, -10]}
          scale={[20, 5, 1]}
          color={sceneConfig.colors.vortexGlow}
        />
        <Lightformer
          form="circle"
          intensity={quality.isMobile ? 0.8 : 1.6}
          position={[-10, 5, 5]}
          scale={[10, 10, 1]}
          color={sceneConfig.colors.deviceScreen}
        />
      </Environment>
    </>
  )
}
