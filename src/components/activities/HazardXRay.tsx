import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { 
  Float, 
  Html, 
  PresentationControls, 
  RoundedBox,
  useCursor
} from '@react-three/drei'
import * as THREE from 'three'
import HUD from './shared/HUD'

const XRayShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#3b82f6') },
    uXRayProgress: { value: 0 },
  },
  vertexShader: `
    precision mediump float;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision mediump float;
    uniform vec3 uColor;
    uniform float uXRayProgress;
    varying vec3 vNormal;
    void main() {
      float fresnel = pow(1.0 - abs(vNormal.z), 3.0);
      float alpha = fresnel * uXRayProgress;
      gl_FragColor = vec4(uColor, alpha * 0.5);
    }
  `
}

interface Hazard {
  id: string
  name: string
  material: string
  description: string
  position: [number, number, number]
  color: string
}

const hazards: Hazard[] = [
  { 
    id: 'lead', 
    name: 'Lead Solder', 
    material: 'Lead (Pb)', 
    description: 'Found in circuit board soldering. Causes neurotoxicity.',
    position: [0, 0, 0],
    color: '#94a3b8'
  },
  { 
    id: 'mercury', 
    name: 'CCFL Backlight', 
    material: 'Mercury (Hg)', 
    description: 'Found in LCD backlights. Highly toxic to nervous systems.',
    position: [0, 0.5, 0.2],
    color: '#38bdf8'
  },
  { 
    id: 'cadmium', 
    name: 'Ni-Cd Battery', 
    material: 'Cadmium (Cd)', 
    description: 'Found in rechargeable batteries. Known carcinogen.',
    position: [-0.3, -0.5, 0],
    color: '#facc15'
  }
]

export default function HazardXRay() {
  const [xRayActive, setXRayActive] = useState(false)
  const [foundHazards, setFoundHazards] = useState<string[]>([])
  const [hovered, setHovered] = useState<string | null>(null)
  
  useCursor(!!hovered)

  const shaderRef = useRef<THREE.ShaderMaterial>(null)
  const score = foundHazards.length * 100

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime
      shaderRef.current.uniforms.uXRayProgress.value = THREE.MathUtils.lerp(
        shaderRef.current.uniforms.uXRayProgress.value,
        xRayActive ? 1 : 0,
        0.1
      )
    }
  })

  const toggleXRay = () => setXRayActive(!xRayActive)

  const handleHazardClick = (id: string) => {
    if (xRayActive && !foundHazards.includes(id)) {
      setFoundHazards([...foundHazards, id])
    }
  }

  return (
    <group>
      <HUD 
        title="Hazard Detection System"
        score={score}
        message={xRayActive ? "X-RAY ACTIVE: Identify Toxic Zones" : "Device Standby: Activate X-Ray"}
        hint={!xRayActive ? "Click the device shell to activate X-Ray scanner" : "Click the glowing hazardous components"}
      />

      <PresentationControls
        global
        snap
        rotation={[0, 0.3, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
      >
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          {/* Main Device Shell */}
          <mesh onClick={toggleXRay} onPointerOver={() => setHovered('shell')} onPointerOut={() => setHovered(null)}>
            <RoundedBox args={[2, 3, 0.5]} radius={0.1} smoothness={4}>
              <meshStandardMaterial 
                color="#1e293b" 
                metalness={0.8} 
                roughness={0.2} 
                transparent 
                opacity={xRayActive ? 0.2 : 1}
              />
            </RoundedBox>
            <mesh position={[0, 0, 0.01]}>
              <RoundedBox args={[1.9, 2.9, 0.51]} radius={0.1} smoothness={4}>
                <shaderMaterial attach="material" {...XRayShader} ref={shaderRef} transparent depthWrite={false} />
              </RoundedBox>
            </mesh>
          </mesh>

          {/* Internal Hazard Components */}
          {hazards.map((hazard) => (
            <group key={hazard.id} position={hazard.position} visible={xRayActive}>
              <mesh 
                onClick={() => handleHazardClick(hazard.id)}
                onPointerOver={() => setHovered(hazard.id)}
                onPointerOut={() => setHovered(null)}
              >
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial 
                  color={hazard.color} 
                  emissive={hazard.color}
                  emissiveIntensity={foundHazards.includes(hazard.id) ? 2 : 0.5}
                  transparent
                  opacity={0.8}
                />
                
                {foundHazards.includes(hazard.id) && (
                  <Html distanceFactor={5} position={[0.3, 0.3, 0]}>
                    <div className="bg-black/80 border border-white/20 p-3 rounded-lg backdrop-blur-md w-48 shadow-2xl pointer-events-none">
                      <p className="text-xs font-bold text-blue-400 uppercase tracking-tighter mb-1">{hazard.name}</p>
                      <p className="text-[10px] text-gray-300 leading-tight">{hazard.description}</p>
                    </div>
                  </Html>
                )}
              </mesh>
              
              <Html distanceFactor={7} position={[0, -0.3, 0]}>
                <div className="text-[8px] font-bold uppercase tracking-widest pointer-events-none" style={{ color: hazard.color }}>
                  {hazard.material}
                </div>
              </Html>
            </group>
          ))}

          {/* Decorative circuit pattern */}
          <mesh rotation={[0, 0, 0]} position={[0, 0, -0.2]}>
            <planeGeometry args={[1.8, 2.8]} />
            <meshStandardMaterial 
              color="#0f172a" 
              transparent 
              opacity={xRayActive ? 0.5 : 0} 
              wireframe
            />
          </mesh>
        </Float>
      </PresentationControls>

      {/* Completion Modal */}
      {foundHazards.length === hazards.length && (
        <Html fullscreen style={{ pointerEvents: 'none' }}>
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto">
            <div className="bg-gray-900 border border-green-500/30 p-8 rounded-2xl max-w-sm text-center shadow-[0_0_50px_rgba(34,197,94,0.2)]">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Analysis Complete</h3>
              <p className="text-gray-400 mb-6 italic text-sm">
                "Excellent work. You have identified the primary chemical threats. These toxins are now logged for safe extraction."
              </p>
              <button 
                onClick={() => {
                  setFoundHazards([])
                  setXRayActive(false)
                }}
                className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all uppercase tracking-widest text-xs"
              >
                Reset Simulation
              </button>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}
