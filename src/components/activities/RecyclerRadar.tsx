import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { 
  Html, 
  PresentationControls, 
  useCursor,
  Circle,
  Sphere,
  Cylinder
} from '@react-three/drei'
import * as THREE from 'three'
import HUD from './shared/HUD'

interface Facility {
  id: string
  name: string
  certified: boolean
  location: [number, number, number]
  type: string
}

const FACILITIES: Facility[] = [
  { id: 'f1', name: 'Jaipur Eco-Salvage', certified: true, location: [1, 0, 1.5], type: 'Industrial Processing' },
  { id: 'f2', name: 'Jodhpur Tech-Recycle', certified: true, location: [-1.5, 0, 0.5], type: 'Collection Center' },
  { id: 'f3', name: 'Udaipur Green Node', certified: true, location: [-0.5, 0, -2], type: 'Dismantling Unit' },
  { id: 'f4', name: 'Kota Metal Recovery', certified: true, location: [2, 0, -1], type: 'Smelting Facility' },
  { id: 'f5', name: 'Street Side Dismantler', certified: false, location: [0.5, 0, -0.5], type: 'Informal/Risk' },
  { id: 'f6', name: 'Backyard Burner', certified: false, location: [-2, 0, 1.8], type: 'Informal/Risk' },
]

export default function RecyclerRadar() {
  const [discovered, setDiscovered] = useState<string[]>([])
  const [selected, setSelected] = useState<Facility | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  const sweepRef = useRef<THREE.Group>(null)
  const sweepAngle = useRef(0)

  useCursor(!!hovered)

  useFrame((_, delta) => {
    if (sweepRef.current) {
      sweepAngle.current += delta * 1.5
      sweepRef.current.rotation.y = sweepAngle.current
      
      // Auto-discover certified facilities in sweep
      const angle = sweepAngle.current % (Math.PI * 2)
      FACILITIES.forEach(f => {
        if (f.certified && !discovered.includes(f.id)) {
          const fAngle = Math.atan2(f.location[2], f.location[0]) + Math.PI
          const normalizedSweep = (angle + Math.PI) % (Math.PI * 2)
          if (Math.abs(normalizedSweep - fAngle) < 0.2) {
            setDiscovered(prev => [...prev, f.id])
          }
        }
      })
    }
  })

  const score = discovered.filter(id => FACILITIES.find(f => f.id === id)?.certified).length * 200

  return (
    <>
      <color attach="background" args={['#030712']} />

      <HUD 
        title="Recycler Radar (Rajasthan)"
        score={score}
        message={discovered.length < 4 ? `Scanning area... Discovered: ${discovered.length}/4 Certified` : "Primary Network Mapping Complete"}
        hint="The radar beam will reveal certified facilities. Avoid unauthorized informal sites."
      />

      <PresentationControls
        global
        rotation={[0.6, 0, 0]}
        polar={[0, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <group position={[0, -1, 0]}>
            {/* Radar Base/Map */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[4, 64]} />
              <meshStandardMaterial 
                color="#0f172a" 
                metalness={0.8} 
                roughness={0.2} 
                map={(() => {
                  const canvas = document.createElement('canvas')
                  canvas.width = 512
                  canvas.height = 512
                  const ctx = canvas.getContext('2d')!
                  ctx.strokeStyle = '#1e293b'
                  ctx.lineWidth = 1
                  for (let i = 1; i <= 4; i++) {
                    ctx.beginPath()
                    ctx.arc(256, 256, i * 64, 0, Math.PI * 2)
                    ctx.stroke()
                  }
                  ctx.beginPath()
                  ctx.moveTo(0, 256); ctx.lineTo(512, 256)
                  ctx.moveTo(256, 0); ctx.lineTo(256, 512)
                  ctx.stroke()
                  const tex = new THREE.CanvasTexture(canvas)
                  return tex
                })()}
              />
            </mesh>

            {/* Radar Sweep */}
            <group ref={sweepRef}>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                <ringGeometry args={[0, 4, 32, 1, 0, Math.PI / 4]} />
                <meshBasicMaterial 
                  color="#3b82f6" 
                  transparent 
                  opacity={0.3} 
                  side={THREE.DoubleSide}
                />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
                <planeGeometry args={[0.02, 4]} />
                <meshBasicMaterial color="#60a5fa" />
              </mesh>
            </group>

            {/* Facility Markers */}
            {FACILITIES.map((f) => (
              <FacilityMarker 
                key={f.id}
                facility={f}
                revealed={discovered.includes(f.id)}
                onClick={() => setSelected(f)}
                onHover={(val: boolean) => setHovered(val ? f.id : null)}
              />
            ))}

            {/* Central Radar Station */}
            <group position={[0, 0.2, 0]}>
               <Cylinder args={[0.3, 0.4, 0.4, 32]}>
                 <meshStandardMaterial color="#1e293b" metalness={0.9} />
               </Cylinder>
               <Sphere args={[0.15, 16, 16]} position={[0, 0.3, 0]}>
                 <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2} />
               </Sphere>
            </group>
        </group>
      </PresentationControls>

      {/* Facility Info Card */}
      <Html fullscreen style={{ pointerEvents: 'none' }}>
        {selected && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2 w-64 bg-gray-900 border border-white/10 p-6 rounded-2xl shadow-2xl z-20 pointer-events-auto animate-in slide-in-from-right-8">
             <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white">x</button>
             <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${selected.certified ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                {selected.certified ? 'OK' : '!'}
             </div>
             <h3 className="text-xl font-bold text-white mb-1">{selected.name}</h3>
             <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-4">{selected.type}</p>
             <p className="text-xs text-gray-300 leading-relaxed mb-6">
               {selected.certified 
                 ? "Certified by the RSPCB for professional e-waste management and recovery." 
                 : "Uncertified facility. High risk of lead leaching and toxic emissions."}
             </p>
             <div className={`text-[10px] font-bold uppercase tracking-widest py-2 px-3 rounded-lg text-center ${selected.certified ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
               {selected.certified ? 'Certified Node' : 'Unauthorized Hub'}
             </div>
          </div>
        )}
      </Html>
    </>
  )
}

function FacilityMarker({ facility, revealed, onClick, onHover }: any) {
  const [isBlinking, setIsBlinking] = useState(false)
  
  useFrame((state) => {
    setIsBlinking(Math.sin(state.clock.elapsedTime * 10) > 0)
  })

  return (
    <group 
      position={facility.location}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => onHover(true)}
      onPointerOut={() => onHover(false)}
      visible={revealed || !facility.certified}
    >
      <Circle args={[0.2, 32]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial 
          color={facility.certified ? (revealed ? "#10b981" : "#111827") : "#ef4444"} 
          emissive={facility.certified ? (revealed ? "#10b981" : "#000") : (isBlinking ? "#ef4444" : "#000")}
          emissiveIntensity={facility.certified ? 2 : 1}
        />
      </Circle>
      
      {facility.certified && revealed && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.3, 32]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.5} />
        </mesh>
      )}

      {!facility.certified && (
        <Html distanceFactor={5} position={[0, 0.4, 0]}>
          <div className="bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase animate-pulse">
            Unauthorized
          </div>
        </Html>
      )}
    </group>
  )
}
