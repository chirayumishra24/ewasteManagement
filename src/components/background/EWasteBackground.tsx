
import { Canvas } from '@react-three/fiber'
import { Suspense, lazy, useEffect, useState } from 'react'
import { SceneLighting } from './SceneLighting'
import { useScrollProgress } from './hooks/useScrollProgress'
import { usePointerParallax } from './hooks/usePointerParallax'
import type { SceneQuality } from './sceneQuality'
import type { ChapterThemeKey } from '../../courseData'
import { SceneErrorBoundary } from '../SceneStability'

import { getBiomeFromTheme } from './SceneLighting'

// Lazy load layers for performance
const ComicDebris = lazy(() => import('./layers/ComicDebris').then(m => ({ default: m.ComicDebris })))
const SpeedLines = lazy(() => import('./layers/SpeedLines').then(m => ({ default: m.SpeedLines })))

function getWebGLSupport() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

function getSceneQuality(): SceneQuality {
  if (typeof window === 'undefined') {
    return { isMobile: false, reducedMotion: false }
  }

  return {
    isMobile: window.matchMedia('(max-width: 780px), (pointer: coarse)').matches,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  }
}

interface EWasteBackgroundProps {
  theme?: ChapterThemeKey
  biome?: string;
}

export function EWasteBackground({ theme = 'hazard', biome }: EWasteBackgroundProps) {
  const scrollProgress = useScrollProgress()
  const [quality, setQuality] = useState<SceneQuality>(() => getSceneQuality())
  const [webGLSupported] = useState(() => {
    if (typeof document === 'undefined') return true
    return getWebGLSupport()
  })
  
  const parallax = usePointerParallax(
    quality.isMobile ? 0.025 : 0.06,
    0.045,
    !quality.isMobile && !quality.reducedMotion
  )

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobileQuery = window.matchMedia('(max-width: 780px), (pointer: coarse)')
    const updateQuality = () => setQuality(getSceneQuality())

    motionQuery.addEventListener('change', updateQuality)
    mobileQuery.addEventListener('change', updateQuality)
    window.addEventListener('resize', updateQuality)

    return () => {
      motionQuery.removeEventListener('change', updateQuality)
      mobileQuery.removeEventListener('change', updateQuality)
      window.removeEventListener('resize', updateQuality)
    }
  }, [])

  if (!webGLSupported) {
    return (
      <div className="ewaste-background ewaste-background-fallback" aria-hidden="true">
        <div className="fallback-grid" />
      </div>
    )
  }

  const biomeKey = biome || getBiomeFromTheme(theme)

  return (
    <div 
      className={`ewaste-background theme-${theme}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: 'transparent'
      }}
    >
      <SceneErrorBoundary fallback={<div className="fixed inset-0 bg-amber-50/50" style={{ zIndex: 0 }} />}>
        <Canvas
          shadows={false}
          dpr={[1, quality.isMobile ? 1.0 : 1.5]}
          camera={{
            position: [0, 0, 8],
            fov: 50
          }}
          gl={{ antialias: true, stencil: false, depth: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <group 
              rotation={[parallax.y, parallax.x, 0]}
              position={[0, 0, 0]}
            >
              <SceneLighting scrollProgress={scrollProgress} quality={quality} theme={theme} biome={biomeKey} />
              <ComicDebris />
              <SpeedLines />
            </group>
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  )
}

export default EWasteBackground
