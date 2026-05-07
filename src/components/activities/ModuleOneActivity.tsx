import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'

type ModuleOneActivityId = 'hazard-xray' | 'device-autopsy' | 'urban-mine-valuator'

type ClassifierItem = {
  id: string
  name: string
  kind: 'e-waste' | 'not-ewaste'
  reason: string
  hazard: string
  value: string
}

type MaterialLayer = {
  id: string
  name: string
  group: 'bulk' | 'precious' | 'hazard'
  device: string
  note: string
}

const classifierItems: ClassifierItem[] = [
  {
    id: 'phone',
    name: 'Cracked smartphone',
    kind: 'e-waste',
    reason: 'It is a discarded electronic device with circuits, battery, glass, and metals.',
    hazard: 'Lithium battery and flame retardants',
    value: 'Gold, copper, silver',
  },
  {
    id: 'charger',
    name: 'Loose charger cable',
    kind: 'e-waste',
    reason: 'Accessories that carry power or connect devices also enter the e-waste stream.',
    hazard: 'Plastic additives',
    value: 'Copper wiring',
  },
  {
    id: 'bottle',
    name: 'Plastic water bottle',
    kind: 'not-ewaste',
    reason: 'It is recyclable plastic, but it has no electronic function or circuit system.',
    hazard: 'Plastic litter',
    value: 'PET recycling',
  },
  {
    id: 'monitor',
    name: 'Old monitor',
    kind: 'e-waste',
    reason: 'Displays are electronic devices and can contain hazardous components.',
    hazard: 'Lead or mercury in older displays',
    value: 'Glass, copper, circuit metals',
  },
  {
    id: 'battery',
    name: 'Used laptop battery',
    kind: 'e-waste',
    reason: 'Device batteries need special handling and must not go into normal bins.',
    hazard: 'Lithium, cobalt, fire risk',
    value: 'Cobalt, nickel, copper',
  },
  {
    id: 'paper',
    name: 'Printed worksheet',
    kind: 'not-ewaste',
    reason: 'Paper is part of the general recycling stream, not electronic waste.',
    hazard: 'Low toxicity',
    value: 'Paper fiber',
  },
]

const materialLayers: MaterialLayer[] = [
  {
    id: 'glass',
    name: 'Display glass',
    group: 'bulk',
    device: 'Phone screen',
    note: 'Bulk material that adds weight and needs controlled separation.',
  },
  {
    id: 'copper',
    name: 'Copper traces',
    group: 'precious',
    device: 'Circuit board',
    note: 'High-volume recoverable metal used in wiring and boards.',
  },
  {
    id: 'gold',
    name: 'Gold contacts',
    group: 'precious',
    device: 'Connectors',
    note: 'Tiny quantity, high value, and a key urban mining target.',
  },
  {
    id: 'plastic',
    name: 'Plastic casing',
    group: 'bulk',
    device: 'Outer shell',
    note: 'Common bulk material that may contain additives.',
  },
  {
    id: 'lead',
    name: 'Lead solder',
    group: 'hazard',
    device: 'Older boards',
    note: 'Toxic heavy metal that can contaminate soil and water.',
  },
  {
    id: 'cadmium',
    name: 'Cadmium cell',
    group: 'hazard',
    device: 'Older batteries',
    note: 'Hazardous material requiring formal processing.',
  },
]

const miningInputs = [
  { id: 'phones', label: 'Phones', value: 40, gold: 0.034, copper: 15, saved: 0.08 },
  { id: 'laptops', label: 'Laptops', value: 12, gold: 0.2, copper: 85, saved: 1.4 },
  { id: 'tablets', label: 'Tablets', value: 18, gold: 0.1, copper: 35, saved: 0.45 },
]

export default function ModuleOneActivity({ activityId }: { activityId: ModuleOneActivityId }) {
  if (activityId === 'device-autopsy') return <CompositionBench />
  if (activityId === 'urban-mine-valuator') return <UrbanMineDesk />
  return <WasteClassifier />
}

