import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls, RoundedBox, Torus } from '@react-three/drei'
import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import * as THREE from 'three'

type ModuleTwoActivityId = 'lifespan-lab' | 'upcycle-forge' | 'smelter-pipeline'

type MaintenanceAction = {
  id: string
  label: string
  effect: string
  health: number
  battery: number
  heat: number
  wasteSaved: number
}

type ForgePart = {
  id: string
  label: string
  kind: 'phone' | 'tablet' | 'laptop' | 'router' | 'speaker' | 'circuit' | 'keys' | 'shell'
  color: string
}

type ForgeRecipe = {
  key: string
  title: string
  lesson: string
}

const maintenanceActions: MaintenanceAction[] = [
  {
    id: 'charge',
    label: 'Keep 20-80% charge',
    effect: 'Battery stress drops and useful life extends.',
    health: 10,
    battery: 18,
    heat: -8,
    wasteSaved: 0.4,
  },
  {
    id: 'clean',
    label: 'Clean dust vents',
    effect: 'Heat buildup falls, reducing component wear.',
    health: 12,
    battery: 4,
    heat: -20,
    wasteSaved: 0.3,
  },
  {
    id: 'repair',
    label: 'Replace battery only',
    effect: 'A targeted repair avoids replacing the full device.',
    health: 22,
    battery: 30,
    heat: -5,
    wasteSaved: 1.2,
  },
  {
    id: 'declutter',
    label: 'Remove unused apps',
    effect: 'Less storage pressure and fewer background processes.',
    health: 8,
    battery: 8,
    heat: -10,
    wasteSaved: 0.2,
  },
]

const forgeParts: ForgePart[] = [
  { id: 'phone', label: 'Old phone', kind: 'phone', color: '#72b7d2' },
  { id: 'tablet', label: 'Tablet screen', kind: 'tablet', color: '#8ccf7e' },
  { id: 'laptop', label: 'Old laptop', kind: 'laptop', color: '#a7b2c3' },
  { id: 'router', label: 'Wi-Fi router', kind: 'router', color: '#f2b36d' },
  { id: 'speaker', label: 'Broken speaker', kind: 'speaker', color: '#dd8f8a' },
  { id: 'circuit', label: 'Circuit board', kind: 'circuit', color: '#65b891' },
  { id: 'keys', label: 'Keyboard keys', kind: 'keys', color: '#d8d1c4' },
  { id: 'shell', label: 'CRT shell', kind: 'shell', color: '#b993d6' },
]

const forgeRecipes: ForgeRecipe[] = [
  {
    key: 'phone+router',
    title: 'Security camera node',
    lesson: 'Phones still have cameras, Wi-Fi, storage, and sensors even when they are too old for daily use.',
  },
  {
    key: 'circuit+keys',
    title: 'Circuit wall clock',
    lesson: 'Decorative reuse keeps non-hazardous parts in use and starts conversations about responsible disposal.',
  },
  {
    key: 'shell+speaker',
    title: 'Desktop planter',
    lesson: 'A housing can become a useful object after safe removal of wiring, batteries, and sharp parts.',
  },
  {
    key: 'laptop+tablet',
    title: 'Learning station',
    lesson: 'Older computers can become dedicated media, homework, signage, or recipe stations.',
  },
]

const recyclingSteps = [
  {
    id: 'sort',
    label: 'Manual sort',
    prompt: 'Remove batteries and reusable parts before shredding.',
    correct: 'battery',
    choices: [
      { id: 'battery', label: 'Isolate batteries' },
      { id: 'melt', label: 'Melt everything together' },
      { id: 'trash', label: 'Send plastics to landfill' },
    ],
  },
  {
    id: 'shred',
    label: 'Shred',
    prompt: 'Break remaining devices into small fractions for separation.',
    correct: 'small',
    choices: [
      { id: 'small', label: 'Create small uniform pieces' },
      { id: 'acid', label: 'Pour acid on whole devices' },
      { id: 'burn', label: 'Open burn the pile' },
    ],
  },
  {
    id: 'separate',
    label: 'Separate',
    prompt: 'Use physical properties to split material streams.',
    correct: 'magnet',
    choices: [
      { id: 'water', label: 'Paint all parts' },
      { id: 'magnet', label: 'Magnet, eddy current, density' },
      { id: 'skip', label: 'Skip to resale' },
    ],
  },
  {
    id: 'refine',
    label: 'Refine',
    prompt: 'Recover saleable metals and capture hazardous byproducts.',
    correct: 'electro',
    choices: [
      { id: 'electro', label: 'Smelt, refine, electrolysis' },
      { id: 'dump', label: 'Dump slag in soil' },
      { id: 'mix', label: 'Mix metals with plastics' },
    ],
  },
]

