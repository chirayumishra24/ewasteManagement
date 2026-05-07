import { useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { 
  Float, 
  Html, 
  PresentationControls, 
  RoundedBox,
  useCursor,
  Box
} from '@react-three/drei'
import * as THREE from 'three'
import HUD from './shared/HUD'

interface RecoveredItem {
  id: number
  type: 'gold' | 'silver' | 'copper'
  position: [number, number, number]
  velocity: [number, number, number]
  color: string
}

const DEVICE_TYPES = [
  { name: 'Smartphone', gold: 0.03, silver: 0.35, copper: 6, value: 1.5, color: '#1e293b' },
  { name: 'Laptop', gold: 0.2, silver: 2, copper: 50, value: 12, color: '#334155' },
  { name: 'Tablet', gold: 0.1, silver: 0.8, copper: 20, value: 5, color: '#475569' },
]

export default function UrbanMineValuator() {
  const [processedCount, setProcessedCount] = useState(0)
  const [totalValue, setTotalValue] = useState(0)
  const [particles, setParticles] = useState<RecoveredItem[]>([])
  const [devices, setDevices] = useState<{ id: number, typeIndex: number, progress: number, active: boolean }[]>([])
  const [hovered, setHovered] = useState<number | null>(null)

  const beltRef = useRef<THREE.Mesh>(null)
  const nextDeviceId = useRef(0)
  const nextParticleId = useRef(0)

  useCursor(hovered !== null)

  // Spawn devices
  useEffect(() => {
    const interval = setInterval(() => {
      if (devices.length < 5) {
        setDevices(prev => [
          ...prev, 
          { id: nextDeviceId.current++, typeIndex: Math.floor(Math.random() * DEVICE_TYPES.length), progress: -5, active: true }
        ])
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [devices.length])

  useFrame((_, delta) => {
    // Animate belt texture
    if (beltRef.current) {
      (beltRef.current.material as THREE.MeshStandardMaterial).map!.offset.y -= delta * 0.5
    }

    // Move devices
    setDevices(prev => prev.map(d => ({
      ...d,
      progress: d.progress + delta * 2
    })).filter(d => d.progress < 10))

    // Animate particles
    if (particles.length > 0) {
      setParticles(prev => prev.map(p => ({
        ...p,
        position: [
          p.position[0] + p.velocity[0] * delta,
          p.position[1] + p.velocity[1] * delta,
          p.position[2] + p.velocity[2] * delta
        ] as [number, number, number],
        velocity: [p.velocity[0], p.velocity[1] - 9.8 * delta, p.velocity[2]] as [number, number, number]
      })).filter(p => p.position[1] > -2))
    }
  })

  const processDevice = (id: number, typeIndex: number, pos: [number, number, number]) => {
    const type = DEVICE_TYPES[typeIndex]
    setDevices(prev => prev.filter(d => d.id !== id))
    setProcessedCount(prev => prev + 1)
    setTotalValue(prev => prev + type.value)

    // Create explosion of particles
    const newParticles: RecoveredItem[] = []
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 3
      newParticles.push({
        id: nextParticleId.current++,
        type: Math.random() > 0.8 ? 'gold' : (Math.random() > 0.5 ? 'silver' : 'copper'),
        position: pos,
        velocity: [Math.cos(angle) * speed, 5 + Math.random() * 5, Math.sin(angle) * speed],
        color: Math.random() > 0.8 ? '#fbbf24' : (Math.random() > 0.5 ? '#e2e8f0' : '#ea580c')
      })
    }
    setParticles(prev => [...prev, ...newParticles])
  }

  return (
    <>
      <color attach="background" args={['#030712']} />

      <HUD 
        title="Urban Mine Extraction"
        score={Math.floor(totalValue * 100)}
        message={`Processed: ${processedCount} | Value Recovered: $${totalValue.toFixed(2)}`}
        hint="Click devices on the conveyor belt to extract precious metals"
      />

      <Html fullscreen style={{ pointerEvents: 'none' }}>
        <div className="absolute left-6 bottom-6 flex flex-col gap-3 pointer-events-none">
          <ExtractionVat label="Gold" color="bg-amber-400" count={processedCount * 0.05} unit="g" />
          <ExtractionVat label="Silver" color="bg-slate-300" count={processedCount * 0.4} unit="g" />
          <ExtractionVat label="Copper" color="bg-orange-600" count={processedCount * 15} unit="g" />
        </div>
      </Html>

      <PresentationControls
        global
        rotation={[0.4, -0.4, 0]}
        polar={[-Math.PI / 4, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <group position={[0, -1, 0]}>
            {/* Conveyor Belt */}
            <mesh ref={beltRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[4, 20]} />
              <meshStandardMaterial 
                color="#111827" 
                metalness={0.8} 
                roughness={0.2}
                map={(() => {
                  const canvas = document.createElement('canvas')
                  canvas.width = 64
                  canvas.height = 64
                  const ctx = canvas.getContext('2d')!
                  ctx.fillStyle = '#111827'
                  ctx.fillRect(0, 0, 64, 64)
                  ctx.strokeStyle = '#374151'
                  ctx.lineWidth = 4
                  ctx.beginPath()
                  ctx.moveTo(0, 32)
                  ctx.lineTo(64, 32)
                  ctx.stroke()
                  const tex = new THREE.CanvasTexture(canvas)
                  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
                  tex.repeat.set(1, 10)
                  return tex
                })()}
              />
            </mesh>

            {/* Industrial Railings */}
            <Box args={[0.1, 0.4, 20]} position={[2, 0.2, 0]}>
              <meshStandardMaterial color="#1f2937" metalness={0.9} />
            </Box>
            <Box args={[0.1, 0.4, 20]} position={[-2, 0.2, 0]}>
              <meshStandardMaterial color="#1f2937" metalness={0.9} />
            </Box>

            {/* Devices on Belt */}
            {devices.map((device) => {
              const type = DEVICE_TYPES[device.typeIndex]
              const pos: [number, number, number] = [0, 0.3, -device.progress]
              return (
                <Float 
                  key={device.id} 
                  speed={2} 
                  rotationIntensity={0.5} 
                  floatIntensity={0.5} 
                  position={pos}
                >
                  <mesh 
                    onClick={() => processDevice(device.id, device.typeIndex, pos)}
                    onPointerOver={() => setHovered(device.id)}
                    onPointerOut={() => setHovered(null)}
                  >
                    <RoundedBox args={[1.2, 0.2, 1.8]} radius={0.05} smoothness={4}>
                      <meshStandardMaterial 
                        color={type.color} 
                        metalness={0.6} 
                        roughness={0.3}
                        emissive={hovered === device.id ? '#3b82f6' : '#000'}
                        emissiveIntensity={hovered === device.id ? 0.3 : 0}
                      />
                    </RoundedBox>
                    <Html distanceFactor={5} position={[0, 0.5, 0]}>
                      <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[8px] text-white whitespace-nowrap uppercase tracking-widest border border-white/10">
                        {type.name}
                      </div>
                    </Html>
                  </mesh>
                </Float>
              )
            })}

            {/* Particles */}
            {particles.map((p) => (
              <mesh key={p.id} position={p.position}>
                <boxGeometry args={[0.05, 0.05, 0.05]} />
                <meshStandardMaterial 
                  color={p.color} 
                  emissive={p.color} 
                  emissiveIntensity={1} 
                />
              </mesh>
            ))}

            {/* Processing Unit (Static) */}
            <group position={[0, 0.5, 8]}>
              <Box args={[4.2, 2, 2]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#111827" metalness={0.9} />
              </Box>
              <mesh position={[0, 0, -1.1]}>
                <planeGeometry args={[3.8, 1.8]} />
                <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} transparent opacity={0.2} />
              </mesh>
            </group>
        </group>
      </PresentationControls>
    </>
  )
}

function ExtractionVat({ label, color, count, unit }: any) {
  return (
    <div className="bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-xl w-32">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">{label}</span>
        <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_rgba(255,255,255,0.2)]`} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-mono font-bold text-white">{count.toFixed(2)}</span>
        <span className="text-[9px] text-gray-500 font-bold">{unit}</span>
      </div>
      <div className="w-full h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500`} 
          style={{ width: `${Math.min(100, count * 5)}%` }} 
        />
      </div>
    </div>
  )
}
