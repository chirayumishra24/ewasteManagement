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
    // Terrain
    terrainBase: '#091522',
    terrainTrace: '#2bc1a6',
    terrainVia: '#f3a44a',

    // Devices
    deviceBody: '#9fb0ba',
    deviceScreen: '#ff7f5e',
    deviceMetal: '#5f7386',

    // Particles
    hazeStart: '#07111b',
    hazeEnd: '#112437',
    spark: '#ffc26a',

    // Ribbons
    ribbonMetal: '#f3a44a',
    ribbonPlastic: '#61b8ff',
    ribbonGlass: '#d8e6f0',

    // Vortex
    vortexRing: '#ff7f5e',
    vortexGlow: '#ffd48a',

    // Atmosphere
    fogNear: '#07111b',
    fogFar: '#0d1c2d',
    skyGradientTop: '#08111b',
    skyGradientBottom: '#112236',
    // Conveyor Station Colors
    stationCollection: '#61b8ff',
    stationSorting: '#f3a44a',
    stationRecycling: '#2bc1a6',
  },
  camera: {
    position: [0, 7.4, 19.5],
    fov: 30,
  },
  conveyor: {
    beltSpeed: 0.24,
    beltWidth: 4.4,
    beltLength: 42,
    itemCount: 14,
    stationPositions: [-12, 0, 12], // Collection, Sorting, Recycling
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
    desktopParticleCount: 220,
    mobileParticleCount: 72,
    desktopSparkCount: 72,
    mobileSparkCount: 24,
    desktopDpr: 1.5,
    mobileDpr: 1,
    desktopDeviceCount: 18,
    mobileDeviceCount: 8,
  },
  postprocessing: {
    desktopBloom: 0.36,
    mobileBloom: 0.18,
    reducedMotionBloom: 0.08,
    noiseOpacity: 0.018,
    vignetteDarkness: 0.34,
  },
}
