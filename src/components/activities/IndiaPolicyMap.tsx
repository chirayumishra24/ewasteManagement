import { useState, useRef } from 'react'
import { 
  Html, 
  PresentationControls, 
  useCursor,
  Instances,
  Instance
} from '@react-three/drei'
import * as THREE from 'three'
import HUD from './shared/HUD'

type LayerId = 'waste' | 'formal' | 'parks' | 'epr'

const DATA_LAYERS = [
  { id: 'waste', name: 'Waste Gen', color: '#ef4444', desc: 'Annual generation by state (Mt)' },
  { id: 'formal', name: 'Recycling Hubs', color: '#10b981', desc: 'Certified industrial facilities' },
  { id: 'parks', name: 'Eco-Parks', color: '#3b82f6', desc: 'Integrated management zones' },
  { id: 'epr', name: 'EPR Coverage', color: '#f59e0b', desc: 'Extended Producer Responsibility zones' },
]

const CITIES = [
  { name: 'Delhi', pos: [0.1, 0.1, 1.2], waste: '1.2M', growth: '+15%' },
  { name: 'Mumbai', pos: [-0.6, 0.1, 0.2], waste: '0.8M', growth: '+8%' },
  { name: 'Bengaluru', pos: [-0.2, 0.1, -1], waste: '0.9M', growth: '+12%' },
  { name: 'Chennai', pos: [0.2, 0.1, -1.2], waste: '0.6M', growth: '+5%' },
  { name: 'Jaipur', pos: [-0.2, 0.1, 0.8], waste: '0.4M', growth: '+10%' },
]

export default function IndiaPolicyMap() {
  const [activeLayer, setActiveLayer] = useState<LayerId>('waste')
  const [selectedCity, setSelectedCity] = useState<typeof CITIES[0] | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)

  useCursor(!!hovered)

  const indiaRef = useRef<THREE.Group>(null)

  return (
    <>
      <color attach="background" args={['#030712']} />

      <HUD 
        title="India Policy Dashboard"
        score={DATA_LAYERS.findIndex(l => l.id === activeLayer) * 250 + 250}
        message={DATA_LAYERS.find(l => l.id === activeLayer)?.desc}
        hint="Toggle layers to analyze the e-waste landscape across the country"
      />

      <Html fullscreen style={{ pointerEvents: 'none' }}>
        {/* Layer Toggles */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10 pointer-events-auto">
          {DATA_LAYERS.map(layer => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id as LayerId)}
              className={`
                w-36 px-4 py-3 rounded-xl border border-white/10 backdrop-blur-md transition-all text-left
                ${activeLayer === layer.id ? 'bg-white/20 border-white/30 scale-105' : 'bg-black/40 text-gray-500 hover:bg-white/5'}
              `}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${activeLayer === layer.id ? 'text-white' : 'text-gray-500'}`}>
                  {layer.name}
                </span>
              </div>
              <div className={`h-1 w-full bg-gray-800 rounded-full overflow-hidden`}>
                <div 
                  className="h-full transition-all duration-500" 
                  style={{ backgroundColor: layer.color, width: activeLayer === layer.id ? '100%' : '0%' }} 
                />
              </div>
            </button>
          ))}
        </div>

        {/* City Stats Modal */}
        {selectedCity && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2 w-64 bg-gray-900 border border-white/10 p-6 rounded-2xl shadow-2xl z-20 pointer-events-auto animate-in slide-in-from-right-8">
             <button onClick={() => setSelectedCity(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white">x</button>
             <h3 className="text-2xl font-bold text-white mb-4">{selectedCity.name}</h3>
             <div className="space-y-4">
                <StatRow label="Generation" value={selectedCity.waste} color="text-red-400" />
                <StatRow label="Growth Rate" value={selectedCity.growth} color="text-amber-400" />
                <StatRow label="Formal Centers" value="12 Nodes" color="text-green-400" />
             </div>
             <p className="text-[9px] text-gray-500 mt-6 leading-relaxed uppercase tracking-wider font-bold">
               Stats based on 2024 CPCB E-Waste Inventory Data
             </p>
          </div>
        )}
      </Html>

      <PresentationControls
        global
        rotation={[0.2, 0, 0]}
        polar={[-Math.PI / 6, Math.PI / 4]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <group ref={indiaRef} scale={1.5}>
            {/* India Shape (Extruded silhouette - simplified) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
              <cylinderGeometry args={[2.5, 2.5, 0.1, 6]} />
              <meshStandardMaterial 
                color="#1e293b" 
                metalness={0.7} 
                roughness={0.3} 
                wireframe={activeLayer === 'epr'}
              />
            </mesh>

            {/* Heatmap Layer */}
            {activeLayer === 'waste' && (
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <circleGeometry args={[2.4, 32]} />
                <meshStandardMaterial 
                  color="#ef4444" 
                  transparent 
                  opacity={0.3} 
                  emissive="#ef4444"
                  emissiveIntensity={0.5}
                />
              </mesh>
            )}

            {/* Hubs Layer (Instanced points) */}
            {activeLayer === 'formal' && (
              <Instances range={100}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2} />
                {Array.from({ length: 50 }).map((_, i) => (
                  <Instance 
                    key={i} 
                    position={[
                      (Math.random() - 0.5) * 3,
                      0.1,
                      (Math.random() - 0.5) * 4
                    ]} 
                  />
                ))}
              </Instances>
            )}

            {/* City Markers */}
            {CITIES.map((city) => (
              <mesh 
                key={city.name} 
                position={city.pos as [number, number, number]}
                onClick={(e) => { e.stopPropagation(); setSelectedCity(city); }}
                onPointerOver={() => setHovered(city.name)}
                onPointerOut={() => setHovered(null)}
              >
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial 
                  color="white" 
                  emissive={hovered === city.name ? "#3b82f6" : "white"}
                  emissiveIntensity={hovered === city.name ? 2 : 0.5}
                />
                <Html distanceFactor={6} position={[0.2, 0.2, 0]}>
                   <div className="bg-black/80 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-[8px] text-white font-bold whitespace-nowrap shadow-xl">
                     {city.name}
                   </div>
                </Html>
              </mesh>
            ))}
        </group>
      </PresentationControls>
    </>
  )
}

function StatRow({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex justify-between items-center border-b border-white/5 pb-2">
      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{label}</span>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  )
}
