import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { 
  Html, 
  PresentationControls, 
  useCursor,
  Box,
  Plane,
  Grid,
  Sphere
} from '@react-three/drei'
import HUD from './shared/HUD'

interface DriveState {
  bins: [number, number][]
  volunteers: [number, number][]
  promos: [number, number][]
  weightCollected: number
  visitors: number
}

export default function DriveSimulator() {
  const [phase, setPhase] = useState<'plan' | 'sim' | 'results'>('plan')
  const [state, setState] = useState<DriveState>({
    bins: [],
    volunteers: [],
    promos: [],
    weightCollected: 0,
    visitors: 0
  })
  const [hovered] = useState<string | null>(null)
  
  const visitorsRef = useRef<{ id: number, pos: [number, number], target: [number, number], type: string }[]>([])
  const nextVisitorId = useRef(0)

  useCursor(!!hovered)

  // Simulation loop
  useFrame((_, delta) => {
    if (phase !== 'sim') return

    // Spawn visitors
    if (Math.random() < 0.05 && visitorsRef.current.length < 20) {
      const startPos: [number, number] = [Math.random() > 0.5 ? 5 : -5, Math.random() * 10 - 5]
      const targetBin = state.bins[Math.floor(Math.random() * state.bins.length)] || [0, 0]
      visitorsRef.current.push({
        id: nextVisitorId.current++,
        pos: startPos,
        target: targetBin,
        type: Math.random() > 0.8 ? 'heavy' : 'light'
      })
    }

    // Move visitors
    visitorsRef.current = visitorsRef.current.map(v => {
      const dx = v.target[0] - v.pos[0]
      const dy = v.target[1] - v.pos[1]
      const dist = Math.sqrt(dx*dx + dy*dy)
      
      if (dist < 0.5) {
        // Deposit
        setState(prev => ({
          ...prev,
          weightCollected: prev.weightCollected + (v.type === 'heavy' ? 15 : 2),
          visitors: prev.visitors + 1
        }))
        return null
      }

      return {
        ...v,
        pos: [v.pos[0] + (dx/dist) * delta * 2, v.pos[1] + (dy/dist) * delta * 2] as [number, number]
      }
    }).filter(v => v !== null) as any

    if (state.visitors >= 50) {
      setPhase('results')
    }
  })

  const addElement = (type: 'bins' | 'volunteers' | 'promos', pos: [number, number]) => {
    if (phase !== 'plan') return
    setState(prev => ({
      ...prev,
      [type]: [...prev[type], pos]
    }))
  }

  return (
    <>
      <color attach="background" args={['#030712']} />

      <HUD 
        title="Collection Drive Planner"
        score={Math.floor(state.weightCollected)}
        message={phase === 'plan' ? "PLANNING PHASE: Place your resources" : (phase === 'sim' ? "DRIVE ACTIVE: NPCs arriving..." : "DRIVE COMPLETE: Impact Report")}
        hint={phase === 'plan' ? "Click the grid to place collection bins and volunteers" : "Watch the community participate in your drive"}
      />

      <Html fullscreen style={{ pointerEvents: 'none' }}>
        {/* Control Panel */}
        <div className="absolute right-12 bottom-12 flex flex-col gap-4 z-10 pointer-events-auto">
          {phase === 'plan' && (
            <button 
              onClick={() => setPhase('sim')}
              disabled={state.bins.length === 0}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 text-white font-bold rounded-2xl transition-all uppercase tracking-widest text-xs shadow-xl"
            >
              Launch Drive Simulation
            </button>
          )}
        </div>

        {/* Results View */}
        {phase === 'results' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 pointer-events-auto">
            <div className="bg-gray-900 border border-blue-500/30 p-10 rounded-3xl max-w-sm text-center shadow-[0_0_100px_rgba(59,130,246,0.3)]">
              <h3 className="text-3xl font-bold text-white mb-2">Drive Impact</h3>
              <p className="text-blue-500 font-mono text-xl mb-6">COLLECTED: {state.weightCollected.toFixed(1)}kg</p>
              <div className="space-y-4 mb-8 text-left">
                 <ResultStat label="Community Reach" value={`${state.visitors} People`} />
                 <ResultStat label="Diversion Rate" value="92%" />
                 <ResultStat label="SDG Alignment" value="Goal 12" />
              </div>
              <button 
                onClick={() => {
                  setState({ bins: [], volunteers: [], promos: [], weightCollected: 0, visitors: 0 })
                  setPhase('plan')
                  visitorsRef.current = []
                }}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg"
              >
                Start New Drive
              </button>
            </div>
          </div>
        )}
      </Html>

      <PresentationControls
        global
        rotation={[0.5, -0.5, 0]}
        polar={[0, 0]}
        azimuth={[0, 0]}
      >
        <group>
            {/* Campus Ground */}
            <Plane args={[10, 10]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={(e) => {
              if (phase === 'plan') addElement('bins', [e.point.x, e.point.z])
            }}>
              <meshStandardMaterial color="#111827" />
            </Plane>
            <Grid args={[10, 10]} cellColor="#1e293b" sectionColor="#334155" position={[0, 0.01, 0]} />

            {/* Placed Elements */}
            {state.bins.map((pos, i) => (
              <Box key={`bin-${i}`} args={[0.6, 0.8, 0.6]} position={[pos[0], 0.4, pos[1]]}>
                <meshStandardMaterial color="#3b82f6" />
                <Html distanceFactor={5} position={[0, 0.6, 0]}>
                  <div className="bg-blue-500 text-[8px] px-1 py-0.5 rounded text-white font-bold">BIN</div>
                </Html>
              </Box>
            ))}

            {/* Simulated Visitors (NPCs) */}
            {visitorsRef.current.map(v => (
              <group key={v.id} position={[v.pos[0], 0.25, v.pos[1]]}>
                <Sphere args={[0.2, 8, 8]}>
                  <meshStandardMaterial color={v.type === 'heavy' ? '#f59e0b' : '#94a3b8'} />
                </Sphere>
                {v.type === 'heavy' && (
                  <Box args={[0.3, 0.3, 0.3]} position={[0, 0.4, 0]}>
                     <meshStandardMaterial color="#475569" />
                  </Box>
                )}
              </group>
            ))}

            {/* Static Campus Buildings */}
            <Box args={[2, 3, 2]} position={[-4, 1.5, -4]}>
              <meshStandardMaterial color="#1e293b" />
            </Box>
            <Box args={[3, 2, 2]} position={[3, 1, -4]}>
              <meshStandardMaterial color="#1e293b" />
            </Box>
        </group>
      </PresentationControls>
    </>
  )
}

function ResultStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-white/5 pb-2">
      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{label}</span>
      <span className="text-sm text-white font-bold">{value}</span>
    </div>
  )
}
