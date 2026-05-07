import { useState, useRef, useMemo } from 'react'
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

interface DeviceLayer {
  id: string
  name: string
  category: 'bulk' | 'precious' | 'hazardous'
  materials: string[]
  color: string
  offset: [number, number, number]
  scale: [number, number, number]
}

const deviceLayers: DeviceLayer[] = [
  { id: 'glass', name: 'Protective Glass', category: 'bulk', materials: ['Aluminosilicate Glass'], color: '#94a3b8', offset: [0, 0, 0.4], scale: [2, 3, 0.05] },
  { id: 'lcd', name: 'LCD Display', category: 'hazardous', materials: ['Liquid Crystals', 'Indium Tin Oxide'], color: '#334155', offset: [0, 0, 0.3], scale: [1.9, 2.9, 0.05] },
  { id: 'digitizer', name: 'Touch Digitizer', category: 'precious', materials: ['Indium', 'Silver'], color: '#1e293b', offset: [0, 0, 0.2], scale: [1.8, 2.8, 0.02] },
  { id: 'pcb', name: 'Logic Board', category: 'precious', materials: ['Gold', 'Palladium', 'Copper'], color: '#065f46', offset: [0, 0, 0], scale: [1.6, 2.5, 0.1] },
  { id: 'battery', name: 'Li-ion Battery', category: 'hazardous', materials: ['Lithium', 'Cobalt', 'Graphite'], color: '#b91c1c', offset: [0, -0.2, -0.1], scale: [1.4, 2, 0.15] },
  { id: 'frame', name: 'Internal Frame', category: 'bulk', materials: ['Aluminum', 'Magnesium'], color: '#475569', offset: [0, 0, -0.2], scale: [2, 3, 0.1] },
  { id: 'shell', name: 'Rear Shell', category: 'bulk', materials: ['Recycled Plastic', 'Glass'], color: '#0f172a', offset: [0, 0, -0.3], scale: [2.1, 3.1, 0.1] },
]

export default function DeviceAutopsy() {
  const [exploded, setExploded] = useState(false)
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)
  const [sortedLayers, setSortedLayers] = useState<Record<string, boolean>>({})
  const [hovered, setHovered] = useState<string | null>(null)

  useCursor(!!hovered)

  const sortedCount = Object.keys(sortedLayers).length
  const score = sortedCount * 150

  const handleLayerClick = (id: string) => {
    if (!exploded) {
      setExploded(true)
      return
    }
    setSelectedLayer(selectedLayer === id ? null : id)
  }

  const sortLayer = (category: 'bulk' | 'precious' | 'hazardous') => {
    if (!selectedLayer) return
    const layer = deviceLayers.find(l => l.id === selectedLayer)
    if (layer && layer.category === category) {
      setSortedLayers(prev => ({ ...prev, [selectedLayer]: true }))
      setSelectedLayer(null)
    }
  }

  // Calculate material ratios for the 3D pie chart
  const stats = useMemo(() => {
    const total = deviceLayers.length
    const counts = { bulk: 0, precious: 0, hazardous: 0 }
    deviceLayers.forEach(l => counts[l.category]++)
    return {
      bulk: counts.bulk / total,
      precious: counts.precious / total,
      hazardous: counts.hazardous / total,
    }
  }, [])

  return (
    <>
      <color attach="background" args={['#030712']} />

      <HUD 
        title="Device Autopsy Lab"
        score={score}
        message={!exploded ? "INITIATING AUTOPSY: Click Device to Expand" : (selectedLayer ? `Categorize: ${deviceLayers.find(l => l.id === selectedLayer)?.name}` : "Select a layer to categorize")}
        hint={!exploded ? "The device must be expanded before analysis" : "Match parts to Bulk, Precious, or Hazardous bins"}
      />

      <Html fullscreen style={{ pointerEvents: 'none' }}>
        {/* Sorting Bins UI */}
        {exploded && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10 pointer-events-auto">
            <BinButton 
              label="Bulk" 
              color="bg-slate-600" 
              onClick={() => sortLayer('bulk')} 
              active={!!selectedLayer}
            />
            <BinButton 
              label="Precious" 
              color="bg-amber-500" 
              onClick={() => sortLayer('precious')} 
              active={!!selectedLayer}
            />
            <BinButton 
              label="Hazardous" 
              color="bg-red-600" 
              onClick={() => sortLayer('hazardous')} 
              active={!!selectedLayer}
            />
          </div>
        )}

        {/* Material Chart */}
        <div className="absolute left-6 bottom-6 bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl z-10">
          <h4 className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 font-bold">Material DNA</h4>
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2">
              <StatItem color="bg-slate-600" label="Bulk" percent={Math.round(stats.bulk * 100)} />
              <StatItem color="bg-amber-500" label="Precious" percent={Math.round(stats.precious * 100)} />
              <StatItem color="bg-red-600" label="Hazardous" percent={Math.round(stats.hazardous * 100)} />
            </div>
          </div>
        </div>

        {/* Completion Modal */}
        {sortedCount === deviceLayers.length && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 pointer-events-auto">
            <div className="bg-gray-900 border border-amber-500/30 p-8 rounded-3xl max-w-sm text-center shadow-[0_0_50px_rgba(245,158,11,0.2)]">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Autopsy Complete</h3>
              <p className="text-gray-400 mb-6 italic text-sm leading-relaxed">
                "System report generated. All components categorized. Precious metals isolated for recovery. Hazardous materials secured for neutralization."
              </p>
              <button 
                onClick={() => {
                  setSortedLayers({})
                  setExploded(false)
                  setSelectedLayer(null)
                }}
                className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg"
              >
                Log Another Device
              </button>
            </div>
          </div>
        )}
      </Html>

      <PresentationControls
        global
        snap
        rotation={[0, 0.5, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
      >
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <group>
            {deviceLayers.map((layer) => {
              const isSorted = sortedLayers[layer.id]
              const isSelected = selectedLayer === layer.id
              const targetZ = exploded ? (isSorted ? -5 : layer.offset[2] * 4) : 0
              const targetY = exploded ? layer.offset[1] : 0
              
              return (
                <Layer 
                  key={layer.id}
                  layer={layer}
                  position={[0, targetY, targetZ]}
                  isSelected={isSelected}
                  isSorted={isSorted}
                  onClick={() => handleLayerClick(layer.id)}
                  onHover={(val: boolean) => setHovered(val ? layer.id : null)}
                />
              )
            })}
          </group>
        </Float>
      </PresentationControls>
    </>
  )
}

