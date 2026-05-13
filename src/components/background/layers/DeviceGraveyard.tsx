import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, InstancedMesh, Object3D, MathUtils } from 'three'
import { sceneConfig } from '../../../sceneConfig'
import type { SceneQuality } from '../sceneQuality'
import { deterministicRandom } from '../deterministicRandom'

const tempObject = new Object3D()
const tempColor = new Color()

type GraveyardDevice = {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  speed: number
  offset: number
}

export function DeviceGraveyard({ scrollProgress, quality }: { scrollProgress: number; quality: SceneQuality }) {
  const phoneRef = useRef<InstancedMesh>(null)
  const monitorRef = useRef<InstancedMesh>(null)
  const pcbRef = useRef<InstancedMesh>(null)

  const count = quality.isMobile ? sceneConfig.performance.mobileDeviceCount : sceneConfig.performance.desktopDeviceCount
  const particles = useMemo(() => {
    const data: GraveyardDevice[] = []
    for (let i = 0; i < count; i++) {
      const seed = i + 1
      const isLarge = deterministicRandom(seed + 0.1) > 0.8
      const side = deterministicRandom(seed + 0.2) > 0.5 ? 1 : -1
      data.push({
        position: [
          (deterministicRandom(seed + 0.3) - 0.5) * 30,
          -1.5, // Near factory floor
          side * (sceneConfig.conveyor.beltWidth / 2 + 2 + deterministicRandom(seed + 0.4) * 5) // To the sides of the belt
        ],
        rotation: [
          deterministicRandom(seed + 0.5) * Math.PI,
          deterministicRandom(seed + 0.6) * Math.PI,
          deterministicRandom(seed + 0.7) * Math.PI
        ],
        scale: isLarge ? 1.2 + deterministicRandom(seed + 0.8) * 0.8 : 0.3 + deterministicRandom(seed + 0.9) * 0.4,
        speed: 0.1 + deterministicRandom(seed + 1) * 0.2,
        offset: deterministicRandom(seed + 1.1) * Math.PI * 2,
      })
    }
    return data
  }, [count])

  useFrame((state) => {
    const time = quality.reducedMotion ? 0 : state.clock.elapsedTime
    
    // Smoothly lift devices as user scrolls
    const lift = MathUtils.smoothstep(scrollProgress, sceneConfig.scroll.deviceLiftStart, sceneConfig.scroll.deviceLiftEnd) * 15

    const updateInstances = (ref: React.RefObject<InstancedMesh | null>) => {
      if (!ref.current) return
      for (let i = 0; i < count; i++) {
        const p = particles[i]
        
        const x = p.position[0]
        const y = p.position[1] + lift + Math.sin(time * p.speed + p.offset) * (quality.reducedMotion ? 0.04 : 0.2)
        const z = p.position[2]
        
        tempObject.position.set(x, y, z)
        tempObject.rotation.set(
          p.rotation[0] + time * 0.1,
          p.rotation[1] + time * 0.05,
          p.rotation[2]
        )
        tempObject.scale.setScalar(p.scale)
        tempObject.updateMatrix()
        ref.current.setMatrixAt(i, tempObject.matrix)
        
        // Glow effect
        const pulse = Math.sin(time * 2 + p.offset) * 0.5 + 0.5
        const baseColor = new Color(sceneConfig.colors.deviceBody)
        tempColor.set(baseColor).lerp(new Color(sceneConfig.colors.deviceScreen), pulse * 0.2)
        ref.current.setColorAt(i, tempColor)
      }
      ref.current.instanceMatrix.needsUpdate = true
      if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
    }

    updateInstances(phoneRef)
    updateInstances(monitorRef)
    updateInstances(pcbRef)
  })

  return (
    <group>
      {/* Phones */}
      <instancedMesh 
        ref={phoneRef} 
        args={[undefined, undefined, count]} 
        castShadow
      >
        <boxGeometry args={[0.5, 0.9, 0.08]} />
        <meshStandardMaterial color="#FF6B9D" roughness={0.4} metalness={0.2} />
      </instancedMesh>

      {/* Monitors */}
      <instancedMesh 
        ref={monitorRef} 
        args={[undefined, undefined, count]} 
        castShadow
      >
        <boxGeometry args={[1.2, 0.8, 0.15]} />
        <meshStandardMaterial color="#60A5FA" roughness={0.4} metalness={0.2} />
      </instancedMesh>

      {/* PCBs */}
      <instancedMesh 
        ref={pcbRef} 
        args={[undefined, undefined, count]} 
        castShadow
      >
        <boxGeometry args={[0.7, 0.7, 0.04]} />
        <meshStandardMaterial color="#A78BFA" roughness={0.4} metalness={0.2} />
      </instancedMesh>
    </group>
  )
}
