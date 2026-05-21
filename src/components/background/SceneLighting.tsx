
import { Environment, Lightformer } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import { Color, Fog } from 'three'
import { sceneConfig } from '../../sceneConfig'
import type { SceneQuality } from './sceneQuality'
import type { ChapterThemeKey } from '../../courseData'


export function getBiomeFromTheme(theme: ChapterThemeKey): string {
  switch (theme) {
    case 'hub':
      return 'urban'
    case 'hazard':
    case 'toxic':
      return 'desert'
    case 'diagnostic':
    case 'privacy':
      return 'arctic'
    case 'recovery':
    case 'maintenance':
      return 'forest'
    case 'upcycle':
    case 'digital':
      return 'urban'
    case 'recycling':
      return 'volcanic'
    case 'mapping':
      return 'coral'
    case 'action':
    case 'policy':
    default:
      return 'ocean'
  }
}

export function SceneLighting({ 
  scrollProgress, 
  quality, 
  theme = 'hazard',
  biome
}: { 
  scrollProgress: number; 
  quality: SceneQuality;
  theme?: ChapterThemeKey;
  biome?: string;
}) {
  const fogRef = useRef<Fog | null>(null)
  const motionFactor = quality.reducedMotion ? 0.35 : 1
  
  const biomeKey = useMemo(() => biome || getBiomeFromTheme(theme), [biome, theme])
  const biomeConf = useMemo(() => {
    return sceneConfig.biomes[biomeKey as keyof typeof sceneConfig.biomes] || sceneConfig.biomes.ocean
  }, [biomeKey])

  const accentColor = useMemo(() => new Color(biomeConf.skyTop), [biomeConf])

  useFrame(() => {
    if (fogRef.current) {
      // Shift fog color from biome-tinted dark to horizon color
      const fogColor = new Color(biomeConf.fogNear)
        .lerp(accentColor, 0.15)
        .lerp(new Color(biomeConf.skyTop), scrollProgress)
      fogRef.current.color.copy(fogColor)
    }
  })

  return (
    <>
      <fog ref={fogRef} attach="fog" args={[biomeConf.fogNear, 5, 45]} />

      <hemisphereLight
        intensity={0.56 + scrollProgress * 0.46}
        color={biomeConf.skyTop}
        groundColor={biomeConf.terrain}
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
        color={biomeConf.skyTop}
        castShadow={!quality.isMobile && !quality.reducedMotion}
      />

      <Environment resolution={quality.isMobile ? 64 : 128}>
        <Lightformer
          form="rect"
          intensity={quality.isMobile ? 1.4 : 3}
          position={[0, 10, -10]}
          scale={[20, 5, 1]}
          color={biomeConf.skyTop}
        />
        <Lightformer
          form="circle"
          intensity={quality.isMobile ? 0.8 : 1.6}
          position={[-10, 5, 5]}
          scale={[10, 10, 1]}
          color={biomeConf.skyTop}
        />
      </Environment>
    </>
  )
}