export default function ModuleTwoActivity({ activityId }: { activityId: ModuleTwoActivityId }) {
  if (activityId === 'upcycle-forge') return <ReuseForge />
  if (activityId === 'smelter-pipeline') return <RecyclePipeline />
  return <ReduceLab />
}

function ReduceLab() {
  const [health, setHealth] = useState(58)
  const [battery, setBattery] = useState(46)
  const [heat, setHeat] = useState(72)
  const [years, setYears] = useState(2.1)
  const [saved, setSaved] = useState(0)
  const [last, setLast] = useState<MaintenanceAction>(maintenanceActions[0])

  const apply = (action: MaintenanceAction) => {
    setHealth((value) => Math.min(100, value + action.health))
    setBattery((value) => Math.min(100, value + action.battery))
    setHeat((value) => Math.max(8, value + action.heat))
    setYears((value) => Math.min(5.2, value + action.wasteSaved * 0.8))
    setSaved((value) => value + action.wasteSaved)
    setLast(action)
  }

  return (
    <section className="module-two-activity reduce-lab">
      <ActivityPanel
        kicker="Chapter 2.1"
        title="Device Longevity Lab"
        copy="Apply reduce strategies and watch the same device last longer instead of becoming e-waste."
        score={`${years.toFixed(1)} yrs`}
      />

      <div className="module-two-stage">
        <Canvas camera={{ position: [0, 1.5, 7], fov: 42 }} dpr={[1, 1.5]}>
          <ambientLight intensity={1.1} />
          <directionalLight position={[4, 6, 5]} intensity={1.8} />
          <LongevityPhone health={health} battery={battery} heat={heat} />
          <OrbitControls enablePan={false} enableZoom={false} />
        </Canvas>
      </div>

      <aside className="module-two-controls">
        <div className="activity-fact">
          <span>Protocol effect</span>
          <strong>{last.label}</strong>
          <p>{last.effect}</p>
        </div>

        <div className="metric-strip">
          <Metric label="Health" value={`${Math.round(health)}%`} />
          <Metric label="Battery" value={`${Math.round(battery)}%`} />
          <Metric label="Heat" value={`${Math.round(heat)}%`} />
          <Metric label="Waste avoided" value={`${saved.toFixed(1)} kg`} />
        </div>

        <div className="action-grid">
          {maintenanceActions.map((action) => (
            <button key={action.id} onClick={() => apply(action)}>
              {action.label}
            </button>
          ))}
        </div>
      </aside>
    </section>
  )
}

function ReuseForge() {
  const [selected, setSelected] = useState<string[]>(['phone', 'router'])
  const recipe = getRecipe(selected)

  const toggle = (id: string) => {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      return [...current.slice(-1), id]
    })
  }

  return (
    <section className="module-two-activity reuse-forge">
      <ActivityPanel
        kicker="Chapter 2.2"
        title="Reuse Prototype Forge"
        copy="Choose two old components and prototype a useful second life before recycling becomes necessary."
        score={`${selected.length}/2`}
      />

      <div className="module-two-stage">
        <Canvas camera={{ position: [0, 2.2, 7], fov: 45 }} dpr={[1, 1.5]}>
          <ambientLight intensity={1.05} />
          <directionalLight position={[3, 5, 4]} intensity={1.7} />
          <ForgeScene selected={selected} recipe={recipe} />
          <OrbitControls enablePan={false} enableZoom={false} />
        </Canvas>
      </div>

      <aside className="module-two-controls">
        <div className="activity-fact">
          <span>Prototype result</span>
          <strong>{recipe?.title ?? 'No useful match yet'}</strong>
          <p>{recipe?.lesson ?? 'Pick two parts that still have a function, housing, display, sensor, or creative material value.'}</p>
        </div>

        <div className="part-grid">
          {forgeParts.map((part) => (
            <button
              key={part.id}
              className={selected.includes(part.id) ? 'active' : ''}
              onClick={() => toggle(part.id)}
              style={{ '--part-color': part.color } as CSSProperties}
            >
              <span />
              {part.label}
            </button>
          ))}
        </div>
      </aside>
    </section>
  )
}

