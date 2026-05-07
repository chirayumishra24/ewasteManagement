import { useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { 
  Float, 
  Html,
  PresentationControls, 
  RoundedBox,
  useCursor,
  Torus
} from '@react-three/drei'
import * as THREE from 'three'
import HUD from './shared/HUD'

interface Action {
  id: string
  label: string
  heal: number
  cost: number
  color: string
}

const ACTIONS: Action[] = [
  { id: 'clean', label: 'Clean Dust', heal: 10, cost: 0, color: '#3b82f6' },
  { id: 'battery', label: 'New Battery', heal: 30, cost: 50, color: '#10b981' },
  { id: 'case', label: 'Add Case', heal: 15, cost: 20, color: '#8b5cf6' },
  { id: 'software', label: 'Update OS', heal: 5, cost: 0, color: '#f59e0b' },
]

export default function LifespanLab() {
  const [health, setHealth] = useState(100)
  const [years, setYears] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [lastAction, setLastAction] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [damageFlash, setDamageFlash] = useState(0)

  const phoneRef = useRef<THREE.Group>(null)
  const healthRef = useRef(100)
  const timeRef = useRef(0)

  useCursor(!!hovered)

  useFrame((state, delta) => {
    if (isGameOver) return

    // Natural decay
    timeRef.current += delta
    const decayRate = 1 + years * 0.5
    healthRef.current = Math.max(0, healthRef.current - delta * decayRate)
    setHealth(healthRef.current)

    // Year progression
    const currentYears = Math.floor(timeRef.current / 10)
    if (currentYears > years) {
      setYears(currentYears)
    }

    if (healthRef.current <= 0) {
      setIsGameOver(true)
    }

    // Shake phone on low health or damage
    if (phoneRef.current) {
      const shake = (100 - healthRef.current) / 100 * 0.05
      phoneRef.current.position.x = Math.sin(state.clock.elapsedTime * 20) * shake
      phoneRef.current.position.y = Math.cos(state.clock.elapsedTime * 25) * shake
    }

    if (damageFlash > 0) {
      setDamageFlash(prev => Math.max(0, prev - delta * 2))
    }
  })

  const applyAction = (action: Action) => {
    if (isGameOver) return
    healthRef.current = Math.min(100, healthRef.current + action.heal)
    setHealth(healthRef.current)
    setLastAction(action.label)
    setTimeout(() => setLastAction(null), 2000)
  }

  // Random damage events
  useEffect(() => {
    const interval = setInterval(() => {
      if (isGameOver) return
      const damage = 10 + Math.random() * 15
      healthRef.current = Math.max(0, healthRef.current - damage)
      setHealth(healthRef.current)
      setDamageFlash(1)
    }, 8000)
    return () => clearInterval(interval)
  }, [isGameOver])

  return (
    <>
      <color attach="background" args={['#030712']} />

      <HUD 
        title="Lifespan Simulator"
        score={years * 1000 + Math.floor(health * 10)}
        message={`Device Health: ${Math.round(health)}% | Years Sustained: ${years}`}
        hint="Click the icons to maintain your device. Keep it functional as long as possible!"
      />

      <Html fullscreen style={{ pointerEvents: 'none' }}>
        {/* Damage Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.2)', 
            opacity: damageFlash,
            boxShadow: 'inset 0 0 100px rgba(239, 68, 68, 0.5)'
          }}
        />

        {/* Actions UI */}
        {!isGameOver && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-12 flex gap-4 z-10 pointer-events-auto">
            {ACTIONS.map(action => (
              <button
                key={action.id}
                onClick={() => applyAction(action)}
                onPointerOver={() => setHovered(action.id)}
                onPointerOut={() => setHovered(null)}
                className="group relative flex flex-col items-center"
              >
                <div className={`w-16 h-16 rounded-2xl ${action.color} shadow-lg flex items-center justify-center text-white transition-transform group-hover:scale-110 active:scale-95 border-2 border-white/20`}>
                  <ActionIcon id={action.id} />
                </div>
                <span className="text-[9px] uppercase tracking-widest text-gray-400 mt-2 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Floating Action Feedback */}
        {lastAction && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 animate-bounce z-20">
            <span className="bg-green-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl border border-white/30">
              {lastAction} +
            </span>
          </div>
        )}

        {/* Game Over Modal */}
        {isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 pointer-events-auto">
            <div className="bg-gray-900 border border-red-500/30 p-10 rounded-3xl max-w-md text-center shadow-[0_0_80px_rgba(239,68,68,0.3)]">
              <h3 className="text-4xl font-bold text-white mb-2">Device Dead</h3>
              <p className="text-red-500 font-mono text-xl mb-6">LIFESPAN: {years} YEARS</p>
              <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                Every year extended prevents another device from entering the landfill. Your maintenance efforts saved <span className="text-white font-bold">{years * 50}kg</span> of potential CO2 emissions.
              </p>
              <button 
                onClick={() => {
                  setHealth(100)
                  healthRef.current = 100
                  setYears(0)
                  timeRef.current = 0
                  setIsGameOver(false)
                }}
                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg"
              >
                Start New Lifespan
              </button>
            </div>
          </div>
        )}
      </Html>

      <PresentationControls
        global
        rotation={[0, 0, 0]}
      >
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <group ref={phoneRef}>
            {/* Health Ring */}
            <Torus args={[2.5, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial 
                color={health > 50 ? '#10b981' : (health > 20 ? '#f59e0b' : '#ef4444')} 
                emissive={health > 50 ? '#10b981' : (health > 20 ? '#f59e0b' : '#ef4444')}
                emissiveIntensity={0.5}
                transparent
                opacity={0.3}
              />
            </Torus>
            
            {/* Phone Model */}
            <RoundedBox args={[2, 4, 0.2]} radius={0.15} smoothness={4}>
              <meshStandardMaterial 
                color={health > 20 ? "#1e293b" : "#450a0a"} 
                metalness={0.8} 
                roughness={0.2} 
              />
            </RoundedBox>

            {/* Screen */}
            <RoundedBox args={[1.8, 3.8, 0.21]} radius={0.1} smoothness={4} position={[0, 0, 0.01]}>
              <meshStandardMaterial 
                color={health > 0 ? "#0f172a" : "#000"} 
                emissive={health > 50 ? "#1e293b" : "#000"}
              />
            </RoundedBox>

            {/* Status Text on Screen */}
            {health > 0 && (
              <Html distanceFactor={8} position={[0, 1.2, 0.12]}>
                <div className="text-[10px] font-bold text-white tracking-widest pointer-events-none">
                  SYSTEM: OK
                </div>
              </Html>
            )}

            {/* Cracked Display Effect */}
            {health < 50 && (
              <group position={[0, 0, 0.12]}>
                <mesh>
                  <planeGeometry args={[1.8, 3.8]} />
                  <meshBasicMaterial 
                    color="white" 
                    transparent 
                    opacity={0.1} 
                    wireframe 
                  />
                </mesh>
              </group>
            )}
          </group>
        </Float>
      </PresentationControls>

    </>
  )
}

function ActionIcon({ id }: { id: string }) {
  switch (id) {
    case 'clean': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    case 'battery': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    case 'case': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    case 'software': return <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
    default: return null
  }
}
