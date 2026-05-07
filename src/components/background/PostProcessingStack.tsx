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
        luminanceThreshold={0.72}
        mipmapBlur 
        intensity={bloomBase + scrollProgress * 0.12}
        radius={quality.isMobile ? 0.28 : 0.42}
      />
      {quality.isMobile ? (
        <></>
      ) : (
        <DepthOfField focusDistance={0} focalLength={0.014} bokehScale={0.72} height={360} />
      )}
      <Noise opacity={sceneConfig.postprocessing.noiseOpacity} />
      <Vignette eskil={false} offset={0.2} darkness={sceneConfig.postprocessing.vignetteDarkness} />
    </EffectComposer>
  )
}