function RecyclePipeline() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const current = recyclingSteps[step]
  const correctCount = recyclingSteps.filter((item) => answers[item.id] === item.correct).length

  const answer = (choice: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: choice }))
    if (choice === current.correct) {
      setStep((value) => Math.min(recyclingSteps.length - 1, value + 1))
    }
  }

  return (
    <section className="module-two-activity recycle-pipeline">
      <ActivityPanel
        kicker="Chapter 2.3"
        title="Formal Recycling Control Line"
        copy="Run the correct industrial sequence: sort hazards, shred, separate, then refine recoverable materials."
        score={`${correctCount}/${recyclingSteps.length}`}
      />

      <div className="module-two-stage">
        <Canvas camera={{ position: [0, 2.4, 8], fov: 48 }} dpr={[1, 1.5]}>
          <ambientLight intensity={1.1} />
          <directionalLight position={[3, 6, 5]} intensity={1.8} />
          <PipelineScene activeStep={step} answers={answers} />
          <OrbitControls enablePan={false} enableZoom={false} />
        </Canvas>
      </div>

      <aside className="module-two-controls">
        <div className="activity-fact">
          <span>{current.label}</span>
          <strong>{current.prompt}</strong>
          <p>Choose the safe formal-processing action. Correct choices move the 3D line forward.</p>
        </div>

        <div className="choice-list">
          {current.choices.map((choice) => {
            const answered = answers[current.id]
            const state = answered === choice.id ? (choice.id === current.correct ? 'correct' : 'wrong') : ''

            return (
              <button key={choice.id} className={state} onClick={() => answer(choice.id)}>
                {choice.label}
              </button>
            )
          })}
        </div>

        <div className="stage-dots">
          {recyclingSteps.map((item, index) => (
            <button
              key={item.id}
              className={index === step ? 'active' : answers[item.id] === item.correct ? 'done' : ''}
              onClick={() => setStep(index)}
              aria-label={item.label}
            />
          ))}
        </div>
      </aside>
    </section>
  )
}

function LongevityPhone({ health, battery, heat }: { health: number; battery: number; heat: number }) {
  const ref = useRef<THREE.Group>(null)
  const color = health > 75 ? '#5dbb75' : health > 55 ? '#f1b65c' : '#e06b5f'

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.18
  })

  return (
    <group ref={ref}>
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.22}>
        <RoundedBox args={[2.2, 3.9, 0.24]} radius={0.18} smoothness={5}>
          <meshStandardMaterial color="#dfe8e2" roughness={0.35} metalness={0.25} />
        </RoundedBox>
        <RoundedBox args={[1.9, 3.45, 0.28]} position={[0, 0, 0.04]} radius={0.12} smoothness={5}>
          <meshStandardMaterial color="#f8fcf6" roughness={0.28} />
        </RoundedBox>
        <mesh position={[0, -1.35, 0.22]}>
          <boxGeometry args={[1.35 * (battery / 100), 0.13, 0.04]} />
          <meshStandardMaterial color="#3a9d6f" />
        </mesh>
        <Torus args={[1.55, 0.035, 12, 80]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.18]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} />
        </Torus>
        <mesh position={[1.42, 0, 0.12]}>
          <sphereGeometry args={[0.12 + heat / 520, 24, 24]} />
          <meshStandardMaterial color="#e86f55" transparent opacity={0.45} />
        </mesh>
      </Float>
    </group>
  )
}

function ForgeScene({ selected, recipe }: { selected: string[]; recipe?: ForgeRecipe }) {
  const group = useRef<THREE.Group>(null)
  const selectedParts = selected.map((id) => forgeParts.find((part) => part.id === id)).filter(Boolean) as ForgePart[]

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.35
  })

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <circleGeometry args={[2.6, 64]} />
        <meshStandardMaterial color={recipe ? '#dff5dc' : '#eaf0f5'} />
      </mesh>
      <Torus args={[1.75, 0.04, 12, 96]} rotation={[Math.PI / 2, 0, 0]} position={[0, -1.18, 0]}>
        <meshStandardMaterial color={recipe ? '#4fa76d' : '#7599bd'} />
      </Torus>

      <group ref={group}>
        {selectedParts.map((part, index) => (
          <PartModel key={part.id} part={part} position={[index === 0 ? -0.9 : 0.9, 0, 0]} />
        ))}
        {recipe && <PrototypeModel recipe={recipe} />}
      </group>
    </group>
  )
}

