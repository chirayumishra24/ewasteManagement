import { useState } from 'react'

import { 
  Html, 
  PresentationControls, 
  RoundedBox,
  useCursor,
  PivotControls
} from '@react-three/drei'
import * as THREE from 'three'
import HUD from './shared/HUD'

interface Part {
  id: string
  name: string
  color: string
  scale: [number, number, number]
  type: 'pcb' | 'shell' | 'speaker' | 'floppy' | 'screen' | 'frame'
}

interface Recipe {
  parts: string[]
  result: string
  description: string
  resultColor: string
}

const PARTS: Part[] = [
  { id: 'p1', name: 'Circuit Board', color: '#065f46', scale: [1, 1.2, 0.05], type: 'pcb' },
  { id: 'p2', name: 'Plastic Frame', color: '#1e293b', scale: [1.2, 1.4, 0.1], type: 'frame' },
  { id: 'p3', name: 'CRT Shell', color: '#334155', scale: [1.5, 1.5, 1.5], type: 'shell' },
  { id: 'p4', name: 'Floppy Disk', color: '#111827', scale: [0.8, 0.8, 0.02], type: 'floppy' },
  { id: 'p5', name: 'Mini Speaker', color: '#1e293b', scale: [0.5, 0.5, 0.5], type: 'speaker' },
  { id: 'p6', name: 'LCD Panel', color: '#0f172a', scale: [1, 1.5, 0.05], type: 'screen' },
]

const RECIPES: Recipe[] = [
  { parts: ['pcb', 'frame'], result: 'Circuit Clock', description: 'A futuristic wall clock made from a logic board.', resultColor: '#10b981' },
  { parts: ['shell', 'screen'], result: 'Digital Art Frame', description: 'Old CRT housing repurposed as a dynamic photo frame.', resultColor: '#3b82f6' },
  { parts: ['floppy', 'frame'], result: 'Retro Notebook', description: 'Floppy disks used as sturdy, nostalgic covers.', resultColor: '#f59e0b' },
  { parts: ['speaker', 'shell'], result: 'Desktop Planter', description: 'A sound-system housing reborn as an urban garden.', resultColor: '#8b5cf6' },
]

