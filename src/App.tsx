import { Suspense, lazy, useEffect, useState, useMemo } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { BrowserRouter as Router, Link, Route, Routes, useParams, Outlet, useNavigate } from 'react-router-dom'
import './App.css'
import './components/cards/Cards.css'
import './components/ContentCard.css'
import './components/TopicPanel.css'
import Preloader from './components/Preloader'
import PlanetaryHUD from './components/PlanetaryHUD'
import OrbitalMap from './components/OrbitalMap'
import ChapterShell from './components/ChapterShell'
import { getBiomeFromTheme } from './components/background/SceneLighting'
import { VillainProfileCard } from './components/cards/VillainProfileCard'
import { PowerUpCard } from './components/cards/PowerUpCard'
import { ComicStripCard } from './components/cards/ComicStripCard'
import { BattleMeterCard } from './components/cards/BattleMeterCard'
import { EvidenceBoardCard } from './components/cards/EvidenceBoardCard'

import AchievementToast from './components/AchievementToast'
import ConfettiEffect from './components/ConfettiEffect'
import CodeEntryPopin from './components/CodeEntryPopin'
import Dashboard from './components/Dashboard'
import { GameProvider, useGameEngine, XP_REWARDS } from './gameEngine'
import {
  chapters,
  toSkillizeeImageUrl,
  toYouTubeEmbedUrl,
  type ChapterBlock,
  type ChapterLayout,
  type ChapterTab,
  type ComparisonItem,
  type CourseChapter,
  type LineChartSeries,
  type ResourceLink,
  type StatGridItem,
  type TimelineItem,
  type DecisionNode,
} from './courseData'

const Silk = lazy(() => import('./components/background/Silk'))

function isExternalLink(href: string) {
  return /^https?:\/\//.test(href)
}

function renderResourceLink(link: ResourceLink) {
  if (link.external || isExternalLink(link.href)) {
    return (
      <a key={link.href} href={link.href} className="resource-link-card" target="_blank" rel="noopener noreferrer">
        <strong>{link.label}</strong>
        <span>{link.description}</span>
      </a>
    )
  }

  return (
    <Link key={link.href} to={link.href} className="resource-link-card">
      <strong>{link.label}</strong>
      <span>{link.description}</span>
    </Link>
  )
}


function ChapterBriefing({ chapter }: { chapter: CourseChapter }) {
  return (
    <section className="chapter-briefing">
      <div className="chapter-briefing-grid">
        <article className="content-card chapter-briefing-lead">
          <span className="rail-label">Chapter Briefing</span>
          <h2>What this chapter is building</h2>
          <p>{chapter.summary}</p>
        </article>

        <article className="content-card chapter-briefing-signal">
          <span className="briefing-label">Status</span>
          <strong>{chapter.robotStatus}</strong>
        </article>

        <article className="content-card chapter-briefing-signal">
          <span className="briefing-label">Scrap fact</span>
          <strong>{chapter.scrapFact}</strong>
        </article>
      </div>

      <article className="content-card chapter-briefing-metrics">
        <div className="chapter-briefing-head">
          <span className="rail-label">Operational Lens</span>
          <p>The cards below carry the practical context that used to overload the hero.</p>
        </div>
        <div className="chapter-briefing-metric-grid">
          {chapter.featuredMetrics.map((metric) => (
            <article key={`${metric.label}-${metric.value}`} className="chapter-briefing-metric">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <p>{metric.detail}</p>
            </article>
          ))}
        </div>
      </article>
    </section>
  )
}

function renderStatGrid(items: StatGridItem[]) {
  return (
    <div className="stat-grid-block">
      {items.map((item) => (
        <article key={`${item.label}-${item.value}`} className="stat-grid-item">
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <p>{item.detail}</p>
        </article>
      ))}
    </div>
  )
}