function WasteClassifier() {
  const [answers, setAnswers] = useState<Record<string, ClassifierItem['kind']>>({})
  const [selectedId, setSelectedId] = useState(classifierItems[0].id)
  const selected = classifierItems.find((item) => item.id === selectedId) ?? classifierItems[0]
  const answered = Object.keys(answers).length
  const correct = classifierItems.filter((item) => answers[item.id] === item.kind).length

  const choose = (id: string, kind: ClassifierItem['kind']) => {
    setAnswers((prev) => ({ ...prev, [id]: kind }))
    setSelectedId(id)
  }

  return (
    <section className="module-one-activity classifier-activity">
      <ActivityHeader
        kicker="Chapter 1.1"
        title="Digital Dump Sorter"
        copy="Decide what belongs in the e-waste stream, then inspect why each item matters."
        score={`${correct}/${classifierItems.length}`}
      />

      <div className="module-one-layout">
        <div className="classifier-list" aria-label="Items to classify">
          {classifierItems.map((item) => {
            const answer = answers[item.id]
            const status = answer ? (answer === item.kind ? 'correct' : 'wrong') : 'pending'

            return (
              <article
                key={item.id}
                className={`classifier-item ${selectedId === item.id ? 'active' : ''} ${status}`}
                onClick={() => setSelectedId(item.id)}
              >
                <div>
                  <span className="activity-chip">{item.kind === 'e-waste' ? 'Powered item' : 'Other waste'}</span>
                  <h5>{item.name}</h5>
                </div>
                <div className="classifier-actions">
                  <button onClick={(event) => { event.stopPropagation(); choose(item.id, 'e-waste') }}>
                    E-waste
                  </button>
                  <button onClick={(event) => { event.stopPropagation(); choose(item.id, 'not-ewaste') }}>
                    Not e-waste
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        <aside className="activity-inspector">
          <span className="activity-chip">Inspection note</span>
          <h4>{selected.name}</h4>
          <p>{selected.reason}</p>
          <div className="inspector-grid">
            <Metric label="Risk" value={selected.hazard} />
            <Metric label="Recoverable" value={selected.value} />
            <Metric label="Correct bin" value={selected.kind === 'e-waste' ? 'E-waste stream' : 'General recycling'} />
            <Metric label="Progress" value={`${answered} checked`} />
          </div>
        </aside>
      </div>
    </section>
  )
}

function CompositionBench() {
  const [sorted, setSorted] = useState<Record<string, MaterialLayer['group']>>({})
  const [selectedId, setSelectedId] = useState(materialLayers[0].id)
  const selected = materialLayers.find((layer) => layer.id === selectedId) ?? materialLayers[0]
  const correct = materialLayers.filter((layer) => sorted[layer.id] === layer.group).length

  const sortLayer = (group: MaterialLayer['group']) => {
    setSorted((prev) => ({ ...prev, [selected.id]: group }))
  }

  return (
    <section className="module-one-activity composition-activity">
      <ActivityHeader
        kicker="Chapter 1.2"
        title="Material Composition Bench"
        copy="Open a device inventory and sort each layer into bulk, precious, or hazardous material."
        score={`${correct}/${materialLayers.length}`}
      />

      <div className="composition-grid">
        <div className="device-stack" aria-label="Device material layers">
          {materialLayers.map((layer, index) => {
            const answer = sorted[layer.id]
            const state = answer ? (answer === layer.group ? 'correct' : 'wrong') : 'pending'

            return (
              <button
                key={layer.id}
                className={`device-layer ${layer.group} ${state} ${selectedId === layer.id ? 'active' : ''}`}
                style={{ '--layer-index': index } as CSSProperties}
                onClick={() => setSelectedId(layer.id)}
              >
                <span>{layer.device}</span>
                <strong>{layer.name}</strong>
              </button>
            )
          })}
        </div>

        <aside className="composition-panel">
          <span className="activity-chip">{selected.device}</span>
          <h4>{selected.name}</h4>
          <p>{selected.note}</p>
          <div className="sort-buttons" aria-label="Material sort bins">
            <button onClick={() => sortLayer('bulk')}>Bulk</button>
            <button onClick={() => sortLayer('precious')}>Precious</button>
            <button onClick={() => sortLayer('hazard')}>Hazard</button>
          </div>
          <div className="bin-summary">
            <Metric label="Bulk sorted" value={`${countSorted(sorted, 'bulk')}/2`} />
            <Metric label="Precious sorted" value={`${countSorted(sorted, 'precious')}/2`} />
            <Metric label="Hazards isolated" value={`${countSorted(sorted, 'hazard')}/2`} />
          </div>
        </aside>
      </div>
    </section>
  )
}

function UrbanMineDesk() {
  const [counts, setCounts] = useState<Record<string, number>>({
    phones: 40,
    laptops: 12,
    tablets: 18,
  })

  const totals = useMemo(() => {
    return miningInputs.reduce(
      (sum, item) => {
        const count = counts[item.id] ?? 0
        return {
          devices: sum.devices + count,
          gold: sum.gold + count * item.gold,
          copper: sum.copper + count * item.copper,
          saved: sum.saved + count * item.saved,
        }
      },
      { devices: 0, gold: 0, copper: 0, saved: 0 }
    )
  }, [counts])

  return (
    <section className="module-one-activity mining-activity">
      <ActivityHeader
        kicker="Chapter 1.3"
        title="Urban Mining Value Desk"
        copy="Build a small collection batch and see how recoverable materials turn waste into inventory."
        score={`${Math.round(totals.saved)} kg`}
      />

      <div className="mining-layout">
        <div className="mining-controls">
          {miningInputs.map((item) => (
            <label key={item.id} className="device-slider">
              <span>{item.label}</span>
              <strong>{counts[item.id]}</strong>
              <input
                type="range"
                min="0"
                max="100"
                value={counts[item.id]}
                onChange={(event) => setCounts((prev) => ({ ...prev, [item.id]: Number(event.target.value) }))}
              />
            </label>
          ))}
        </div>

        <div className="mining-output">
          <div className="ore-visual" aria-hidden="true">
            <span style={{ '--height': `${Math.min(100, totals.gold * 5)}%` } as CSSProperties} />
            <span style={{ '--height': `${Math.min(100, totals.copper / 35)}%` } as CSSProperties} />
            <span style={{ '--height': `${Math.min(100, totals.saved)}%` } as CSSProperties} />
          </div>
          <div className="inspector-grid">
            <Metric label="Devices collected" value={`${totals.devices}`} />
            <Metric label="Gold estimate" value={`${totals.gold.toFixed(1)} g`} />
            <Metric label="Copper estimate" value={`${Math.round(totals.copper)} g`} />
            <Metric label="Landfill avoided" value={`${totals.saved.toFixed(1)} kg`} />
          </div>
        </div>
      </div>
    </section>
  )
}

function ActivityHeader({
  kicker,
  title,
  copy,
  score,
}: {
  kicker: string
  title: string
  copy: string
  score: string
}) {
  return (
    <header className="module-one-activity-header">
      <div>
        <span>{kicker}</span>
        <h3>{title}</h3>
        <p>{copy}</p>
      </div>
      <div className="activity-score">
        <small>Score</small>
        <strong>{score}</strong>
      </div>
    </header>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="activity-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function countSorted(sorted: Record<string, MaterialLayer['group']>, group: MaterialLayer['group']) {
  return materialLayers.filter((layer) => layer.group === group && sorted[layer.id] === group).length
}