export default function UpcycleForge() {
  const [activeParts, setActiveParts] = useState<Record<string, [number, number, number]>>({
    p1: [-2.5, 0.5, 0],
    p2: [-1.5, 0.5, 0],
    p3: [1.5, 0.5, 0],
    p4: [2.5, 0.5, 0],
    p5: [0, 0.5, -2],
    p6: [0, 0.5, 2],
  })
  const [onPad, setOnPad] = useState<string[]>([])
  const [discovery, setDiscovery] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  useCursor(!!hovered)

  const checkCombination = (parts: string[]) => {
    if (parts.length !== 2) return
    const types = parts.map(id => PARTS.find(p => p.id === id)!.type).sort()
    const recipe = RECIPES.find(r => 
      r.parts.slice().sort().every((p, i) => p === types[i])
    )

    if (recipe) {
      setDiscovery(recipe.result)
    } else {
      setDiscovery(null)
    }
  }

  const handleDrag = (id: string, pos: THREE.Vector3) => {
    const newPos: [number, number, number] = [pos.x, 0.5, pos.z]
    setActiveParts(prev => ({ ...prev, [id]: newPos }))

    const distFromCenter = Math.sqrt(pos.x ** 2 + pos.z ** 2)
    const isNearPad = distFromCenter < 1.5

    if (isNearPad && !onPad.includes(id)) {
      if (onPad.length < 2) {
        const nextOnPad = [...onPad, id]
        setOnPad(nextOnPad)
        checkCombination(nextOnPad)
      }
    } else if (!isNearPad && onPad.includes(id)) {
      const nextOnPad = onPad.filter(p => p !== id)
      setOnPad(nextOnPad)
      checkCombination(nextOnPad)
    }
  }

  return (
    <>
      <color attach="background" args={['#030712']} />

      <HUD 
        title="Upcycle Forge"
        score={onPad.length * 50}
        message={discovery ? `MATCH FOUND: ${discovery}` : (onPad.length === 2 ? "No Recipe Known" : "Drag 2 parts to the Forge Pad")}
        hint="Combine different parts on the glowing center pad to discover new creations"
      />

      <PresentationControls
        global
        rotation={[0.5, 0, 0]}
        polar={[0, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <group>
            {/* Workbench Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[10, 10]} />
              <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.8} />
            </mesh>

            {/* Forge Pad */}
            <group position={[0, 0.01, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.2, 1.4, 32]} />
                <meshStandardMaterial 
                  color={discovery ? "#10b981" : "#3b82f6"} 
                  emissive={discovery ? "#10b981" : "#3b82f6"} 
                  emissiveIntensity={2} 
                />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[1.2, 32]} />
                <meshStandardMaterial color="#1e293b" transparent opacity={0.5} />
              </mesh>
            </group>

            {/* Parts */}
            {PARTS.map((part) => (
              <DraggablePart 
                key={part.id} 
                part={part} 
                position={activeParts[part.id]} 
                onDrag={(pos: THREE.Vector3) => handleDrag(part.id, pos)}
                onHover={(val: boolean) => setHovered(val ? part.id : null)}
              />
            ))}

            {/* Grid Helper */}
            <gridHelper args={[10, 10, "#1e293b", "#0f172a"]} position={[0, 0.02, 0]} />
        </group>
      </PresentationControls>

      {/* Discovery Modal */}
      <Html fullscreen style={{ pointerEvents: 'none' }}>
        {discovery && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2 w-64 bg-gray-900 border-2 border-green-500/30 p-6 rounded-2xl shadow-2xl animate-in slide-in-from-right-8 duration-500 z-20 pointer-events-auto">
            <div className="w-full aspect-square bg-green-500/10 rounded-xl mb-4 flex items-center justify-center border border-green-500/20">
               <div className="w-16 h-16 bg-green-500 rounded-full animate-pulse blur-xl opacity-50" />
               <span className="text-4xl">*</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{discovery}</h3>
            <p className="text-[10px] text-gray-400 leading-relaxed mb-6 uppercase tracking-wider font-bold">
              {RECIPES.find(r => r.result === discovery)?.description}
            </p>
            <button 
              onClick={() => {
                setDiscovery(null)
                setOnPad([])
                // Reset positions
                setActiveParts({
                  p1: [-2.5, 0.5, 0], p2: [-1.5, 0.5, 0], p3: [1.5, 0.5, 0],
                  p4: [2.5, 0.5, 0], p5: [0, 0.5, -2], p6: [0, 0.5, 2],
                })
              }}
              className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all uppercase tracking-widest text-[10px]"
            >
              Claim & Reset
            </button>
          </div>
        )}
      </Html>
    </>
  )
}

function DraggablePart({ part, position, onDrag, onHover }: any) {
  return (
    <PivotControls
      depthTest={false}
      anchor={[0, 0, 0]}
      scale={0.5}
      lineWidth={2}
      onDrag={(l) => {
        const wp = new THREE.Vector3()
        l.decompose(wp, new THREE.Quaternion(), new THREE.Vector3())
        onDrag(wp)
      }}
    >
      <mesh 
        position={position}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
      >
        <RoundedBox args={part.scale} radius={0.05} smoothness={4}>
          <meshStandardMaterial color={part.color} metalness={0.7} roughness={0.2} />
        </RoundedBox>
        <Html distanceFactor={5} position={[0, part.scale[1] / 2 + 0.3, 0]}>
          <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[8px] text-white whitespace-nowrap uppercase tracking-widest border border-white/10 font-bold">
            {part.name}
          </div>
        </Html>
      </mesh>
    </PivotControls>
  )
}