function renderTimeline(items: TimelineItem[]) {
  return (
    <section className="content-card timeline-card">
      <div className="timeline-list">
        {items.map((item) => (
          <article key={`${item.step}-${item.title}`} className="timeline-item">
            <span className="timeline-step">{item.step}</span>
            <div>
              <h4>{item.title}</h4>
              <p>{item.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function renderComparison(items: ComparisonItem[]) {
  return (
    <section className="comparison-stack">
      {items.map((item) => (
        <article key={item.title} className="content-card comparison-card">
          <header>
            <span className="comparison-label">Decision Compare</span>
            <h4>{item.title}</h4>
          </header>
          <div className="comparison-grid">
            <div className="comparison-column comparison-column-risk">
              <span>{item.leftLabel}</span>
              <strong>{item.leftValue}</strong>
            </div>
            <div className="comparison-column comparison-column-win">
              <span>{item.rightLabel}</span>
              <strong>{item.rightValue}</strong>
            </div>
          </div>
          <p className="comparison-insight">{item.insight}</p>
        </article>
      ))}
    </section>
  )
}

function formatTrendValue(series: LineChartSeries, value: number) {
  const decimals = series.decimals ?? (Number.isInteger(value) ? 0 : value < 10 ? 2 : 1)
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)

  return `${series.valuePrefix ?? ''}${formatted}${series.valueSuffix ?? ''}`
}

function LineChartCard({ block }: { block: Extract<ChapterBlock, { type: 'lineChart' }> }) {
  const [activeSeriesIndex, setActiveSeriesIndex] = useState(0)
  const [hoverIndex, setHoverIndex] = useState(block.labels.length - 1)
  const activeSeries = block.series[activeSeriesIndex] ?? block.series[0]

  if (!activeSeries) return null

  const chartWidth = 160
  const chartHeight = 90
  const inset = { top: 12, bottom: 12, left: 8, right: 8 }
  
  const values = activeSeries.values
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  const valueRange = Math.max(maxValue - minValue, 1)
  
  const activePointIndex = Math.min(Math.max(hoverIndex, 0), values.length - 1)
  const activeValue = values[activePointIndex]
  const activeLabel = block.labels[activePointIndex]
  
  const firstValue = values[0]
  const lastValue = values[values.length - 1]
  const netChange = lastValue - firstValue
  const trendDirection = netChange >= 0 ? 'up' : 'down'

  const points = values.map((value, index) => {
    const x = inset.left + (index / (values.length - 1)) * (chartWidth - inset.left - inset.right)
    const y = chartHeight - inset.bottom - ((value - minValue) / valueRange) * (chartHeight - inset.top - inset.bottom)
    return { x, y }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`
  
  const yTicks = [
    { label: formatTrendValue(activeSeries, maxValue), y: inset.top },
    { label: formatTrendValue(activeSeries, minValue + valueRange / 2), y: (inset.top + (chartHeight - inset.bottom)) / 2 },
    { label: formatTrendValue(activeSeries, minValue), y: chartHeight - inset.bottom }
  ]

  return (
    <section className="trend-card">
      <div className="trend-card-head">
        <div className="trend-copy">
          <span className="media-pill">{block.eyebrow ?? 'Trend Scan'}</span>
          <h4>{block.title}</h4>
          <p className="media-note">{block.summary}</p>
        </div>
        <div className="trend-spotlight" style={{ '--accent-color': activeSeries.accentColor } as CSSProperties}>
          <span>{activeSeries.label}</span>
          <strong>{formatTrendValue(activeSeries, activeValue)}</strong>
          <p>{activeLabel}</p>
        </div>
      </div>

      <div className="trend-series-switches" role="tablist">
        {block.series.map((series, index) => (
          <button
            key={series.label}
            className={`trend-series-chip ${index === activeSeriesIndex ? 'active' : ''}`}
            onClick={() => {
              setActiveSeriesIndex(index)
              setHoverIndex(block.labels.length - 1)
            }}
            style={{ '--accent-color': series.accentColor } as CSSProperties}
          >
            <span className="trend-series-dot" />
            {series.label}
          </button>
        ))}
      </div>

      <div className="trend-chart-shell" onMouseLeave={() => setHoverIndex(block.labels.length - 1)}>
        <div className="trend-y-axis">
          {yTicks.map((tick, i) => (
            <span 
              key={i} 
              style={{ 
                position: 'absolute', 
                top: `${(tick.y / chartHeight) * 100}%`, 
                right: '12px',
                transform: 'translateY(-50%)',
                textAlign: 'right',
                whiteSpace: 'nowrap'
              }}
            >
              {tick.label}
            </span>
          ))}
        </div>

        <div className="trend-chart-panel">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="trend-chart" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`trend-gradient-${activeSeriesIndex}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={activeSeries.accentColor} stopOpacity="0.4" />
                <stop offset="100%" stopColor={activeSeries.accentColor} stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {yTicks.map((tick, i) => (
              <line key={i} x1="0" y1={tick.y} x2={chartWidth} y2={tick.y} className="trend-grid-line" />
            ))}

            <path d={areaPath} className="trend-area" fill={`url(#trend-gradient-${activeSeriesIndex})`} />
            <path d={linePath} className="trend-line" style={{ '--accent-color': activeSeries.accentColor } as CSSProperties} />
          </svg>

          {/* Interactive markers in HTML to prevent aspect ratio distortion */}
          {points.map((p, i) => (
            <div
              key={i}
              className={`trend-point-marker ${i === hoverIndex ? 'active' : ''}`}
              style={{
                position: 'absolute',
                left: `${(p.x / chartWidth) * 100}%`,
                top: `${(p.y / chartHeight) * 100}%`,
                transform: 'translate(-50%, -50%)',
                '--accent-color': activeSeries.accentColor
              } as CSSProperties}
              onMouseEnter={() => setHoverIndex(i)}
            />
          ))}

          <div
            className="trend-tooltip"
            style={{
              '--accent-color': activeSeries.accentColor,
              left: `${(points[activePointIndex].x / chartWidth) * 100}%`,
              top: `${(points[activePointIndex].y / chartHeight) * 100}%`,
            } as CSSProperties}
          >
            <strong>{formatTrendValue(activeSeries, activeValue)}</strong>
            <span>{activeLabel}</span>
          </div>
        </div>
      </div>

      <div className="trend-x-axis" style={{ position: 'relative', height: '28px', marginTop: '0.75rem' }}>
        {block.labels.map((label, i) => {
          const percent = ((inset.left + (i / (block.labels.length - 1)) * (chartWidth - inset.left - inset.right)) / chartWidth) * 100;
          return (
            <button
              key={label}
              className={`trend-x-tick ${i === activePointIndex ? 'active' : ''}`}
              onMouseEnter={() => setHoverIndex(i)}
              style={{
                position: 'absolute',
                left: `${percent}%`,
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="trend-insights">
        <article className="trend-insight-card">
          <span>Start</span>
          <strong>{formatTrendValue(activeSeries, firstValue)}</strong>
          <p>{block.labels[0]}</p>
        </article>
        <article className="trend-insight-card">
          <span>Peak</span>
          <strong>{formatTrendValue(activeSeries, maxValue)}</strong>
          <p>Highest Recorded</p>
        </article>
        <article className={`trend-insight-card trend-insight-${trendDirection}`}>
          <span>Net Change</span>
          <strong>{netChange >= 0 ? '+' : ''}{formatTrendValue(activeSeries, netChange)}</strong>
          <p>{activeSeries.detail}</p>
        </article>
      </div>

      {block.note && <p className="trend-note">{block.note}</p>}
    </section>
  )
}

function CourseMapCard({ chapters: mapChapters }: { chapters: Extract<ChapterBlock, { type: 'courseMap' }>['chapters'] }) {
  return (
    <section className="content-card course-map-card">
      <div className="course-map-track">
        {mapChapters.map((ch) => (
          <div key={ch.id} className={`map-node ${ch.status}`}>
            <div className="node-circle">
              <span className="node-id">{ch.id}</span>
              <div className="node-pulse" />
            </div>
            <div className="node-label">
              <strong>{ch.title}</strong>
              <span>{ch.status.toUpperCase()}</span>
            </div>
            <div className="node-connector" />
          </div>
        ))}
      </div>
    </section>
  )
}

function FlipCardComponent({ block }: { block: Extract<ChapterBlock, { type: 'flipCard' }> }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const getFlipBadge = (label: string) => {
    const normalized = label.toLowerCase()
    if (normalized.includes('battery')) return 'High-risk battery'
    if (normalized.includes('monitor')) return 'Legacy display'
    return 'Hazard item'
  }
  return (
    <div
      className={`flip-card-container ${isFlipped ? 'flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setIsFlipped(prev => !prev)
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
    >
      <div className="flip-card-inner">
        <article className="content-card flip-card-front">
          <div className="flip-front-copy">
            <span className="flip-badge">{getFlipBadge(block.front.label)}</span>
            <div className="flip-label">{block.front.label}</div>
            <p>Tap the card to inspect why this item becomes dangerous when dumped, broken, or burned.</p>
          </div>
          <div className="flip-hint">
            <span className="flip-hint-arrow" aria-hidden="true">↻</span>
            Click to flip
          </div>
        </article>
        <article className="content-card flip-card-back">
          <div className="flip-back-topline">
            <span className="flip-back-badge">Hazard breakdown</span>
            <h4>{block.back.title}</h4>
          </div>
          <ul className="flip-facts">
            {block.back.facts.map((fact, i) => <li key={i}>{fact}</li>)}
          </ul>
          <div className="flip-hint">
            <span className="flip-hint-arrow" aria-hidden="true">↺</span>
            Click to return
          </div>
        </article>
      </div>
    </div>
  )
}

function LiveTickerCard({ block }: { block: Extract<ChapterBlock, { type: 'liveTicker' }> }) {
  const [value, setValue] = useState(block.startValue)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setValue(v => v + (block.ratePerSecond / 10))
    }, 100)
    return () => clearInterval(interval)
  }, [block.ratePerSecond])

  return (
    <section className="content-card ticker-card">
      <div className="ticker-topline">
        <span className="ticker-badge">Live Counter</span>
        <div className="ticker-indicator">
          <span className="ticker-indicator-dot" aria-hidden="true" />
          Live update
        </div>
      </div>
      <span className="ticker-label">{block.label}</span>
      <div className="ticker-display">
        <div className="ticker-value">
          {Math.floor(value).toLocaleString()}
          <small>{block.unit}</small>
        </div>
        <div className="ticker-rate">+{block.ratePerSecond.toFixed(1)} {block.unit}/sec</div>
      </div>
      <div className="ticker-track" aria-hidden="true">
        <div className="ticker-track-fill" />
      </div>
    </section>
  )
}

function DragSortCard({ block }: { block: Extract<ChapterBlock, { type: 'dragSort' }> }) {
  const [items, setItems] = useState(block.items.map((item, id) => ({ ...item, id, status: 'pending' as 'pending' | 'correct' | 'wrong', image: item.image })))
  const [leftCount, setLeftCount] = useState(0)
  const [rightCount, setRightCount] = useState(0)
  const [feedback, setFeedback] = useState<{ id: number; side: 'left' | 'right'; isCorrect: boolean } | null>(null)
  
  const pendingItems = items.filter(i => i.status === 'pending')
  const activeItem = pendingItems[0]

  const handleSort = (itemId: number, side: 'left' | 'right') => {
    if (feedback) return
    const targetItem = items.find(i => i.id === itemId)
    if (!targetItem) return
    
    const isCorrect = targetItem.correct === side
    setFeedback({ id: itemId, side, isCorrect })
    
    setTimeout(() => {
      setItems(prev => prev.map(item => {
        if (item.id === itemId) {
          if (isCorrect) {
            if (side === 'left') setLeftCount(c => c + 1)
            else setRightCount(c => c + 1)
          }
          return { ...item, status: isCorrect ? 'correct' : 'wrong' }
        }
        return item
      }))
      setFeedback(null)
    }, 1000)
  }

  const getSortVisual = (label: string) => {
    const normalized = label.toLowerCase()
    if (normalized.includes('phone')) return '📱'
    if (normalized.includes('laptop')) return '💻'
    if (normalized.includes('tablet')) return '📱'
    if (normalized.includes('battery')) return '🔋'
    if (normalized.includes('bottle')) return '🥤'
    if (normalized.includes('banana')) return '🍌'
    return '📦'
  }

  return (
    <section className="content-card drag-sort-card">
      <div className="drag-sort-header">
        <div className="drag-sort-copy">
          <span className="drag-sort-badge">Quick Sort</span>
          <h4>{block.prompt}</h4>
          <p>Drag the card to the correct side. Put electronics and batteries into <strong>{block.leftBin}</strong>, and everyday trash into <strong>{block.rightBin}</strong>.</p>
        </div>
        <div className="drag-sort-stats">
          <div className="stat-box">
            <label>{block.leftBin}</label>
            <strong>{leftCount}</strong>
          </div>
          <div className="stat-box">
            <label>{block.rightBin}</label>
            <strong>{rightCount}</strong>
          </div>
        </div>
      </div>
      <div className="drag-sort-area">
        <div 
          className={`drop-zone drop-zone-left cursor-pointer transition-all duration-300 ${
            feedback && feedback.side === 'left'
              ? feedback.isCorrect 
                ? 'bg-green-100 border-green-500 border-dashed scale-105 shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                : 'bg-red-100 border-red-500 border-dashed animate-shake'
              : 'hover:bg-[#1A1A2E]/5'
          }`}
          onDragOver={e => e.preventDefault()}
          onClick={() => activeItem && handleSort(activeItem.id, 'left')}
        >
          <span className="drop-zone-icon" aria-hidden="true">♻️</span>
          <strong>{block.leftBin}</strong>
          <small>Devices, chargers, and batteries</small>
        </div>
        <div className="items-stack">
          <span className="items-stack-label">{pendingItems.length > 0 ? `Item ${items.length - pendingItems.length + 1} of ${items.length}` : 'Sorting complete'}</span>
          {activeItem ? (
            <div 
              key={activeItem.id} 
              className={`draggable-item relative transition-all duration-300 ${
                feedback 
                  ? feedback.isCorrect 
                    ? 'border-green-500 bg-green-50 shadow-[0_0_20px_rgba(34,197,94,0.4)] pointer-events-none scale-95 opacity-50' 
                    : 'border-red-500 bg-red-50 shadow-[0_0_20px_rgba(239,68,68,0.4)] pointer-events-none animate-shake' 
                  : ''
              }`}
              draggable={!feedback}
              onDragEnd={(e) => {
                if (feedback) return
                const rect = e.currentTarget.parentElement?.getBoundingClientRect()
                if (!rect) return
                if (e.clientX < rect.left + rect.width / 2) handleSort(activeItem.id, 'left')
                else handleSort(activeItem.id, 'right')
              }}
            >
              {feedback && (
                <div className={`absolute inset-0 flex flex-col items-center justify-center rounded-lg font-display text-xl font-bold uppercase tracking-wider z-20 ${
                  feedback.isCorrect ? 'text-green-600 bg-green-50/90' : 'text-red-600 bg-red-50/90'
                }`}>
                  <span className="text-3xl mb-1">{feedback.isCorrect ? '👍' : '👎'}</span>
                  <span>{feedback.isCorrect ? 'Correct!' : 'Incorrect'}</span>
                </div>
              )}
              <div className="draggable-item-visual">
                <span className="draggable-item-fallback" aria-hidden="true">{getSortVisual(activeItem.label)}</span>
                {activeItem.image ? (
                  <img
                    src={toSkillizeeImageUrl(activeItem.image)}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  null
                )}
              </div>
              <div className="draggable-item-copy">
                <span className="draggable-item-tag">Drag me</span>
                <strong>{activeItem.label}</strong>
                <small>Release left or right to classify this item</small>
              </div>
            </div>
          ) : (
            <div className="sort-complete">All sorted! The tray is clear.</div>
          )}
        </div>
        <div 
          className={`drop-zone drop-zone-right cursor-pointer transition-all duration-300 ${
            feedback && feedback.side === 'right'
              ? feedback.isCorrect 
                ? 'bg-green-100 border-green-500 border-dashed scale-105 shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                : 'bg-red-100 border-red-500 border-dashed animate-shake'
              : 'hover:bg-[#1A1A2E]/5'
          }`}
          onDragOver={e => e.preventDefault()}
          onClick={() => activeItem && handleSort(activeItem.id, 'right')}
        >
          <span className="drop-zone-icon" aria-hidden="true">🗑️</span>
          <strong>{block.rightBin}</strong>
          <small>Organic or regular household waste</small>
        </div>
      </div>
    </section>
  )
}

function ExplodedDiagramCard({ block }: { block: Extract<ChapterBlock, { type: 'explodedDiagram' }> }) {
  const [activeSpot, setActiveSpot] = useState(0)
  const currentSpot = block.hotspots[activeSpot]

  return (
    <section className="content-card exploded-card">
      <div className="exploded-header">
        <div className="exploded-copy">
          <span className="exploded-badge">Device Anatomy</span>
          <h4>What&apos;s Inside This Device?</h4>
          <p>Explore the numbered parts to see which materials carry value, risk, or recovery potential.</p>
        </div>
        <div className="exploded-stat">
          <span>Hotspots</span>
          <strong>{block.hotspots.length}</strong>
        </div>
      </div>

      <div className="exploded-layout">
        <div className="diagram-stage">
          <div className="diagram-container">
            <img
              src={toSkillizeeImageUrl(block.image)}
              alt="Exploded device diagram"
              className="diagram-img"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            <div className="diagram-fallback" aria-hidden="true">📱</div>
            {block.hotspots.map((spot, i) => (
              <button
                key={i}
                type="button"
                className={`hotspot ${activeSpot === i ? 'active' : ''}`}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                onClick={() => setActiveSpot(i)}
                aria-label={`Hotspot ${i + 1}: ${spot.label}`}
              >
                <span>{i + 1}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="spotlight-info">
          <div className="spotlight-panel">
            <span className="spotlight-badge">Hotspot {String(activeSpot + 1).padStart(2, '0')}</span>
            <h4>{currentSpot.label}</h4>
            <p>{currentSpot.detail}</p>
          </div>

          <div className="hotspot-list" role="tablist" aria-label="Device hotspots">
            {block.hotspots.map((spot, i) => (
              <button
                key={spot.label}
                type="button"
                className={`hotspot-list-item ${activeSpot === i ? 'active' : ''}`}
                onClick={() => setActiveSpot(i)}
                aria-pressed={activeSpot === i}
              >
                <span className="hotspot-list-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="hotspot-list-copy">
                  <strong>{spot.label}</strong>
                  <small>{spot.detail}</small>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function InteractivePieCard({ block }: { block: Extract<ChapterBlock, { type: 'interactivePie' }> }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const total = block.segments.reduce((acc, s) => acc + s.value, 0)
  const activeSegment = block.segments[activeIndex]

  const segmentsWithRotation = useMemo(() => {
    return block.segments.map((seg, i) => {
      const percentage = (seg.value / total) * 100
      const rotation = block.segments
        .slice(0, i)
        .reduce((sum, s) => sum + (s.value / total) * 360, 0)
      return {
        ...seg,
        percentage,
        rotation,
      }
    })
  }, [block.segments, total])

  return (
    <section className="content-card pie-card">
      <div className="pie-header">
        <div className="pie-copy">
          <span className="pie-badge">Material Mix</span>
          <h4>{block.title}</h4>
          <p>Hover or tap a segment to inspect which materials dominate device weight and which smaller layers still matter for value or risk.</p>
        </div>
        <div className="pie-highlight">
          <span>Largest share</span>
          <strong>{block.segments.reduce((max, seg) => seg.value > max.value ? seg : max).label}</strong>
        </div>
      </div>
      <div className="pie-layout">
        <div className="pie-visual">
          <svg viewBox="0 0 100 100" className="pie-svg" aria-label="Material composition chart">
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(148, 163, 184, 0.15)" strokeWidth="20" />
            {segmentsWithRotation.map((seg, i) => {
              const dashArray = `${seg.percentage} ${100 - seg.percentage}`
              return (
                <circle
                  key={seg.label}
                  cx="50" cy="50" r="40"
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth="20"
                  strokeDasharray={dashArray}
                  strokeDashoffset="25"
                  transform={`rotate(${seg.rotation} 50 50)`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onFocus={() => setActiveIndex(i)}
                  className={`pie-segment ${activeIndex === i ? 'active' : ''}`}
                />
              )
            })}
          </svg>
          <div className="pie-center">
            <span>Active layer</span>
            <strong>{activeSegment.value}%</strong>
            <p>{activeSegment.label}</p>
          </div>
        </div>
        <div className="pie-side">
          <div className="pie-detail-card">
            <span className="pie-detail-kicker">Selected Material</span>
            <h5>{activeSegment.label}</h5>
            <p>{activeSegment.detail}</p>
          </div>

          <div className="pie-legend">
          {block.segments.map((seg, i) => (
            <button
              key={seg.label}
              type="button"
              className={`legend-item ${activeIndex === i ? 'active' : ''}`}
              onMouseEnter={() => setActiveIndex(i)}
              onFocus={() => setActiveIndex(i)}
              onClick={() => setActiveIndex(i)}
            >
              <span className="dot" style={{ background: seg.color }} />
              <span className="legend-copy">
                <span className="label">{seg.label}</span>
                <span className="detail">{seg.detail}</span>
              </span>
              <span className="value">{seg.value}%</span>
            </button>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ValueCalculatorCard({ block }: { block: Extract<ChapterBlock, { type: 'valueCalculator' }> }) {
  const [count, setCount] = useState(10)
  const totalValue = block.materials.reduce((sum, mat) => sum + ((mat.perDevice * count) * mat.pricePerUnit), 0)
  return (
    <section className="content-card value-calc-card">
      <div className="calc-header">
        <div className="calc-copy">
          <span className="calc-badge">Recovery Estimator</span>
          <h4>Urban Mine Calculator</h4>
          <p>Estimate how much recoverable material sits inside a batch of discarded devices and how quickly small quantities add up.</p>
        </div>
        <div className="calc-summary">
          <span>Estimated total value</span>
          <strong>${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>
        </div>
      </div>
      <div className="input-group">
        <div className="input-topline">
          <label htmlFor="urban-mine-range">Number of devices to process</label>
          <strong>{count}</strong>
        </div>
        <div className="input-row">
          <span>1</span>
          <input id="urban-mine-range" type="range" min="1" max="1000" value={count} onChange={e => setCount(parseInt(e.target.value))} />
          <span>1000</span>
        </div>
        <div className="input-caption">Slide to model a larger collection batch.</div>
      </div>
      <div className="results-grid">
        {block.materials.map((mat, i) => {
          const amount = mat.perDevice * count
          const value = amount * mat.pricePerUnit

          return (
            <div key={i} className="result-tile">
              <div className="result-head">
                <span className="mat-name">{mat.name}</span>
                <span className="mat-share">{Math.round((value / totalValue) * 100) || 0}% of total</span>
              </div>
              <span className="mat-amount">{amount.toFixed(2)} {mat.unit}</span>
              <div className="mat-meta">
                <span className="mat-value">Est. Value: ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                <span className="mat-rate">${mat.pricePerUnit}/{mat.unit}</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function BeforeAfterCard({ block }: { block: Extract<ChapterBlock, { type: 'beforeAfter' }> }) {
  const [sliderPos, setSliderPos] = useState(50)
  return (
    <section className="content-card before-after-card">
      <div className="ba-header">
        <div className="ba-copy">
          <span className="ba-badge">Source Comparison</span>
          <h4>{block.leftLabel} vs {block.rightLabel}</h4>
          <p>Drag the slider to compare the impact of different material sources.</p>
        </div>
        <div className="ba-stat">
          <span>View split</span>
          <strong>{sliderPos}%</strong>
        </div>
      </div>
      <div className="ba-container">
        <div className="ba-layer ba-left" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
          <img
            src={toSkillizeeImageUrl(block.leftImage)}
            alt={block.leftLabel}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <div className="ba-fallback" aria-hidden="true">⛏️</div>
          <span className="ba-label">{block.leftLabel}</span>
        </div>
        <div className="ba-layer ba-right">
          <img
            src={toSkillizeeImageUrl(block.rightImage)}
            alt={block.rightLabel}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <div className="ba-fallback" aria-hidden="true">♻️</div>
          <span className="ba-label">{block.rightLabel}</span>
        </div>
        <div className="ba-overlay-copy">
          <strong>Material source comparison</strong>
          <span>Drag to inspect where metals come from before recovery.</span>
        </div>
        <input
          type="range"
          className="ba-slider"
          min="0" max="100"
          value={sliderPos}
          onChange={e => setSliderPos(parseInt(e.target.value))}
          aria-label="Compare raw ore mining and urban mining"
        />
        <div className="ba-handle" style={{ left: `${sliderPos}%` }}>
          <div className="handle-line" />
          <div className="handle-circle">↔️</div>
        </div>
      </div>
      <div className="ba-footer">
        <span>{block.leftLabel}</span>
        <span>{block.rightLabel}</span>
      </div>
    </section>
  )
}

function ChecklistCard({ block }: { block: Extract<ChapterBlock, { type: 'checklist' }> }) {
  const [checked, setChecked] = useState<Set<number>>(new Set())
  const { addXP, unlockAchievement } = useGameEngine()
  const [hasCompleted, setHasCompleted] = useState(false)

  const toggle = (i: number) => {
    const next = new Set(checked)
    if (next.has(i)) next.delete(i)
    else next.add(i)
    setChecked(next)

    if (next.size === block.items.length && !hasCompleted) {
      addXP(XP_REWARDS.DRAG_SORT_COMPLETE, 'Checklist Completed')
      unlockAchievement('recycler_pro')
      setHasCompleted(true)
    }
  }

  const progress = Math.round((checked.size / block.items.length) * 100)

  return (
    <section className="content-card checklist-card">
      <div className="checklist-items">
        {block.items.map((item, i) => (
          <div 
            key={i} 
            className={`checklist-item ${checked.has(i) ? 'is-checked' : ''}`}
            onClick={() => toggle(i)}
          >
            <div className="check-box">
              {checked.has(i) && <span>✓</span>}
            </div>
            <div className="check-copy">
              <strong>{item.label}</strong>
              <span>{item.impact}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="checklist-footer">
        <div className="checklist-score">
          <span>Completion</span>
          <strong>{progress}%</strong>
        </div>
        <div className="checklist-progress-bar">
          <div className="checklist-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </section>
  )
}

function SliderCalculatorCard({ block }: { block: Extract<ChapterBlock, { type: 'sliderCalculator' }> }) {
  const [values, setValues] = useState<number[]>(block.sliders.map(s => s.min))
  const { addXP, unlockAchievement } = useGameEngine()
  const [hasAwarded, setHasAwarded] = useState(false)

  const totalImpact = values.reduce((acc, v, i) => acc + (v * block.sliders[i].impactPerUnit), 0)
  const maxImpact = block.sliders.reduce((acc, slider) => acc + (slider.max * slider.impactPerUnit), 0)
  const progress = maxImpact > 0 ? Math.round((totalImpact / maxImpact) * 100) : 0

  const handleSliderChange = (i: number, val: number) => {
    setValues(prev => prev.map((v, idx) => idx === i ? val : v))
    if (!hasAwarded) {
      addXP(XP_REWARDS.CALCULATOR_USED, 'Calculator Analyzed')
      unlockAchievement('calculator_wizard')
      setHasAwarded(true)
    }
  }

  return (
    <section className="content-card slider-calc-card">
      <div className="slider-calc-header">
        <div className="slider-calc-copy">
          <span className="slider-calc-badge">Longevity Model</span>
          <h4>{block.title}</h4>
          <p>Turn repair and maintenance habits into a rough lifespan estimate. Small interventions compound before replacement becomes necessary.</p>
        </div>
        <div className="slider-calc-summary">
          <span>{block.resultLabel}</span>
          <strong>+{totalImpact.toFixed(1)} months</strong>
          <small>{progress}% of this calculator&apos;s full extension potential</small>
        </div>
      </div>
      <div className="sliders-stack">
        {block.sliders.map((s, i) => (
          <div key={i} className="slider-group">
            <div className="slider-labels">
              <div className="slider-copy">
                <span>{s.label}</span>
                <small>+{s.impactPerUnit} months when applied</small>
              </div>
              <strong>{values[i]} {s.unit}{values[i] === 1 ? '' : 's'}</strong>
            </div>
            <div className="slider-track-row">
              <span>{s.min}</span>
              <input
                type="range"
                min={s.min}
                max={s.max}
                value={values[i]}
                onChange={e => handleSliderChange(i, parseInt(e.target.value))}
                aria-label={s.label}
              />
              <span>{s.max}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="calc-result">
        <div className="calc-result-copy">
          <span>{block.resultLabel}</span>
          <strong>+{totalImpact.toFixed(1)} Months</strong>
        </div>
        <div className="calc-result-bar">
          <div className="calc-result-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </section>
  )
}

function IdeaGeneratorCard({ block }: { block: Extract<ChapterBlock, { type: 'ideaGenerator' }> }) {
  const [index, setIndex] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const idea = block.combinations[index]

  const spin = () => {
    setIsSpinning(true)
    setTimeout(() => {
      setIndex(Math.floor(Math.random() * block.combinations.length))
      setIsSpinning(false)
    }, 600)
  }

  return (
    <section className="content-card idea-card">
      <div className={`idea-content ${isSpinning ? 'spinning' : ''}`}>
        <div className="idea-topline">
          <span className={`difficulty-pill ${idea.difficulty}`}>{idea.difficulty.toUpperCase()}</span>
          <span className="idea-counter">Idea {index + 1} of {block.combinations.length}</span>
        </div>
        <div className="idea-route">
          <span className="idea-device">{idea.device}</span>
          <span className="idea-arrow" aria-hidden="true">→</span>
          <span className="idea-purpose">{idea.purpose}</span>
        </div>
        <p className="idea-note">Repurpose the device with a simple transformation path instead of sending it straight to storage or scrap.</p>
        <div className="idea-steps-card">
          <span className="idea-steps-label">Build sequence</span>
          <ol>
            {idea.steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </div>
      </div>
      <button className="spin-btn" onClick={spin} disabled={isSpinning}>
        {isSpinning ? 'Mixing...' : 'Inspire Me! 🎨'}
      </button>
    </section>
  )
}

function StoryCarouselCard({ block }: { block: Extract<ChapterBlock, { type: 'storyCarousel' }> }) {
  const [index, setIndex] = useState(0)
  const story = block.stories[index]
  return (
    <section className="content-card story-carousel">
      <div className="carousel-nav">
        <button onClick={() => setIndex(i => (i - 1 + block.stories.length) % block.stories.length)}>←</button>
        <span>{index + 1} / {block.stories.length}</span>
        <button onClick={() => setIndex(i => (i + 1) % block.stories.length)}>→</button>
      </div>
      <div className="story-frame">
        <div className="story-media">
          <img src={toSkillizeeImageUrl(story.image)} alt={story.title} />
          <div className="ba-badge">{story.before} vs {story.after}</div>
        </div>
        <div className="story-copy">
          <h4>{story.title}</h4>
          <blockquote>"{story.quote}"</blockquote>
        </div>
      </div>
    </section>
  )
}

function DecisionTreeCard({ block }: { block: Extract<ChapterBlock, { type: 'decisionTree' }> }) {
  const [currentNode, setCurrentNode] = useState<DecisionNode>(block.root)
  const [history, setHistory] = useState<DecisionNode[]>([])

  const select = (node: DecisionNode) => {
    setHistory([...history, currentNode])
    setCurrentNode(node)
  }

  const reset = () => {
    setCurrentNode(block.root)
    setHistory([])
  }

  return (
    <section className="content-card tree-card">
      <div className="tree-header">
        <div className="tree-header-copy">
          <span className="tree-badge">Decision Router</span>
          <span className="tree-step">Step {Math.min(history.length + 1, 3)}</span>
        </div>
        {history.length > 0 && <button className="back-btn" onClick={() => {
          const prev = history[history.length - 1]
          setHistory(history.slice(0, -1))
          setCurrentNode(prev)
        }}>← Back</button>}
      </div>
      <div className="tree-content">
        {currentNode.question ? (
          <div className="tree-question-card">
            <span className="tree-question-kicker">Device Triage Prompt</span>
            <p className="question">{currentNode.question}</p>
            <p className="tree-question-note">Choose the path that best matches the device state. The router will suggest the most practical next use.</p>
            <div className="tree-actions">
              <button className="btn-yes" onClick={() => select(currentNode.yes!)}>
                <span className="tree-action-label">Yes</span>
                <strong>Condition passes</strong>
              </button>
              <button className="btn-no" onClick={() => select(currentNode.no!)}>
                <span className="tree-action-label">No</span>
                <strong>Condition fails</strong>
              </button>
            </div>
          </div>
        ) : (
          <div className="tree-result">
            <span className="result-label">Recommended Action</span>
            <strong>{currentNode.result}</strong>
            <p className="tree-result-note">This route keeps usable value in circulation longer before recycling becomes the final step.</p>
            <button className="reset-btn" onClick={reset}>Restart Scan</button>
          </div>
        )}
      </div>
    </section>
  )
}

function ProcessSimulatorCard({ block }: { block: Extract<ChapterBlock, { type: 'processSimulator' }> }) {
  const [stage, setStage] = useState(0)
  return (
    <section className="content-card simulator-card">
      <div className="sim-track">
        {block.stages.map((s, i) => (
          <div key={i} className={`sim-node ${i <= stage ? 'active' : ''} ${i === stage ? 'current' : ''}`} onClick={() => setStage(i)}>
            <div className="sim-icon">{s.icon}</div>
            <div className="sim-line" />
          </div>
        ))}
      </div>
      <article className="stage-detail">
        <span className="stage-step">Stage {stage + 1}: {block.stages[stage].title}</span>
        <p>{block.stages[stage].description}</p>
        <div className="stage-output">
          <strong>Output:</strong> {block.stages[stage].output}
        </div>
      </article>
    </section>
  )
}

function QuizCard({ block }: { block: Extract<ChapterBlock, { type: 'quiz' }> }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const { addXP, unlockAchievement } = useGameEngine()
  
  const handleCheckAnswer = () => {
    setSubmitted(true)
    if (selected !== null && block.options[selected].correct) {
      addXP(XP_REWARDS.QUIZ_CORRECT, 'Quiz Answered Correctly')
      unlockAchievement('quiz_master')
    }
  }

  return (
    <section className="content-card quiz-block">
      <h4>{block.question}</h4>
      <div className="quiz-options">
        {block.options.map((opt, i) => (
          <button 
            key={i} 
            className={`quiz-opt ${selected === i ? 'selected' : ''} ${submitted && opt.correct ? 'correct' : ''} ${submitted && selected === i && !opt.correct ? 'wrong' : ''}`}
            onClick={() => !submitted && setSelected(i)}
            disabled={submitted}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {!submitted ? (
        <button className="submit-btn" disabled={selected === null} onClick={handleCheckAnswer}>Check Answer</button>
      ) : (
        <div className="quiz-feedback">
          <p>{block.options[selected!].explanation}</p>
          {block.options[selected!].correct && <div className="reward">Reward: {block.reward} 🎁</div>}
          <button className="reset-btn" onClick={() => { setSelected(null); setSubmitted(false); }}>Try Again</button>
        </div>
      )}
    </section>
  )
}

function MapLocatorCard({ block }: { block: Extract<ChapterBlock, { type: 'mapLocator' }> }) {
  const [active, setActive] = useState(0)
  const currentPoint = block.points[active]
  const { addXP, unlockAchievement } = useGameEngine()
  const [visited, setVisited] = useState<number[]>([0])

  const handlePointClick = (idx: number) => {
    setActive(idx)
    if (!visited.includes(idx)) {
      const nextVisited = [...visited, idx]
      setVisited(nextVisited)
      if (nextVisited.length === block.points.length) {
        addXP(XP_REWARDS.ALL_HOTSPOTS_EXPLORED, 'All Locations Explored')
        unlockAchievement('explorer_pro')
      }
    }
  }

  return (
    <section className="content-card map-locator">
      <div className="map-view">
        <svg viewBox="0 0 400 200" className="map-svg">
          <path d="M50,150 Q150,50 250,150 T450,150" fill="none" stroke="var(--line)" strokeWidth="2" strokeDasharray="4 4" />
          {block.points.map((_, i) => (
            <circle
              key={i}
              cx={50 + i * 150} cy={150 - (i % 2) * 40}
              r={active === i ? 10 : 6}
              className={`map-pin ${active === i ? 'active' : ''}`}
              fill={active === i ? 'var(--accent)' : 'var(--muted)'}
              onClick={() => handlePointClick(i)}
            />
          ))}
        </svg>
      </div>
      <div className="map-detail">
        <div className="point-info">
          <span className="point-type">E-Waste Facility</span>
          <h4>{currentPoint.label}</h4>
        </div>
        <button className="dir-btn">Get Directions</button>
      </div>
    </section>
  )
}

function CampaignWizardCard({ block }: { block: Extract<ChapterBlock, { type: 'campaignWizard' }> }) {
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  
  const current = block.steps[step]

  const handleSelect = (opt: string) => {
    const nextSelections = [...selections, opt]
    setSelections(nextSelections)
    if (step < block.steps.length - 1) {
      setStep(step + 1)
    } else {
      setShowResults(true)
    }
  }

  if (showResults) {
    return (
      <section className="content-card wizard-card">
        <div className="wizard-main">
          <span className="step-label">Strategy Complete</span>
          <h4>Impact Assessment</h4>
          <div className="wizard-feedback">
            <ul className="space-y-4">
              {block.steps.map((s, i) => (
                <li key={i} className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-muted uppercase">{s.title}</span>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-text">{selections[i]}</span>
                    <span className="text-xs text-success">Optimal Choice ✓</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <button className="wizard-opt-btn mt-6 text-center" onClick={() => { setStep(0); setSelections([]); setShowResults(false); }}>
            Refine Strategy
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="content-card wizard-card">
      <div className="wizard-stepper">
        {block.steps.map((_, i) => (
          <div key={i} className={`wizard-step-dot ${i <= step ? 'active' : ''}`} />
        ))}
      </div>
      <div className="wizard-main">
        <span className="step-label">Step {step + 1} of {block.steps.length}</span>
        <h4>{current.title}</h4>
        <p className="step-desc">{current.prompt}</p>
        <div className="wizard-options">
          {current.options.map((opt, i) => (
            <button 
              key={i} 
              className="wizard-opt-btn"
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function ImpactDashboardCard({ block }: { block: Extract<ChapterBlock, { type: 'impactDashboard' }> }) {
  return (
    <section className="content-card impact-dashboard">
      <div className="impact-grid">
        {block.stats.map((s, i) => (
          <div key={i} className="impact-stat">
            <span className="stat-label">{s.label}</span>
            <div className="stat-value">
              <strong>{s.value}</strong>
              <span className={`trend ${s.trend}`}>{s.trend === 'up' ? '↑' : '↓'}</span>
            </div>
            <p className="stat-detail">{s.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function DataWipeSimCard({ block }: { block: Extract<ChapterBlock, { type: 'dataWipeSim' }> }) {
  const [step, setStep] = useState(0)
  const currentStep = block.steps[step]
  
  return (
    <section className="content-card wipe-sim">
      <div className="sim-header">
        <h4>Wiping: {block.device}</h4>
        <div className="progress-bar">
          <div style={{ width: `${((step + 1) / block.steps.length) * 100}%` }} />
        </div>
      </div>
      <div className="wipe-step">
        <span className="step-title">{currentStep.title}</span>
        <p className="action">{currentStep.action}</p>
        <div className="risk-warning">
          <strong>Risk Analysis</strong>
          {currentStep.risk}
        </div>
      </div>
      <div className="sim-actions">
        {step > 0 && <button onClick={() => setStep(step - 1)}>Previous</button>}
        {step < block.steps.length - 1 ? (
          <button className="next-btn" onClick={() => setStep(step + 1)}>Execute Step</button>
        ) : (
          <button className="finish-btn" onClick={() => setStep(0)}>Process Completed ✅</button>
        )}
      </div>
    </section>
  )
}

function PolicyTimelineCard({ block }: { block: Extract<ChapterBlock, { type: 'policyTimeline' }> }) {
  return (
    <section className="content-card policy-timeline">
      <div className="timeline-stack">
        {block.events.map((e, i) => (
          <div key={i} className="timeline-entry">
            <div className="year-mark">{e.year}</div>
            <div className="entry-card">
              <span className="region-pill">{e.region}</span>
              <h4>{e.title}</h4>
              <p>{e.impact}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function renderBlock(block: ChapterBlock): ReactNode {
  if (block.type === 'paragraph') {
    return (
      <section className={`content-card story-card ${block.emphasis ? 'story-card-emphasis' : ''}`}>
        <p>{block.content}</p>
      </section>
    )
  }

  if (block.type === 'quote') {
    return (
      <section className="content-card quote-card">
        <span className="quote-badge">Fun Fact! 💡</span>
        <p>{block.content}</p>
        {block.author && <cite>{block.author}</cite>}
      </section>
    )
  }

  if (block.type === 'callout') {
    return (
      <section className={`content-card callout-card callout-${block.tone ?? 'signal'}`}>
        {block.eyebrow && <span className="callout-eyebrow">{block.eyebrow}</span>}
        <h4>{block.title}</h4>
        <p>{block.content}</p>
      </section>
    )
  }


  if (block.type === 'bulletList' || block.type === 'numberedList') {
    const ListTag = block.type === 'numberedList' ? 'ol' : 'ul'

    if (block.type === 'bulletList' && block.items.length > 5) {
      return (
        <section className="content-card bento-grid">
          {block.items.map((item, index) => {
            const [title, ...descParts] = item.split(': ')
            const desc = descParts.join(': ')
            return (
              <div key={index} className="bento-item">
                <div className="bento-icon">✨</div>
                <div className="flex flex-col gap-1">
                  <div className="bento-title">{title}</div>
                  {desc && <div className="bento-desc">{desc}</div>}
                </div>
              </div>
            )
          })}
        </section>
      )
    }

    if (block.type === 'bulletList' && block.items[0]?.startsWith('Recovered metals re-enter')) {
      return <InteractiveRecyclingOutputs />
    }

    if (block.type === 'bulletList' && block.items[0]?.startsWith('IT and communication devices')) {
      return (
        <section className="content-card border-4 border-[#1A1A2E] p-4 rounded-xl bg-[#FFFDF7] shadow-[6px_6px_0px_#1A1A2E] overflow-hidden">
          <div className="border-3 border-[#1A1A2E] rounded-lg overflow-hidden bg-white">
            <img src="/images/ewaste_infographic.png" alt="E-waste Categories Infographic" className="w-full h-auto block max-h-[600px] object-contain mx-auto" />
          </div>
        </section>
      )
    }

    if (block.type === 'bulletList' && block.items[0]?.startsWith('Adopt digital minimalism')) {
      return (
        <section className="content-card border-4 border-[#1A1A2E] p-4 rounded-xl bg-[#FFFDF7] shadow-[6px_6px_0px_#1A1A2E] overflow-hidden">
          <div className="border-3 border-[#1A1A2E] rounded-lg overflow-hidden bg-white">
            <img src="/images/reduction_steps.png" alt="Three Steps of Reduction Infographic" className="w-full h-auto block max-h-[600px] object-contain mx-auto" />
          </div>
        </section>
      )
    }

    if (block.type === 'bulletList' && block.items[0]?.startsWith('Large household appliances')) {
      return (
        <section className="content-card border-4 border-[#1A1A2E] p-4 rounded-xl bg-[#FFFDF7] shadow-[6px_6px_0px_#1A1A2E] overflow-hidden">
          <div className="border-3 border-[#1A1A2E] rounded-lg overflow-hidden bg-white">
            <img src="/images/ewaste_categories_detailed_infographic.png" alt="E-waste Categories Detailed Infographic" className="w-full h-auto block max-h-[600px] object-contain mx-auto" />
          </div>
        </section>
      )
    }

    if (block.type === 'bulletList' && block.items[0]?.startsWith('Lead from older displays')) {
      return (
        <section className="content-card border-4 border-[#1A1A2E] p-4 rounded-xl bg-[#FFFDF7] shadow-[6px_6px_0px_#1A1A2E] overflow-hidden">
          <div className="border-3 border-[#1A1A2E] rounded-lg overflow-hidden bg-white">
            <img src="/images/ewaste_toxins_infographic.png" alt="E-waste Dangers Infographic" className="w-full h-auto block max-h-[600px] object-contain mx-auto" />
          </div>
        </section>
      )
    }

    if (block.type === 'bulletList' && block.items[0]?.startsWith('Formal recycling protects workers')) {
      return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <div className="border-4 border-[#1A1A2E] p-6 rounded-2xl bg-[#FFFDF7] shadow-[6px_6px_0px_#1A1A2E] flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 hover:translate-x-1 hover:shadow-[10px_10px_0px_#1A1A2E] transition-all duration-300">
            <div className="absolute top-4 right-4 bg-[#FACC15] border-3 border-[#1A1A2E] text-[#1A1A2E] font-black text-lg px-3 py-1 rounded-lg transform rotate-6 shadow-[2px_2px_0px_#1A1A2E]">
              01
            </div>
            
            <div className="mb-6 w-14 h-14 bg-emerald-100 rounded-xl border-3 border-[#1A1A2E] flex items-center justify-center transform -rotate-3 group-hover:rotate-3 transition-transform shadow-[3px_3px_0px_#1A1A2E]">
              <svg className="w-8 h-8 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>

            <div>
              <h4 className="font-extrabold text-[#1A1A2E] text-lg mb-2">Formal Recycling</h4>
              <p className="text-slate-700 text-sm leading-relaxed font-bold">
                Protects workers under strict safety protocols while recovering high-purity saleable metals and materials.
              </p>
            </div>
          </div>

          <div className="border-4 border-[#1A1A2E] p-6 rounded-2xl bg-[#FFFDF7] shadow-[6px_6px_0px_#1A1A2E] flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 hover:translate-x-1 hover:shadow-[10px_10px_0px_#1A1A2E] transition-all duration-300">
            <div className="absolute top-4 right-4 bg-[#FACC15] border-3 border-[#1A1A2E] text-[#1A1A2E] font-black text-lg px-3 py-1 rounded-lg transform -rotate-6 shadow-[2px_2px_0px_#1A1A2E]">
              02
            </div>

            <div className="mb-6 w-14 h-14 bg-sky-100 rounded-xl border-3 border-[#1A1A2E] flex items-center justify-center transform rotate-6 group-hover:-rotate-6 transition-transform shadow-[3px_3px_0px_#1A1A2E]">
              <svg className="w-8 h-8 text-sky-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3 3L22 4" />
              </svg>
            </div>

            <div>
              <h4 className="font-extrabold text-[#1A1A2E] text-lg mb-2">Circular Design</h4>
              <p className="text-slate-700 text-sm leading-relaxed font-bold">
                Lowers dependence on volatile, hazardous, and fragile raw-material supply chains by keeping resources in use.
              </p>
            </div>
          </div>

          <div className="border-4 border-[#1A1A2E] p-6 rounded-2xl bg-[#FFFDF7] shadow-[6px_6px_0px_#1A1A2E] flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 hover:translate-x-1 hover:shadow-[10px_10px_0px_#1A1A2E] transition-all duration-300">
            <div className="absolute top-4 right-4 bg-[#FACC15] border-3 border-[#1A1A2E] text-[#1A1A2E] font-black text-lg px-3 py-1 rounded-lg transform rotate-3 shadow-[2px_2px_0px_#1A1A2E]">
              03
            </div>

            <div className="mb-6 w-14 h-14 bg-amber-100 rounded-xl border-3 border-[#1A1A2E] flex items-center justify-center transform -rotate-6 group-hover:rotate-6 transition-transform shadow-[3px_3px_0px_#1A1A2E]">
              <svg className="w-8 h-8 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            <div>
              <h4 className="font-extrabold text-[#1A1A2E] text-lg mb-2">Upstream Decisions</h4>
              <p className="text-slate-700 text-sm leading-relaxed font-bold">
                Repairability and disassembly decisions made at the design stage directly dictate how much resource value can be salvaged.
              </p>
            </div>
          </div>
        </section>
      )
    }

    return (
      <section className={`content-card list-card ${block.type === 'numberedList' ? 'list-numbered' : ''}`}>
        <ListTag>
          {block.items.map((item, index) => (
            <li key={`${item}-${index}`}>
              <span className="list-index">{String(index + 1).padStart(2, '0')}</span>
              <p>{item}</p>
            </li>
          ))}
        </ListTag>
      </section>
    )
  }

  if (block.type === 'statGrid') {
    return renderStatGrid(block.items)
  }

  if (block.type === 'timeline') {
    return renderTimeline(block.items)
  }

  if (block.type === 'comparison') {
    return renderComparison(block.items)
  }

  if (block.type === 'lineChart') {
    return <LineChartCard block={block} />
  }

  if (block.type === 'resourceLinks') {
    return (
      <section className="resource-link-grid">
        {block.items.map((item) => renderResourceLink(item))}
      </section>
    )
  }

  if (block.type === 'activity') {
    const toggleFullscreen = (e: React.MouseEvent) => {
      const container = e.currentTarget.closest('.activity-card')?.querySelector('.activity-iframe-container')
      if (container) {
        if (document.fullscreenElement) document.exitFullscreen()
        else container.requestFullscreen()
      }
    }

    return (
      <section className="content-card activity-card">
        <div className="activity-card-head">
          <div className="activity-card-copy">
            <span className="activity-pill">Game Time! 🎮</span>
            <div>
              <h4>{block.title}</h4>
              {block.summary && <p>{block.summary}</p>}
            </div>
          </div>
          <button className="card-fullscreen-btn" onClick={toggleFullscreen} title="Go Fullscreen">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path></svg>
          </button>
        </div>
        <div className="activity-iframe-container">
          <iframe 
            src={block.url} 
            className="activity-iframe"
            title={block.title}
          />
        </div>
      </section>
    )
  }

  if (block.type === 'video') {
    return (
      <section className="content-card media-card video-card">
        <div className="media-card-head">
          <span className="media-pill">Watch & Learn 📺</span>
          <div>
            <h4>{block.title}</h4>
            {block.note && <p className="media-note">{block.note}</p>}
          </div>
        </div>
        <div className="media-frame">
          <iframe
            src={toYouTubeEmbedUrl(block.url)}
            title={block.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>
    )
  }

  if (block.type === 'courseMap') {
    return <CourseMapCard chapters={block.chapters} />
  }

  if (block.type === 'flipCard') {
    return <FlipCardComponent block={block} />
  }

  if (block.type === 'liveTicker') {
    return <LiveTickerCard block={block} />
  }

  if (block.type === 'dragSort') {
    return <DragSortCard block={block} />
  }

  if (block.type === 'explodedDiagram') {
    return <ExplodedDiagramCard block={block} />
  }

  if (block.type === 'interactivePie') {
    return <InteractivePieCard block={block} />
  }

  if (block.type === 'valueCalculator') {
    return <ValueCalculatorCard block={block} />
  }

  if (block.type === 'beforeAfter') {
    return <BeforeAfterCard block={block} />
  }

  if (block.type === 'checklist') {
    return <ChecklistCard block={block} />
  }

  if (block.type === 'sliderCalculator') {
    return <SliderCalculatorCard block={block} />
  }

  if (block.type === 'ideaGenerator') {
    return <IdeaGeneratorCard block={block} />
  }

  if (block.type === 'storyCarousel') {
    return <StoryCarouselCard block={block} />
  }

  if (block.type === 'decisionTree') {
    return <DecisionTreeCard block={block} />
  }

  if (block.type === 'processSimulator') {
    return <ProcessSimulatorCard block={block} />
  }

  if (block.type === 'quiz') {
    return <QuizCard block={block} />
  }

  if (block.type === 'mapLocator') {
    return <MapLocatorCard block={block} />
  }

  if (block.type === 'campaignWizard') {
    return <CampaignWizardCard block={block} />
  }

  if (block.type === 'impactDashboard') {
    return <ImpactDashboardCard block={block} />
  }

  if (block.type === 'dataWipeSim') {
    return <DataWipeSimCard block={block} />
  }

  if (block.type === 'policyTimeline') {
    return <PolicyTimelineCard block={block} />
  }

  if (block.type === 'villainProfile') {
    return (
      <VillainProfileCard
        name={block.name}
        chemical={block.chemical}
        dangerLevel={block.dangerLevel}
        hideouts={block.hideouts}
        weakness={block.weakness}
        bounty={block.bounty}
        emoji={block.emoji}
        description={block.description}
      />
    )
  }

  if (block.type === 'powerUp') {
    return (
      <PowerUpCard
        title={block.title}
        superpower={block.superpower}
        hpReward={block.hpReward}
        icon={block.icon}
        description={block.description}
      />
    )
  }

  if (block.type === 'comicStrip') {
    return <ComicStripCard title={block.title} panels={block.panels} />
  }

  if (block.type === 'battleMeter') {
    return (
      <BattleMeterCard
        title={block.title}
        heroLabel={block.heroLabel}
        villainLabel={block.villainLabel}
        heroDesc={block.heroDesc}
        villainDesc={block.villainDesc}
        initialValue={block.initialValue}
      />
    )
  }

  if (block.type === 'evidenceBoard') {
    return <EvidenceBoardCard title={block.title} clues={block.clues} />
  }

  return (
    <section className={`image-grid ${block.columns ?? 'two'}`}>
      {block.images.map((image, index) => (
        <figure key={`${image.src}-${index}`} className="content-card image-card">
          <img src={toSkillizeeImageUrl(image.src)} alt={image.alt} loading="lazy" />
          <figcaption>{image.alt}</figcaption>
        </figure>
      ))}
    </section>
  )
}

function InteractiveRecyclingFlow() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      title: "1. CONSUMPTION",
      short: "Devices in Use",
      icon: "📱",
      details: "Laptops, smartphones, and appliances are used by consumers and businesses daily. This is where demand starts, driving the need for raw materials.",
      accent: "#facc15",
      badge: "CONSUME!",
      fun: "POW! Modern lives depend on tech!",
    },
    {
      title: "2. COLLECTION & TRIAGE",
      short: "Safe Sorting",
      icon: "🔋",
      details: "Discarded devices are sent to collection and sorted. Hazardous parts (like lithium-ion batteries) are removed first to prevent explosions and fires in shredders.",
      accent: "#2bc1a6",
      badge: "COLLECT!",
      fun: "BAM! Depolluting the waste stream first!",
    },
    {
      title: "3. PROCESSING",
      short: "Separation",
      icon: "⚙️",
      details: "Clean e-waste is shredded. Strong magnetic separators pull out steel, eddy currents isolate copper/aluminum, and sensors sort glass/plastic.",
      accent: "#61b8ff",
      badge: "PROCESS!",
      fun: "CLANG! Industrial machines sorting materials!",
    },
    {
      title: "4. RE-MANUFACTURING",
      short: "Circular Cycle",
      icon: "🏭",
      details: "Purified raw metals and high-quality sorted plastics are sent back to manufacturers to build new electronic products, reducing virgin mining.",
      accent: "#ff5e5e",
      badge: "RE-MAKE!",
      fun: "SHAZAM! Clean materials reborn as brand new tech!",
    }
  ]

  const active = steps[activeStep]

  return (
    <div className="comic-recycling-flow">
      <div className="comic-recycling-header">
        LIFECYCLE DETECTOR — CLICK A STEP TO TRACK MATERIALS
      </div>

      <div className="comic-recycling-grid">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`comic-recycling-card ${idx === activeStep ? 'active' : ''}`}
            onClick={() => setActiveStep(idx)}
            style={{
              '--step-accent': step.accent,
              '--step-bg': `${step.accent}12`
            } as CSSProperties}
          >
            <span className="comic-recycling-badge" style={{ borderColor: step.accent }}>
              {step.badge}
            </span>
            <span className="comic-recycling-icon">{step.icon}</span>
            <h4 className="comic-recycling-card-title">{step.title}</h4>
            <p className="comic-recycling-card-subtitle">{step.short}</p>
          </div>
        ))}
      </div>

      <div
        className="comic-recycling-bubble"
        style={{
          '--pointer-left': `${activeStep === 0 ? 12.5 : activeStep === 1 ? 37.5 : activeStep === 2 ? 62.5 : 87.5}%`,
          '--step-accent': active.accent
        } as CSSProperties}
      >
        <h4 className="comic-recycling-bubble-title" style={{ color: active.accent }}>
          <span>{active.icon}</span>
          <span>{active.title} — {active.fun}</span>
        </h4>
        <p className="comic-recycling-bubble-text">{active.details}</p>
      </div>
    </div>
  );
}

function InteractiveDigitalCitizenship() {
  const [layers, setLayers] = useState({
    auth: false,
    crypto: false,
    tracker: false,
    wipe: false
  });

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const activeCount = Object.values(layers).filter(Boolean).length;
  const strength = activeCount * 25;

  return (
    <div className="comic-privacy-shield">
      <div className="comic-privacy-header flex justify-between items-center text-slate-900">
        <span className="font-extrabold">DATA DEFENSE SYSTEM</span>
        <span className="text-[10px] bg-[#1A1A2E] text-white px-2 py-0.5 border border-white/20 font-mono">CORE: ONLINE</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {/* Visualizer Panel */}
        <div className="flex flex-col items-center justify-center p-4 bg-[#FFFDF7] border-4 border-[#1A1A2E] shadow-[4px_4px_0px_#1A1A2E] relative min-h-[250px]">
          {/* Animated Holographic Shield */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Base Rotating Grid */}
            <div className="absolute inset-0 border border-slate-200 rounded-full animate-[spin_20s_linear_infinite]" style={{ borderStyle: 'dashed' }}></div>
            
            {/* Outer Rings corresponding to defenses */}
            <div className={`absolute w-32 h-32 rounded-full border-3 transition-all duration-500 ${layers.wipe ? 'border-emerald-500 scale-100 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'border-dashed border-slate-300 scale-95'}`}></div>
            <div className={`absolute w-28 h-28 rounded-full border-3 transition-all duration-500 ${layers.tracker ? 'border-sky-500 rotate-45 shadow-[0_0_12px_rgba(14,165,233,0.3)]' : 'border-dashed border-slate-300'}`}></div>
            <div className={`absolute w-24 h-24 rounded-full border-3 transition-all duration-500 ${layers.crypto ? 'border-amber-500 -rotate-45 shadow-[0_0_12px_rgba(245,158,11,0.3)]' : 'border-dashed border-slate-300 scale-105'}`}></div>
            <div className={`absolute w-20 h-20 rounded-full border-3 transition-all duration-500 ${layers.auth ? 'border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.3)]' : 'border-dashed border-slate-300'}`}></div>

            {/* Central Shield Core */}
            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-3 border-[#1A1A2E] shadow-[2px_2px_0px_#1A1A2E] transition-all duration-500 ${strength === 100 ? 'bg-emerald-400' : strength > 0 ? 'bg-amber-400 animate-pulse' : 'bg-rose-400'}`}>
              <span className="text-xl">{strength === 100 ? '🛡️' : '🔓'}</span>
            </div>

            {/* Floating visual indicators */}
            {layers.auth && <span className="absolute top-2 left-2 text-[9px] bg-rose-100 border border-[#1A1A2E] font-bold px-1 rounded">2FA</span>}
            {layers.crypto && <span className="absolute top-2 right-2 text-[9px] bg-amber-100 border border-[#1A1A2E] font-bold px-1 rounded">AES</span>}
            {layers.tracker && <span className="absolute bottom-2 left-2 text-[9px] bg-sky-100 border border-[#1A1A2E] font-bold px-1 rounded">DNT</span>}
            {layers.wipe && <span className="absolute bottom-2 right-2 text-[9px] bg-emerald-100 border border-[#1A1A2E] font-bold px-1 rounded">WIPED</span>}
          </div>

          {/* Strength Bar */}
          <div className="w-full mt-4">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 mb-1">
              <span>SHIELD INTEGRITY</span>
              <span className={strength === 100 ? 'text-emerald-600' : strength > 0 ? 'text-amber-600' : 'text-rose-600'}>{strength}%</span>
            </div>
            <div className="h-4 bg-slate-100 border-2 border-[#1A1A2E] rounded-none overflow-hidden p-0.5 w-full">
              <div 
                className={`h-full transition-all duration-500 ${strength === 100 ? 'bg-emerald-400' : strength > 50 ? 'bg-amber-400' : 'bg-rose-400'}`}
                style={{ width: `${strength}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="flex flex-col gap-3 justify-center">
          <div 
            onClick={() => toggleLayer('auth')}
            className={`flex items-center gap-3 p-3 border-3 border-[#1A1A2E] shadow-[3px_3px_0px_#1A1A2E] cursor-pointer transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 ${layers.auth ? 'bg-rose-50' : 'bg-white hover:bg-slate-50'}`}
          >
            <div className="text-xl">🔑</div>
            <div className="flex-1 text-left">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase">2FA Authentication</h4>
              <p className="text-[9px] text-slate-500 font-medium leading-tight mt-0.5">Dual credentials lock down access.</p>
            </div>
            <div className={`text-[9px] font-extrabold px-2 py-0.5 border-2 border-[#1A1A2E] ${layers.auth ? 'bg-rose-400 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {layers.auth ? 'SECURED' : 'ENABLE'}
            </div>
          </div>

          <div 
            onClick={() => toggleLayer('crypto')}
            className={`flex items-center gap-3 p-3 border-3 border-[#1A1A2E] shadow-[3px_3px_0px_#1A1A2E] cursor-pointer transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 ${layers.crypto ? 'bg-amber-50' : 'bg-white hover:bg-slate-50'}`}
          >
            <div className="text-xl">💾</div>
            <div className="flex-1 text-left">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase">Storage Encryption</h4>
              <p className="text-[9px] text-slate-500 font-medium leading-tight mt-0.5">Scrambles local data files.</p>
            </div>
            <div className={`text-[9px] font-extrabold px-2 py-0.5 border-2 border-[#1A1A2E] ${layers.crypto ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 text-slate-600'}`}>
              {layers.crypto ? 'ENCRYPTED' : 'EXPOSED'}
            </div>
          </div>

          <div 
            onClick={() => toggleLayer('tracker')}
            className={`flex items-center gap-3 p-3 border-3 border-[#1A1A2E] shadow-[3px_3px_0px_#1A1A2E] cursor-pointer transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 ${layers.tracker ? 'bg-sky-50' : 'bg-white hover:bg-slate-50'}`}
          >
            <div className="text-xl">🌐</div>
            <div className="flex-1 text-left">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase">Ad-Tracker Block</h4>
              <p className="text-[9px] text-slate-500 font-medium leading-tight mt-0.5">Stops behavioral ad cookies.</p>
            </div>
            <div className={`text-[9px] font-extrabold px-2 py-0.5 border-2 border-[#1A1A2E] ${layers.tracker ? 'bg-sky-400 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {layers.tracker ? 'BLOCKED' : 'ALLOW'}
            </div>
          </div>

          <div 
            onClick={() => toggleLayer('wipe')}
            className={`flex items-center gap-3 p-3 border-3 border-[#1A1A2E] shadow-[3px_3px_0px_#1A1A2E] cursor-pointer transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 ${layers.wipe ? 'bg-emerald-50' : 'bg-white hover:bg-slate-50'}`}
          >
            <div className="text-xl">🧹</div>
            <div className="flex-1 text-left">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase">Old Account Purge</h4>
              <p className="text-[9px] text-slate-500 font-medium leading-tight mt-0.5">Deletes unused tech profiles.</p>
            </div>
            <div className={`text-[9px] font-extrabold px-2 py-0.5 border-2 border-[#1A1A2E] ${layers.wipe ? 'bg-emerald-400 text-white' : 'bg-slate-100 text-slate-600'}`}>
              {layers.wipe ? 'WIPED' : 'CLUTTERED'}
            </div>
          </div>
        </div>
      </div>

      {strength === 100 && (
        <div className="comic-privacy-victory mt-3 text-center border-t-3 border-[#1A1A2E] pt-3 pb-1 bg-emerald-50 text-emerald-800">
          <p className="text-xs font-extrabold uppercase tracking-wider">
            🎉 SHIELD FULLY CHARGED! DIGITAL CITIZENSHIP LEVEL MAXED!
          </p>
        </div>
      )}
    </div>
  );
}

function InteractiveRecyclingOutputs() {
  const [states, setStates] = useState<{
    [key: number]: {
      status: 'idle' | 'running' | 'done'
      progress: number
      result: string
    }
  }>({
    0: { status: 'idle', progress: 0, result: '' },
    1: { status: 'idle', progress: 0, result: '' },
    2: { status: 'idle', progress: 0, result: '' },
  })

  const cards = [
    {
      id: 0,
      title: "Recovered Metals",
      badge: "metals",
      accent: "#facc15",
      btnText: "Purity Check",
      runningText: "Refining...",
      description: "Recovered metals re-enter manufacturing when purity standards and collection economics align.",
      icon: (
        <svg className="w-10 h-10 text-[#facc15]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      results: [
        "🏆 GOLD & COPPER EXTRACTED! Purity levels exceed 99.8%! Ready for circuit boards.",
        "⚡ RE-MANUFACTURING BOUND! Reclaimed copper wire successfully sent to local grid supplier.",
        "✨ PRECIOUS METALS SALVAGED! High-grade silver ingot cast. Zero virgin mining needed!"
      ]
    },
    {
      id: 1,
      title: "Cleaned Plastics",
      badge: "polymers",
      accent: "#2bc1a6",
      btnText: "Pelletize",
      runningText: "Extruding...",
      description: "Cleaned plastics can be pelletized and reused in selected applications.",
      icon: (
        <svg className="w-10 h-10 text-[#2bc1a6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3 3L22 4" />
        </svg>
      ),
      results: [
        "🧪 PELLETIZED! Sorted ABS and polycarbonate plastics shredded and extruded into clean resin beads.",
        "🔄 LOOP CLOSED! Sorted high-density plastic sent to build new server frames.",
        "♻️ REUSE APPROVED! Shredded polymers successfully quality-checked for industrial housing."
      ]
    },
    {
      id: 2,
      title: "Toxic Residues",
      badge: "hazards",
      accent: "#ff5e5e",
      btnText: "Contain Hazard",
      runningText: "Sealing...",
      description: "Toxic residues must be contained so that recycling does not simply become another form of pollution transfer.",
      icon: (
        <svg className="w-10 h-10 text-[#ff5e5e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      results: [
        "🛡️ SHIELD ACTIVE! Hazardous leaded glass and cadmium dust safely sealed in secure concrete blocks.",
        "🔒 LEAK PROOF! Mercury vapor captured in sulfur-impregnated carbon filters. 0% atmospheric emission.",
        "🛑 SAFE CONTAINMENT! Acid sludge neutralized and deposited in double-lined hazardous waste cells."
      ]
    }
  ]

  const runProcessor = (id: number) => {
    setStates(prev => ({
      ...prev,
      [id]: { status: 'running', progress: 0, result: '' }
    }))

    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 10
      if (currentProgress >= 100) {
        clearInterval(interval)
        const card = cards.find(c => c.id === id)!
        const randomResult = card.results[Math.floor(Math.random() * card.results.length)]
        setStates(prev => ({
          ...prev,
          [id]: { status: 'done', progress: 100, result: randomResult }
        }))
      } else {
        setStates(prev => ({
          ...prev,
          [id]: { ...prev[id], progress: currentProgress }
        }))
      }
    }, 100)
  }

  return (
    <div className="comic-outputs-container">
      <div className="comic-outputs-header">
        RECYCLING OUTPUT STREAMS — ACTIVATE CONTROLS TO PROCESS
      </div>
      
      <div className="comic-outputs-grid">
        {cards.map((card) => {
          const state = states[card.id]
          return (
            <div 
              key={card.id} 
              className="comic-output-card"
              style={{
                '--btn-color': card.accent,
                '--progress-color': card.accent
              } as CSSProperties}
            >
              <div 
                className="comic-output-badge"
                style={{
                  background: card.accent,
                  color: card.id === 0 ? '#1A1A2E' : '#FFFFFF'
                }}
              >
                {card.badge}
              </div>
              
              <div>
                <div className="comic-output-icon-wrapper">
                  {card.icon}
                </div>
                <h4 className="comic-output-title">{card.title}</h4>
                <p className="comic-output-desc">{card.description}</p>
              </div>

              <div>
                <button 
                  onClick={() => runProcessor(card.id)}
                  disabled={state.status === 'running'}
                  className="comic-output-action-btn"
                >
                  {state.status === 'idle' && card.btnText}
                  {state.status === 'running' && card.runningText}
                  {state.status === 'done' && "Run Again 🔄"}
                </button>

                {state.status === 'running' && (
                  <div className="comic-progress-container">
                    <div 
                      className="comic-progress-bar" 
                      style={{ width: `${state.progress}%` }}
                    />
                    <div className="comic-progress-text">{state.progress}%</div>
                  </div>
                )}

                {state.status === 'done' && state.result && (
                  <div className="comic-output-result">
                    {state.result}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TopicPanel({ tab, layout }: { tab: ChapterTab; layout: ChapterLayout }) {
  return (
    <article
      id={`topic-${tab.id}`}
      className={`topic-panel topic-layout-${layout} topic-hero-${tab.heroVariant ?? 'signal'}`}
      style={{ '--accent-color': tab.accentColor ?? '#ff8b4d' } as CSSProperties}
    >
      <header className="topic-header">
        <div>
          <span className="topic-label">{tab.label}</span>
          <h2>{tab.title}</h2>
        </div>
        {tab.readingTime && <span className="topic-read">{tab.readingTime} min scan</span>}
      </header>

      <div className="topic-intro">
        <p className="topic-summary">{tab.summary}</p>
        <aside className="robot-note">
          <span className="robot-note-chip">Eco-Buddy Says 🤖</span>
          <p>{tab.robotNote}</p>
        </aside>
      </div>

      {tab.heroImage && (
        <div className="topic-banner">
          {tab.heroImage === '/images/ewaste_recycling_flow.png' ? (
            <InteractiveRecyclingFlow />
          ) : tab.heroImage === '/images/digital_citizenship.png' ? (
            <InteractiveDigitalCitizenship />
          ) : (
            <img src={toSkillizeeImageUrl(tab.heroImage)} alt={tab.title} />
          )}
        </div>
      )}

      <div className="pulse-strip">
        {tab.pulses.map((pulse) => (
          <div key={`${pulse.label}-${pulse.value}`} className="pulse-card">
            <span>{pulse.label}</span>
            <strong>{pulse.value}</strong>
          </div>
        ))}
      </div>

      <div className={`topic-blocks topic-blocks-${layout}`}>
        {(() => {
          const rendered: ReactNode[] = []
          let tempFlipCards: Extract<ChapterBlock, { type: 'flipCard' }>[] = []

          const flushFlipCards = (keyPrefix: string) => {
            if (tempFlipCards.length === 0) return
            rendered.push(
              <div key={`${keyPrefix}-flips`} className="topic-block-slot topic-block-flipCard-grid w-full">
                <div className="flip-cards-row-grid">
                  {tempFlipCards.map((fcBlock, fcIndex) => (
                    <FlipCardComponent key={fcIndex} block={fcBlock} />
                  ))}
                </div>
              </div>
            )
            tempFlipCards = []
          }

          tab.blocks.forEach((block, index) => {
            if (block.type === 'flipCard') {
              tempFlipCards.push(block)
            } else {
              flushFlipCards(`${tab.id}-${index}`)
              rendered.push(
                <div key={`${tab.id}-${index}`} className={`topic-block-slot topic-block-${block.type}`}>
                  {renderBlock(block)}
                </div>
              )
            }
          })
          flushFlipCards(`${tab.id}-end`)
          return rendered
        })()}
      </div>
    </article>
  )
}


function ChapterPage() {
  const { id } = useParams()
  const chapter = chapters.find((entry) => entry.id === id) ?? chapters[0]
  const chapterIndex = chapters.findIndex((entry) => entry.id === chapter.id)
  
  const { 
    state, 
    unlockChapter, 
    addXP, 
    unlockAchievement, 
    addRobotPart,
    restoreBiome
  } = useGameEngine()

  const previousChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : null
  const nextChapter = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })

    // Auto-restore biome on entering chapter
    const biomeKey = getBiomeFromTheme(chapter.themeKey)
    restoreBiome(biomeKey)

    if (!state.unlockedChapters.includes(chapter.id)) {
      unlockChapter(chapter.id)
      addXP(XP_REWARDS.CHAPTER_VIEW, `Chapter ${chapter.id} Scan`)

      if (chapter.id === '1-0') {
        unlockAchievement('first_chapter')
      }
      if (chapter.id === '2-0') {
        addRobotPart('head')
      }
      if (chapter.id === '4-0') {
        addRobotPart('torso')
      }
      if (chapter.id === '5-0') {
        addRobotPart('mobility')
      }
      if (chapter.id === '7-0') {
        addRobotPart('arm_l')
      }
    }
  }, [chapter.id])

  return (
    <ChapterShell
      chapter={chapter}
      previousChapter={previousChapter}
      nextChapter={nextChapter}
    >
      <ChapterBriefing chapter={chapter} />

      {chapter.tabs.map((tab) => (
        <TopicPanel key={tab.id} tab={tab} layout={chapter.layout} />
      ))}
    </ChapterShell>
  )
}

function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((error: Error) => {
        console.error(`Error attempting to enable fullscreen: ${error.message}`)
      })
      return
    }

    document.exitFullscreen()
  }

  return (
    <button
      onClick={toggleFullscreen}
      className="fullscreen-toggle"
      title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
    >
      {isFullscreen ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3v5H3" />
          <path d="M16 3v5h5" />
          <path d="M8 21v-5H3" />
          <path d="M16 21v-5h5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3h6v6" />
          <path d="M9 21H3v-6" />
          <path d="M21 3l-7 7" />
          <path d="M3 21l7-7" />
        </svg>
      )}
    </button>
  )
}










function AppLayout() {
  const { id } = useParams()
  const chapter = chapters.find((entry) => entry.id === id) ?? chapters[0]
  const silkColor = id && chapter ? chapter.accentColor : '#0ea5e9'
  const { state, addXP, unlockAchievement } = useGameEngine()
  const navigate = useNavigate()

  const [showCodeEntry, setShowCodeEntry] = useState(false)
  const [showPreloader, setShowPreloader] = useState(() => {
    return !sessionStorage.getItem('preloader_shown')
  })

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('preloader_shown', 'true')
    setShowPreloader(false)
  }

  return (
    <main className="page-shell">
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}
      
      <PlanetaryHUD
        xp={state.xp}
        level={state.level}
        planetHealth={Math.min(100, Math.round((state.unlockedChapters.filter(cid => chapters.some(c => c.id === cid)).length / chapters.length) * 100))}
        currentBiome={chapter ? chapter.themeKey : 'Space Hub'}
        biomeColor={chapter ? chapter.accentColor : '#0ea5e9'}
        onNavigateHome={() => navigate('/')}
        onNavigateObservatory={() => navigate('/dashboard')}
        onOpenScanner={() => setShowCodeEntry(true)}
      />

      <FullscreenButton />
      
      <div className="page-background" aria-hidden="true" style={{ backgroundColor: '#0B0F19' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, backgroundColor: 'rgba(11, 15, 25, 0.85)' }} />
        <Suspense fallback={null}>
          <Silk color={silkColor} speed={4} scale={1.2} noiseIntensity={1.5} rotation={0} />
        </Suspense>
      </div>

      <div className="content-layer" style={{ position: 'relative', zIndex: 10 }}>
        <div className="course-shell">
          <Outlet context={{}} />
        </div>
      </div>

      <AchievementToast />
      <ConfettiEffect />

      {showCodeEntry && (
        <CodeEntryPopin
          onSuccess={(code) => {
            addXP(XP_REWARDS.CODE_ENTERED, `Secret Code: ${code}`)
            unlockAchievement('secret_code')
          }}
          onClose={() => setShowCodeEntry(false)}
        />
      )}
    </main>
  )
}

function CaseBoardWrapper() {
  const { state } = useGameEngine()
  const navigate = useNavigate()

  const orbitalChapters = chapters.map((ch, idx) => {
    const isUnlocked = state.unlockedChapters.includes(ch.id)
    let status: 'completed' | 'current' | 'locked' = 'locked'
    if (isUnlocked) {
      const nextCh = chapters[idx + 1]
      if (!nextCh || state.unlockedChapters.includes(nextCh.id)) {
        status = 'completed'
      } else {
        status = 'current'
      }
    }
    return {
      id: ch.id,
      title: ch.title,
      moduleLabel: ch.moduleLabel,
      themeKey: ch.themeKey,
      accentColor: ch.accentColor,
      status,
    }
  })

  const planetHealth = Math.min(100, Math.round((state.unlockedChapters.filter(cid => chapters.some(c => c.id === cid)).length / chapters.length) * 100))

  return (
    <OrbitalMap
      chapters={orbitalChapters}
      planetHealth={planetHealth}
      onSelectChapter={(id) => navigate(`/${id}`)}
      onNavigateObservatory={() => navigate('/dashboard')}
    />
  )
}

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<CaseBoardWrapper />} />
            <Route path="/chapter/:id" element={<ChapterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/:id" element={<ChapterPage />} />
          </Route>
        </Routes>
      </Router>
    </GameProvider>
  )
}

export default App
