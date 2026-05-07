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
    terrainBase: '#f7ecd7',
    terrainTrace: '#2f9f88',
    terrainVia: '#c77f35',

    // Devices
    deviceBody: '#cbd4d4',
    deviceScreen: '#db6d3f',
    deviceMetal: '#6f8188',

    // Particles
    hazeStart: '#fff8ed',
    hazeEnd: '#eef8ed',
    spark: '#d99b38',

    // Ribbons
    ribbonMetal: '#c99328',
    ribbonPlastic: '#6ea2b4',
    ribbonGlass: '#f6fbf8',

    // Vortex
    vortexRing: '#d96f3a',
    vortexGlow: '#f0c77a',

    // Atmosphere
    fogNear: '#fff5e8',
    fogFar: '#f8ead7',
    skyGradientTop: '#fffaf1',
    skyGradientBottom: '#f4e8d2',
    // Conveyor Station Colors
    stationCollection: '#5d8ea0',
    stationSorting: '#d9a129',
    stationRecycling: '#2f9f88',
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
    desktopBloom: 0.28,
    mobileBloom: 0.12,
    reducedMotionBloom: 0.06,
    noiseOpacity: 0.012,
    vignetteDarkness: 0.26,
  },
}