function Layer({ layer, position, isSelected, isSorted, onClick, onHover }: any) {
  const meshRef = useRef<THREE.Mesh>(null)
  const currentPos = useRef(new THREE.Vector3(...position))
  
  useFrame((_state, delta) => {
    if (meshRef.current) {
      currentPos.current.lerp(new THREE.Vector3(...position), 0.1)
      meshRef.current.position.copy(currentPos.current)
      
      if (isSelected) {
        meshRef.current.rotation.y += delta * 1
      } else {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1)
      }
    }
  })

  return (
    <group>
      <mesh 
        ref={meshRef} 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
        visible={!isSorted}
      >
        <RoundedBox args={layer.scale} radius={0.05} smoothness={4}>
          <meshStandardMaterial 
            color={isSelected ? '#3b82f6' : layer.color} 
            metalness={0.7} 
            roughness={0.2}
            emissive={isSelected ? '#3b82f6' : '#000'}
            emissiveIntensity={isSelected ? 0.5 : 0}
          />
        </RoundedBox>
        
        {isSelected && (
          <Html distanceFactor={5} position={[1.5, 0, 0]}>
            <div className="bg-blue-600 border border-blue-400 p-4 rounded-xl backdrop-blur-md w-48 shadow-2xl animate-in fade-in slide-in-from-left-4 duration-300">
              <p className="text-[10px] font-bold text-blue-100 uppercase tracking-tighter mb-1">Analyzing Component</p>
              <h5 className="text-sm font-bold text-white mb-2">{layer.name}</h5>
              <div className="flex flex-wrap gap-1">
                {layer.materials.map((m: string) => (
                  <span key={m} className="px-1.5 py-0.5 bg-black/30 rounded text-[9px] text-blue-100 whitespace-nowrap">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </Html>
        )}
      </mesh>
    </group>
  )
}

function BinButton({ label, color, onClick, active }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={!active}
      className={`
        w-32 py-4 rounded-2xl border-2 border-white/10 backdrop-blur-md font-bold uppercase tracking-widest text-[10px] transition-all
        ${active ? `${color} text-white shadow-lg scale-100 hover:scale-105 active:scale-95` : 'bg-gray-900/50 text-gray-500 scale-90 opacity-50 cursor-not-allowed'}
      `}
    >
      {label}
    </button>
  )
}

function StatItem({ color, label, percent }: any) {
  return (
    <div className="flex items-center gap-3 w-40">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-[10px] text-gray-400 font-medium flex-1 uppercase tracking-tight">{label}</span>
      <span className="text-[10px] text-white font-mono font-bold">{percent}%</span>
      <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
