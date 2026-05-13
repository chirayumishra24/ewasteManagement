export type SceneConfig = {
  colors: {
    // Terrain
    terrainBase: string
    terrainTrace: string
    terrainVia: string

    // Devices
    deviceBody: string
    deviceScreen: string
    deviceMetal: string

    // Particles
    hazeStart: string
    hazeEnd: string
    spark: string

    // Ribbons
    ribbonMetal: string
    ribbonPlastic: string
    ribbonGlass: string

    // Vortex
    vortexRing: string
    vortexGlow: string

    // Atmosphere
    fogNear: string
    fogFar: string
    skyGradientTop: string
    skyGradientBottom: string

    // Conveyor Station Colors
    stationCollection: string
    stationSorting: string
    stationRecycling: string
  }
  camera: {
    position: [number, number, number]
    fov: number
  }
  conveyor: {
    beltSpeed: number
    beltWidth: number
    beltLength: number
    itemCount: number
    stationPositions: [number, number, number]
  }
  scroll: {
    deviceLiftStart: number
    deviceLiftEnd: number
    ribbonFadeIn: number
    ribbonFull: number
    vortexFadeIn: number
    vortexFull: number
  }
  performance: {
    desktopParticleCount: number
    mobileParticleCount: number
    desktopSparkCount: number
    mobileSparkCount: number
    desktopDpr: number
    mobileDpr: number
    desktopDeviceCount: number
    mobileDeviceCount: number
  }
  postprocessing: {
    desktopBloom: number
    mobileBloom: number
    reducedMotionBloom: number
    noiseOpacity: number
    vignetteDarkness: number
  }
}

export const sceneConfig: SceneConfig = {
  colors: {
    // Terrain (Lighter/Greener)
    terrainBase: '#E8F5E9',
    terrainTrace: '#4ECDC4',
    terrainVia: '#FFD93D',

    // Devices (Cleaner/Whiter)
    deviceBody: '#FFFFFF',
    deviceScreen: '#60A5FA',
    deviceMetal: '#A78BFA',

    // Particles (Playful)
    hazeStart: '#F8FAFF',
    hazeEnd: '#EDE7F6',
    spark: '#FFD93D',

    // Ribbons (Pastels)
    ribbonMetal: '#FF6B9D',
    ribbonPlastic: '#60A5FA',
    ribbonGlass: '#4ECDC4',

    // Vortex (Bright)
    vortexRing: '#FFD93D',
    vortexGlow: '#FFFFFF',

    // Atmosphere (Sky Blue)
    fogNear: '#E3F2FD',
    fogFar: '#BBDEFB',
    skyGradientTop: '#E3F2FD',
    skyGradientBottom: '#BBDEFB',

    // Conveyor Station Colors (Bright)
    stationCollection: '#FF6B9D',
    stationSorting: '#FFD93D',
    stationRecycling: '#4ECDC4',
  },
  camera: {
    position: [0, 8.5, 24],
    fov: 38,
  },
  conveyor: {
    beltSpeed: 0.18,
    beltWidth: 4.4,
    beltLength: 42,
    itemCount: 12,
    stationPositions: [-12, 0, 12],
  },
  scroll: {
    deviceLiftStart: 0.1,
    deviceLiftEnd: 0.42,
    ribbonFadeIn: 0.28,
    ribbonFull: 0.58,
    vortexFadeIn: 0.58,
    vortexFull: 0.84,
  },
  performance: {
    desktopParticleCount: 180,
    mobileParticleCount: 60,
    desktopSparkCount: 60,
    mobileSparkCount: 20,
    desktopDpr: 1.5,
    mobileDpr: 1,
    desktopDeviceCount: 16,
    mobileDeviceCount: 8,
  },
  postprocessing: {
    desktopBloom: 0.4,
    mobileBloom: 0.2,
    reducedMotionBloom: 0.1,
    noiseOpacity: 0.0,
    vignetteDarkness: 0.15,
  },
}
