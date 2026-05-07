import { Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, Float, ContactShadows } from '@react-three/drei'
import ModuleOneActivity from './ModuleOneActivity'
import ModuleTwoActivity from './ModuleTwoActivity'

const RecyclerRadar = lazy(() => import('./RecyclerRadar'))
const DriveSimulator = lazy(() => import('./DriveSimulator'))
const DataShredder = lazy(() => import('./DataShredder'))
const IndiaPolicyMap = lazy(() => import('./IndiaPolicyMap'))

type ActivityId = 
  | 'hazard-xray'
  | 'device-autopsy'
  | 'urban-mine-valuator'
  | 'lifespan-lab'
  | 'upcycle-forge'
  | 'smelter-pipeline'
  | 'recycler-radar'
  | 'drive-simulator'
  | 'data-shredder'
  | 'india-policy-map'

interface ActivityCanvasProps {
  activityId: ActivityId
}

export default function ActivityCanvas({ activityId }: ActivityCanvasProps) {
  if (
    activityId === 'hazard-xray' ||
    activityId === 'device-autopsy' ||
    activityId === 'urban-mine-valuator'
  ) {
    return <ModuleOneActivity activityId={activityId} />
  }

  if (
    activityId === 'lifespan-lab' ||
    activityId === 'upcycle-forge' ||
    activityId === 'smelter-pipeline'
  ) {
    return <ModuleTwoActivity activityId={activityId} />
  }

  const renderActivity = () => {
    switch (activityId) {
      case 'recycler-radar': return <RecyclerRadar />
      case 'drive-simulator': return <DriveSimulator />
      case 'data-shredder': return <DataShredder />
      case 'india-policy-map': return <IndiaPolicyMap />
      default: return null
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
        <OrbitControls 
          enablePan={false} 
          maxPolarAngle={Math.PI / 1.8} 
          minDistance={4} 
          maxDistance={12} 
        />
        
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        
        <Environment preset="city" />

        <Suspense fallback={<Loader />}>
          {renderActivity()}
        </Suspense>

        <ContactShadows 
          position={[0, -1, 0]}
          resolution={1024} 
          scale={20} 
          blur={2} 
          opacity={0.35} 
          far={10} 
          color="#000000" 
        />
      </Canvas>
      
      <div className="activity-controls-hint">
        <span>LEFT CLICK TO INTERACT</span>
        <span>RIGHT CLICK TO ROTATE</span>
        <span>SCROLL TO ZOOM</span>
      </div>
    </div>
  )
}

function Loader() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#2f9f88" wireframe />
      </mesh>
    </Float>
  )
}
