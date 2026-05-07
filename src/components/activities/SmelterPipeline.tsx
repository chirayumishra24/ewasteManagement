import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { 
  Float, 
  Html,
  PresentationControls, 
  useCursor,
  Box,
  Cylinder,
  Torus
} from '@react-three/drei'
import * as THREE from 'three'
import HUD from './shared/HUD'

const STAGES = [
  { id: 'shred', name: 'Shredder', description: 'Disintegrating components into small fragments.', color: '#334155' },
  { id: 'magnet', name: 'Magnetic Sort', description: 'Separating ferrous metals using magnets.', color: '#1e293b' },
  { id: 'smelt', name: 'Furnace', description: 'Melting scrap to isolate copper and gold.', color: '#991b1b' },
  { id: 'electro', name: 'Electrolysis', description: 'Refining pure metal via chemical reaction.', color: '#065f46' },
]

export default function SmelterPipeline() {
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [hovered] = useState<string | null>(null)

  const groupRef = useRef<THREE.Group>(null)

  useCursor(!!hovered)

  useFrame(() => {
    if (groupRef.current) {
      // Smooth camera transition between stages
      const targetX = -currentStage * 6
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1)
    }
  })

  const nextStage = () => {
    if (currentStage < STAGES.length - 1) {
      setCurrentStage(prev => prev + 1)
      setProgress(0)
    }
  }

  const handleAction = () => {
    const newProgress = progress + 20
    if (newProgress >= 100) {
      setProgress(100)
    } else {
      setProgress(newProgress)
    }
  }

  return (
    <>
      <color attach="background" args={['#030712']} />

      <HUD 
        title="Industrial Recovery Pipeline"
        score={(currentStage * 250) + (progress * 2.5)}
        message={`${STAGES[currentStage].name}: ${STAGES[currentStage].description}`}
        hint={progress < 100 ? "Maintain process speed by clicking the active stage" : "Stage complete! Proceed to next station"}
      />

      <Html fullscreen style={{ pointerEvents: 'none' }}>
        {/* Pipeline Navigation UI */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-12 flex gap-2 z-10">
          {STAGES.map((s, i) => (
            <div 
              key={s.id}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${i === currentStage ? 'bg-blue-500 scale-125 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : (i < currentStage ? 'bg-green-500' : 'bg-gray-800')}`}
            />
          ))}
        </div>

        {/* Controls Overlay */}
        <div className="absolute right-12 bottom-12 flex flex-col gap-4 items-center z-10 pointer-events-auto">
          <button 
            onClick={handleAction}
            className={`w-24 h-24 rounded-full border-4 border-white/10 flex items-center justify-center font-bold text-white transition-all active:scale-90 ${progress < 100 ? 'bg-blue-600 animate-pulse' : 'bg-gray-800'}`}
          >
            {progress < 100 ? 'PROCESS' : 'READY'}
          </button>
          
          {progress >= 100 && (
            <button 
              onClick={nextStage}
              className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl transition-all uppercase tracking-widest text-xs shadow-xl animate-in fade-in slide-in-from-bottom-4"
            >
              {currentStage === STAGES.length - 1 ? 'Finish Recovery' : 'Next Stage'}
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="absolute left-1/2 -translate-x-1/2 top-24 w-64 h-2 bg-gray-900 rounded-full overflow-hidden border border-white/5 z-10">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        {/* Completion Modal */}
        {currentStage === STAGES.length - 1 && progress === 100 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 pointer-events-auto">
            <div className="bg-gray-900 border border-green-500/30 p-10 rounded-3xl max-w-sm text-center shadow-[0_0_100px_rgba(34,197,94,0.3)]">
              <h3 className="text-3xl font-bold text-white mb-2">Cycle Complete</h3>
              <p className="text-green-500 font-mono text-xl mb-6">RECOVERY RATE: 98.4%</p>
              <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                Industrial processes like smelting ensure that up to <span className="text-white font-bold">99% of copper and gold</span> can be extracted from e-waste, powering the circular economy.
              </p>
              <button 
                onClick={() => {
                  setCurrentStage(0)
                  setProgress(0)
                }}
                className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg"
              >
                Restart Pipeline
              </button>
            </div>
          </div>
        )}
      </Html>

      <PresentationControls
        global
        rotation={[0, 0, 0]}
        polar={[0, 0]}
        azimuth={[-0.2, 0.2]}
      >
        <group ref={groupRef}>
            {/* Stage 1: Shredder */}
            <PipelineStage position={[0, 0, 0]} title="1. SHREDDER" active={currentStage === 0}>
               <group>
                  <Cylinder args={[1.5, 1.5, 2, 32]} rotation={[0, 0, Math.PI / 2]}>
                    <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
                  </Cylinder>
                  <Torus args={[1.2, 0.1, 16, 100]} rotation={[0, Math.PI / 2, 0]}>
                    <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={progress / 100} />
                  </Torus>
               </group>
            </PipelineStage>

            {/* Stage 2: Magnet */}
            <PipelineStage position={[6, 0, 0]} title="2. MAGNETIC SORT" active={currentStage === 1}>
               <group>
                  <Box args={[2, 0.5, 4]} position={[0, 1.5, 0]}>
                    <meshStandardMaterial color="#ef4444" metalness={0.8} />
                  </Box>
                  <Box args={[1.8, 0.2, 3.8]} position={[0, -1, 0]}>
                    <meshStandardMaterial color="#111827" />
                  </Box>
               </group>
            </PipelineStage>

            {/* Stage 3: Smelter */}
            <PipelineStage position={[12, 0, 0]} title="3. FURNACE" active={currentStage === 2}>
               <group>
                  <Cylinder args={[2, 2.2, 3, 32]} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#111827" metalness={0.9} />
                  </Cylinder>
                  <mesh position={[0, 1, 0]}>
                    <cylinderGeometry args={[1.8, 1.8, 0.1, 32]} />
                    <meshStandardMaterial 
                      color="#f97316" 
                      emissive="#f97316" 
                      emissiveIntensity={progress / 50} 
                    />
                  </mesh>
               </group>
            </PipelineStage>

            {/* Stage 4: Electrolysis */}
            <PipelineStage position={[18, 0, 0]} title="4. ELECTROLYSIS" active={currentStage === 3}>
               <group>
                  <Box args={[3, 2, 3]}>
                    <meshStandardMaterial color="#064e3b" transparent opacity={0.6} />
                  </Box>
                  <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[2.5, 1.8, 2.5]} />
                    <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={progress / 100} transparent opacity={0.3} />
                  </mesh>
               </group>
            </PipelineStage>
        </group>
      </PresentationControls>
    </>
  )
}

function PipelineStage({ position, title, children, active }: any) {
  return (
    <group position={position}>
      <Float speed={active ? 3 : 0} rotationIntensity={0.2} floatIntensity={0.2}>
        {children}
      </Float>
      <Html distanceFactor={8} position={[0, -2.5, 0]}>
        <div className={`text-xs font-bold tracking-widest pointer-events-none ${active ? 'text-white' : 'text-gray-500'}`}>
          {title}
        </div>
      </Html>
      {!active && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4, 4, 4]} />
          <meshStandardMaterial color="#000" transparent opacity={0.4} depthWrite={false} />
        </mesh>
      )}
    </group>
  )
}
