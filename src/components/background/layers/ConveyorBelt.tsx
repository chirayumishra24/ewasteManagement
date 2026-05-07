import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { ShaderMaterial, Group, Mesh, InstancedMesh, Object3D } from 'three'
import { sceneConfig } from '../../../sceneConfig'
import type { SceneQuality } from '../sceneQuality'

const beltVertexShader = `
  precision mediump float;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const beltFragmentShader = `
  precision mediump float;
  uniform float uTime;
  uniform float uScroll;
  varying vec2 vUv;

  void main() {
    // Chevron pattern
    vec2 uv = vUv;
    uv.x *= 8.0; // Repeat along length
    
    // Animate UV based on scroll and time
    float move = uScroll * 10.0 + uTime * 0.2;
    uv.x += move;
    
    float chevron = step(0.5, fract(uv.x + abs(uv.y - 0.5)));
    
    vec3 baseColor = vec3(0.82, 0.79, 0.72);
    vec3 accentColor = vec3(0.68, 0.64, 0.58);
    vec3 highlight = vec3(0.95, 0.48, 0.23) * 0.22;
    
    float edge = smoothstep(0.02, 0.0, abs(vUv.y - 0.5) - 0.48);
    float glow = smoothstep(0.4, 0.5, chevron) * edge * 0.2;
    
    vec3 finalColor = mix(baseColor, accentColor, chevron) + highlight * glow;
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

export function ConveyorBelt({ scrollProgress, quality }: { scrollProgress: number; quality: SceneQuality }) {
  const groupRef = useRef<Group>(null)
  const beltMaterialRef = useRef<ShaderMaterial>(null)
  const rollerRefs = useRef<Mesh[]>([])

  // Setup items for the belt
  const itemCount = quality.isMobile ? Math.ceil(sceneConfig.conveyor.itemCount * 0.58) : sceneConfig.conveyor.itemCount
  const itemMeshRef = useRef<InstancedMesh>(null)
  const tempObject = useMemo(() => new Object3D(), [])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    
    if (beltMaterialRef.current) {
      beltMaterialRef.current.uniforms.uTime.value = time
      beltMaterialRef.current.uniforms.uScroll.value = scrollProgress
    }

    // Rotate rollers
    rollerRefs.current.forEach((roller) => {
      if (roller) {
        roller.rotation.x = time * 2 + scrollProgress * 20
      }
    })

    // Update items on belt
    if (itemMeshRef.current) {
      for (let i = 0; i < itemCount; i++) {
        const spacing = sceneConfig.conveyor.beltLength / itemCount
        const xBase = -sceneConfig.conveyor.beltLength / 2 + (i * spacing)
        const xOffset = (scrollProgress * 40 + time * sceneConfig.conveyor.beltSpeed * 2.6) % sceneConfig.conveyor.beltLength
        let xPos = xBase + xOffset
        if (xPos > sceneConfig.conveyor.beltLength / 2) xPos -= sceneConfig.conveyor.beltLength

        tempObject.position.set(xPos, 0.3, 0)
        tempObject.rotation.set(Math.sin(time + i) * 0.2, time * 0.5, 0)
        tempObject.scale.setScalar(0.4 + Math.sin(i) * 0.1)
        tempObject.updateMatrix()
        itemMeshRef.current.setMatrixAt(i, tempObject.matrix)
      }
      itemMeshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef} position={[0, -1.8, 0]}>
      {/* Main Belt Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[sceneConfig.conveyor.beltLength, sceneConfig.conveyor.beltWidth]} />
        <shaderMaterial
          ref={beltMaterialRef}
          vertexShader={beltVertexShader}
          fragmentShader={beltFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uScroll: { value: 0 },
          }}
        />
      </mesh>

      {/* Side Rails */}
      <mesh position={[0, 0.1, sceneConfig.conveyor.beltWidth / 2 + 0.1]}>
        <boxGeometry args={[sceneConfig.conveyor.beltLength, 0.4, 0.1]} />
        <meshStandardMaterial color="#8b949a" metalness={0.75} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.1, -sceneConfig.conveyor.beltWidth / 2 - 0.1]}>
        <boxGeometry args={[sceneConfig.conveyor.beltLength, 0.4, 0.1]} />
        <meshStandardMaterial color="#8b949a" metalness={0.75} roughness={0.28} />
      </mesh>

      {/* Rollers */}
      {[-sceneConfig.conveyor.beltLength / 2, 0, sceneConfig.conveyor.beltLength / 2].map((x, i) => (
        <mesh 
          key={i} 
          position={[x, -0.1, 0]} 
          rotation={[Math.PI / 2, 0, 0]} 
          ref={(el) => { if (el) rollerRefs.current[i] = el }}
        >
          <cylinderGeometry args={[0.3, 0.3, sceneConfig.conveyor.beltWidth + 0.4, 16]} />
          <meshStandardMaterial color="#707d86" metalness={0.92} roughness={0.18} />
        </mesh>
      ))}

      {/* Station Indicators */}
      {sceneConfig.conveyor.stationPositions.map((pos, i) => {
        const colors = [
          sceneConfig.colors.stationCollection,
          sceneConfig.colors.stationSorting,
          sceneConfig.colors.stationRecycling
        ]
        return (
          <group key={i} position={[pos, 0.5, -sceneConfig.conveyor.beltWidth / 2 - 0.8]}>
            <mesh>
              <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
              <meshStandardMaterial color="#707d86" />
            </mesh>
            <mesh position={[0, 0.6, 0]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial 
                color={colors[i]} 
                emissive={colors[i]} 
                emissiveIntensity={2} 
              />
            </mesh>
            {!quality.isMobile && <pointLight position={[0, 0.6, 0]} color={colors[i]} intensity={0.38} distance={3} />}
          </group>
        )
      })}

      {/* Items on belt */}
      <instancedMesh ref={itemMeshRef} args={[undefined, undefined, itemCount]}>
        <boxGeometry args={[1, 0.5, 0.8]} />
        <meshStandardMaterial color="#c6cdd1" metalness={0.5} roughness={0.42} />
      </instancedMesh>
    </group>
  )
}
