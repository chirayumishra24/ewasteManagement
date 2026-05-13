import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import { sceneConfig } from '../../sceneConfig'
import type { SceneQuality } from './sceneQuality'

export function PostProcessingStack({
  scrollProgress,
  quality,
}: {
  scrollProgress: number
  quality: SceneQuality
}) {
  const bloomBase = quality.isMobile
    ? sceneConfig.postprocessing.mobileBloom
    : sceneConfig.postprocessing.desktopBloom

  return (
    <EffectComposer multisampling={quality.isMobile ? 0 : 2}>
      <Bloom 
        luminanceThreshold={0.8}
        mipmapBlur 
        intensity={bloomBase + scrollProgress * 0.15}
        radius={quality.isMobile ? 0.35 : 0.5}
      />
      {quality.isMobile ? (
        <></>
      ) : (
        <DepthOfField focusDistance={0.02} focalLength={0.01} bokehScale={1.5} height={480} />
      )}
      <Noise opacity={0} />
      <Vignette eskil={false} offset={0.15} darkness={0.2} />
    </EffectComposer>
  )
}
