
import { Canvas } from '@react-three/fiber'
import { Suspense, lazy, useEffect, useState } from 'react'
import { sceneConfig } from '../../sceneConfig'
import { SceneLighting } from './SceneLighting'
import { useScrollProgress } from './hooks/useScrollProgress'
import { usePointerParallax } from './hooks/usePointerParallax'
import type { SceneQuality } from './sceneQuality'
import type { ChapterThemeKey } from '../../courseData'

// Lazy load layers for performance
const CircuitTerrain = lazy(() => import('./layers/CircuitTerrain').then(m => ({ default: m.CircuitTerrain })))
const DeviceGraveyard = lazy(() => import('./layers/DeviceGraveyard').then(m => ({ default: m.DeviceGraveyard })))
const ToxicParticles = lazy(() => import('./layers/ToxicParticles').then(m => ({ default: m.ToxicParticles })))
const ConveyorBelt = lazy(() => import('./layers/ConveyorBelt').then(m => ({ default: m.ConveyorBelt })))
const SortingRibbons = lazy(() => import('./layers/SortingRibbons').then(m => ({ default: m.SortingRibbons })))
const RecyclingVortex = lazy(() => import('./layers/RecyclingVortex').then(m => ({ default: m.RecyclingVortex })))
const PostProcessingStack = lazy(() => import('./PostProcessingStack').then(m => ({ default: m.PostProcessingStack })))

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
}

export function EWasteBackground({ theme = 'hazard' }: EWasteBackgroundProps) {
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
        <div className="fallback-conveyor" />
        <div className="fallback-vortex" />
      </div>
    )
  }

  return (
    <div 
      className={`ewaste-background theme-${theme}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: sceneConfig.colors.terrainBase
      }}
    >
      <Canvas
        shadows={!quality.isMobile && !quality.reducedMotion}
        dpr={[1, quality.isMobile ? sceneConfig.performance.mobileDpr : sceneConfig.performance.desktopDpr]}
        camera={{
          position: sceneConfig.camera.position,
          fov: sceneConfig.camera.fov
        }}
        gl={{ antialias: false, stencil: false, depth: true, powerPreference: quality.isMobile ? 'low-power' : 'high-performance' }}
      >
        <Suspense fallback={null}>
          <group 
            rotation={[parallax.y, parallax.x, 0]}
            position={[0, 0, 0]}
          >
            <SceneLighting scrollProgress={scrollProgress} quality={quality} theme={theme} />
            
            {(theme === 'diagnostic' || theme === 'mapping') && (
              <CircuitTerrain scrollProgress={scrollProgress} />
            )}
            
            {(theme === 'recycling' || theme === 'recovery') && (
              <>
                <ConveyorBelt scrollProgress={scrollProgress} quality={quality} />
                <RecyclingVortex scrollProgress={scrollProgress} quality={quality} />
              </>
            )}
            
            {theme === 'hazard' && (
              <>
                <DeviceGraveyard scrollProgress={scrollProgress} quality={quality} />
                <ToxicParticles scrollProgress={scrollProgress} quality={quality} />
              </>
            )}
            
            {theme === 'action' && (
              <SortingRibbons scrollProgress={scrollProgress} quality={quality} />
            )}
            
          </group>

          {!quality.reducedMotion && <PostProcessingStack scrollProgress={scrollProgress} quality={quality} />}
        </Suspense>
      </Canvas>
    </div>
  )
}

export default EWasteBackground
