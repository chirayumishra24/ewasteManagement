import { useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { 
  Float, 
  Html, 
  PresentationControls, 
  useCursor,
  Torus
} from '@react-three/drei'
import HUD from './shared/HUD'

interface DataOrb {
  id: string
  label: string
  isThreat: boolean
  description: string
  position: [number, number, number]
  velocity: [number, number, number]
  color: string
}

const ORB_TYPES = [
  { label: 'Old Email Account', isThreat: true, description: 'Inactive accounts are vulnerable to takeover.', color: '#ef4444' },
  { label: 'Shared Password', isThreat: true, description: 'Password reuse across sites increases risk.', color: '#ef4444' },
  { label: 'Location History', isThreat: true, description: 'Granular tracking data reveals personal patterns.', color: '#ef4444' },
  { label: 'Cloud Backup', isThreat: false, description: 'Encrypted backups preserve your digital history.', color: '#3b82f6' },
  { label: 'Contact List', isThreat: false, description: 'Essential for digital communication.', color: '#3b82f6' },
  { label: 'Active MFA', isThreat: false, description: 'Multi-factor auth significantly boosts security.', color: '#10b981' },
  { label: 'Browser Cookies', isThreat: true, description: 'Third-party cookies track you across the web.', color: '#f59e0b' },
  { label: 'Unused App', isThreat: true, description: 'Apps with permissions can leak data in background.', color: '#ef4444' },
]

export default function DataShredder() {
  const [orbs, setOrbs] = useState<DataOrb[]>([])
  const [vulnerability, setVulnerability] = useState(0)
  const [shreddedCount, setShreddedCount] = useState(0)
  const [hovered, setHovered] = useState<string | null>(null)
  const [isGameOver, setIsGameOver] = useState(false)

  const vulRef = useRef(0)
  const nextOrbId = useRef(0)

  useCursor(!!hovered)

  // Spawn orbs
  useEffect(() => {
    const interval = setInterval(() => {
      if (orbs.length < 10 && !isGameOver) {
        const type = ORB_TYPES[Math.floor(Math.random() * ORB_TYPES.length)]
        const angle = Math.random() * Math.PI * 2
        setOrbs((prev: DataOrb[]) => [
          ...prev,
          {
            id: `orb-${nextOrbId.current++}`,
            ...type,
            position: [Math.cos(angle) * 3, Math.sin(angle) * 3, Math.random() * 2 - 1],
            velocity: [Math.cos(angle + Math.PI) * 0.5, Math.sin(angle + Math.PI) * 0.5, 0],
            color: type.isThreat ? '#ef4444' : '#3b82f6'
          }
        ])
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [orbs.length, isGameOver])

  useFrame((_, delta) => {
    if (isGameOver) return

    // Move orbs and check vulnerability
    let currentThreats = 0
    setOrbs((prev: DataOrb[]) => prev.map((orb: DataOrb) => {
      if (orb.isThreat) currentThreats++
      return {
        ...orb,
        position: [
          orb.position[0] + orb.velocity[0] * delta,
          orb.position[1] + orb.velocity[1] * delta,
          orb.position[2] + orb.velocity[2] * delta
        ] as [number, number, number]
      }
    }).filter((orb: DataOrb) => {
       const dist = Math.sqrt(orb.position[0]**2 + orb.position[1]**2)
       return dist < 5 // Keep inside arena
    }))

    // Vulnerability meter rises
    vulRef.current = Math.min(100, vulRef.current + delta * (currentThreats * 1.5))
    setVulnerability(vulRef.current)

    if (vulRef.current >= 100) {
      setIsGameOver(true)
    }
  })

  const shredOrb = (id: string, isThreat: boolean) => {
    setOrbs((prev: DataOrb[]) => prev.filter((o: DataOrb) => o.id !== id))
    if (isThreat) {
      setShreddedCount((prev: number) => prev + 1)
      vulRef.current = Math.max(0, vulRef.current - 15)
    } else {
      vulRef.current = Math.min(100, vulRef.current + 20)
    }
  }

  return (
    <>
      <color attach="background" args={['#030712']} />

      <HUD 
        title="Data Hygiene Control"
        score={shreddedCount * 250}
        message={`Shredded: ${shreddedCount} | Vulnerability: ${Math.round(vulnerability)}%`}
        hint="Neutralize threats (red/orange) in the shredder. Protect safe data (blue/green)."
      />

      <Html fullscreen style={{ pointerEvents: 'none' }}>
        {/* Vulnerability Gauge */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-12 w-64 h-4 bg-gray-900 rounded-full border border-white/10 overflow-hidden z-10">
          <div 
            className={`h-full transition-all duration-300 ${vulnerability > 70 ? 'bg-red-500' : 'bg-blue-500'} shadow-[0_0_20px_rgba(239,68,68,0.3)]`}
            style={{ width: `${vulnerability}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-[8px] font-bold text-white uppercase tracking-widest">Vulnerability Meter</span>
          </div>
        </div>

        {/* Game Over Modal */}
        {isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md z-50 pointer-events-auto">
            <div className="bg-gray-900 border border-red-500/30 p-10 rounded-3xl max-w-sm text-center shadow-[0_0_100px_rgba(239,68,68,0.4)]">
              <h3 className="text-3xl font-bold text-white mb-2">Privacy Breach</h3>
              <p className="text-red-500 font-mono text-xl mb-6">SHREDDED: {shreddedCount} THREATS</p>
              <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                Unmanaged digital waste leads to privacy breaches and identity theft. Secure data hygiene is as important as physical e-waste recycling.
              </p>
              <button 
                onClick={() => {
                  setOrbs([])
                  vulRef.current = 0
                  setVulnerability(0)
                  setShreddedCount(0)
                  setIsGameOver(false)
                }}
                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg"
              >
                Secure System Again
              </button>
            </div>
          </div>
        )}
      </Html>

      <PresentationControls global rotation={[0, 0, 0]}>
        <group>
          {/* Shredder Zone */}
          <group position={[0, 0, 0]}>
            <Torus args={[1.2, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial 
                color="#ef4444" 
                emissive="#ef4444" 
                emissiveIntensity={2} 
                transparent 
                opacity={0.3} 
              />
            </Torus>
            <Html distanceFactor={8} position={[0, 0, 0]}>
              <div className="text-[10px] font-bold text-white tracking-widest pointer-events-none">
                SHREDDER
              </div>
            </Html>
          </group>

          {/* Data Orbs */}
          {orbs.map((orb: DataOrb) => (
            <DataOrbComponent 
              key={orb.id} 
              orb={orb} 
              onClick={() => shredOrb(orb.id, orb.isThreat)}
              onHover={(val: boolean) => setHovered(val ? orb.id : null)}
            />
          ))}
        </group>
      </PresentationControls>
    </>
  )
}

function DataOrbComponent({ orb, onClick, onHover }: any) {
  return (
    <Float speed={5} rotationIntensity={2} floatIntensity={1} position={orb.position}>
      <mesh 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color={orb.color} 
          emissive={orb.color} 
          emissiveIntensity={0.5} 
          transparent 
          opacity={0.6} 
          wireframe
        />
        <Html distanceFactor={6} position={[0, 0.5, 0]}>
           <div className="bg-black/80 border border-white/10 p-2 rounded backdrop-blur-md w-32 pointer-events-none shadow-xl">
             <p className="text-[8px] font-bold text-white uppercase tracking-tighter mb-0.5">{orb.label}</p>
             <p className="text-[7px] text-gray-400 leading-tight">{orb.description}</p>
           </div>
        </Html>
      </mesh>
    </Float>
  )
}