function PartModel({ part, position }: { part: ForgePart; position: [number, number, number] }) {
  const scale: [number, number, number] =
    part.kind === 'phone' || part.kind === 'tablet' ? [0.65, 1.1, 0.12] :
    part.kind === 'laptop' ? [1.2, 0.18, 0.85] :
    part.kind === 'router' ? [0.9, 0.22, 0.55] :
    part.kind === 'speaker' ? [0.62, 0.62, 0.62] :
    [0.85, 0.6, 0.12]

  return (
    <Float speed={1.5} floatIntensity={0.18} rotationIntensity={0.18} position={position}>
      <RoundedBox args={scale} radius={0.06} smoothness={4}>
        <meshStandardMaterial color={part.color} roughness={0.45} metalness={0.15} />
      </RoundedBox>
    </Float>
  )
}

function PrototypeModel({ recipe }: { recipe: ForgeRecipe }) {
  if (recipe.title.includes('clock')) {
    return (
      <group position={[0, 0.8, 0]}>
        <Torus args={[0.6, 0.04, 12, 64]}>
          <meshStandardMaterial color="#2f8a5d" />
        </Torus>
        <mesh>
          <boxGeometry args={[0.08, 0.65, 0.04]} />
          <meshStandardMaterial color="#26322d" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.08, 0.45, 0.04]} />
          <meshStandardMaterial color="#26322d" />
        </mesh>
      </group>
    )
  }

  if (recipe.title.includes('planter')) {
    return (
      <group position={[0, 0.85, 0]}>
        <RoundedBox args={[1.1, 0.55, 0.7]} radius={0.12} smoothness={5}>
          <meshStandardMaterial color="#c17f8b" />
        </RoundedBox>
        <mesh position={[0, 0.45, 0]}>
          <coneGeometry args={[0.35, 0.8, 6]} />
          <meshStandardMaterial color="#4f9f63" />
        </mesh>
      </group>
    )
  }

  return (
    <group position={[0, 0.85, 0]}>
      <RoundedBox args={[1.15, 0.7, 0.12]} radius={0.08} smoothness={5}>
        <meshStandardMaterial color="#f8fbff" />
      </RoundedBox>
      <mesh position={[0, 0, 0.09]}>
        <circleGeometry args={[0.18, 32]} />
        <meshStandardMaterial color="#66a6d9" />
      </mesh>
    </group>
  )
}

function PipelineScene({ activeStep, answers }: { activeStep: number; answers: Record<string, string> }) {
  return (
    <group position={[0, -0.6, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]}>
        <planeGeometry args={[7.4, 2.2]} />
        <meshStandardMaterial color="#e7efe7" />
      </mesh>
      {recyclingSteps.map((stage, index) => (
        <PipelineStation
          key={stage.id}
          index={index}
          active={index === activeStep}
          complete={answers[stage.id] === stage.correct}
        />
      ))}
      <mesh position={[-2.7 + activeStep * 1.8, 0.15, 0]}>
        <boxGeometry args={[0.42, 0.32, 0.42]} />
        <meshStandardMaterial color="#6b8598" />
      </mesh>
    </group>
  )
}

function PipelineStation({
  index,
  active,
  complete,
}: {
  index: number
  active: boolean
  complete: boolean
}) {
  const color = complete ? '#4fa76d' : active ? '#e59f49' : '#9eabb3'
  const x = -2.7 + index * 1.8

  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 0.7, 32]} />
        <meshStandardMaterial color={color} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.92, 0.12, 0.7]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.52, 0.025, 8, 48]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {active && (
        <Torus args={[0.72, 0.025, 8, 72]} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.34, 0]}>
          <meshStandardMaterial color="#26322d" />
        </Torus>
      )}
    </group>
  )
}

function ActivityPanel({ kicker, title, copy, score }: { kicker: string; title: string; copy: string; score: string }) {
  return (
    <header className="module-two-header">
      <div>
        <span>{kicker}</span>
        <h3>{title}</h3>
        <p>{copy}</p>
      </div>
      <div className="module-two-score">
        <small>Learning score</small>
        <strong>{score}</strong>
      </div>
    </header>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="module-two-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function getRecipe(selected: string[]) {
  if (selected.length !== 2) return undefined
  const key = selected.slice().sort().join('+')
  return forgeRecipes.find((recipe) => recipe.key === key)
}
