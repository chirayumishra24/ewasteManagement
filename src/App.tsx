import { Suspense, lazy, useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { BrowserRouter as Router, Link, Navigate, Route, Routes, useParams } from 'react-router-dom'
import './App.css'
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
} from './courseData'

const EWasteBackground = lazy(() => import('./components/background/EWasteBackground'))

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

function ScrapRobot({
  accentColor,
  unlockedParts,
}: {
  accentColor: string
  unlockedParts: Array<'head' | 'torso' | 'mobility' | 'arm_l'>
}) {
  const hasHead = unlockedParts.includes('head')
  const hasTorso = unlockedParts.includes('torso')
  const hasMobility = unlockedParts.includes('mobility')
  const hasArmL = unlockedParts.includes('arm_l')

  return (
    <div className="robot-stage" style={{ '--chapter-accent': accentColor } as CSSProperties} aria-hidden="true">
      <div className="robot-grid" />
      <div className="robot-splash robot-splash-one" />
      <div className="robot-splash robot-splash-two" />
      <div className="robot-shadow" />
      <div className="robot-tag">R.U.S.T-01</div>
      <div className="robot-body">
        <div className={`robot-antenna ${hasHead ? 'assembled' : 'hologram'}`}>
          <span className="antenna-ball" />
        </div>
        <div className={`robot-head ${hasHead ? 'assembled' : 'hologram'}`}>
          <div className="robot-brow" />
          <div className="robot-eyes">
            <span className="robot-eye robot-eye-alert" />
            <span className="robot-eye robot-eye-cracked" />
          </div>
          <div className="robot-mouth">
            <span />
            <span />
            <span />
          </div>
          <div className="robot-bolt robot-bolt-left" />
          <div className="robot-bolt robot-bolt-right" />
        </div>
        <div className={`robot-arm robot-arm-left ${hasArmL ? 'assembled' : hasTorso ? 'assembled' : 'hologram'}`}>
          <span className="robot-joint" />
        </div>
        <div className={`robot-arm robot-arm-right ${hasTorso ? 'assembled' : 'hologram'} ${hasTorso ? 'broken' : ''}`}>
          <span className="robot-joint" />
        </div>
        <div className={`robot-torso ${hasTorso ? 'assembled' : 'hologram'}`}>
          <div className="torso-plate torso-plate-top" />
          <div className="torso-plate torso-plate-bottom" />
          <div className="torso-core">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={`robot-leg robot-leg-left ${hasMobility ? 'assembled' : 'hologram'}`} />
        <div className={`robot-leg robot-leg-right ${hasMobility ? 'assembled bent' : 'hologram'}`} />
        <div className={`robot-wheel ${hasMobility ? 'assembled' : 'hologram'}`} />
        {!hasHead && <div className="robot-scrap robot-scrap-one" />}
        {!hasTorso && <div className="robot-scrap robot-scrap-two" />}
      </div>
      <div className="robot-caption">
        <strong>Salvage Training Unit</strong>
        <span>Rebuilds as the course progresses.</span>
      </div>
    </div>
  )
}

function getHeroSubtitle(chapter: CourseChapter) {
  return chapter.strapline
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
        <div className="trend-spotlight" style={{ '--trend-accent': activeSeries.accentColor } as CSSProperties}>
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
            style={{ '--trend-accent': series.accentColor } as CSSProperties}
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
            <path d={linePath} className="trend-line" style={{ '--trend-accent': activeSeries.accentColor } as CSSProperties} />

            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={i === hoverIndex ? 3.5 : 2.2}
                className={`trend-point ${i === hoverIndex ? 'active' : ''}`}
                style={{ '--trend-accent': activeSeries.accentColor } as CSSProperties}
                onMouseEnter={() => setHoverIndex(i)}
              />
            ))}
          </svg>

          <div
            className="trend-tooltip"
            style={{
              '--trend-accent': activeSeries.accentColor,
              left: `${(points[activePointIndex].x / chartWidth) * 100}%`,
              top: `${(points[activePointIndex].y / chartHeight) * 100}%`,
            } as CSSProperties}
          >
            <strong>{formatTrendValue(activeSeries, activeValue)}</strong>
            <span>{activeLabel}</span>
          </div>
        </div>
      </div>

      <div className="trend-x-axis">
        {block.labels.map((label, i) => (
          <button
            key={label}
            className={`trend-x-tick ${i === activePointIndex ? 'active' : ''}`}
            onMouseEnter={() => setHoverIndex(i)}
          >
            {label}
          </button>
        ))}
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
        <span className="quote-badge">Lab Note</span>
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
    return (
      <section className="content-card activity-card">
        <div className="activity-card-copy">
          <span className="activity-pill">Interactive Lab</span>
          <div>
            <h4>{block.title}</h4>
            {block.summary && <p>{block.summary}</p>}
          </div>
        </div>
        <div className="activity-iframe-container">
          <iframe src={block.url} title={block.title} className="activity-iframe" allowFullScreen allow="fullscreen" />
        </div>
      </section>
    )
  }

  if (block.type === 'video') {
    return (
      <section className="content-card media-card">
        <div className="media-card-head">
          <span className="media-pill">Signal Feed</span>
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

function TopicPanel({ tab, layout }: { tab: ChapterTab; layout: ChapterLayout }) {
  return (
    <article
      id={`topic-${tab.id}`}
      className={`topic-panel topic-layout-${layout} topic-hero-${tab.heroVariant ?? 'signal'}`}
      style={{ '--topic-accent': tab.accentColor ?? '#ff8b4d' } as CSSProperties}
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
          <span className="robot-note-chip">R.U.S.T-01 Note</span>
          <p>{tab.robotNote}</p>
        </aside>
      </div>

      {tab.heroImage && (
        <div className="topic-banner">
          <img src={toSkillizeeImageUrl(tab.heroImage)} alt={tab.title} />
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
        {tab.blocks.map((block, index) => (
          <div key={`${tab.id}-${index}`} className={`topic-block-slot topic-block-${block.type}`}>
            {renderBlock(block)}
          </div>
        ))}
      </div>
    </article>
  )
}

function ChapterRail({ currentChapter }: { currentChapter: CourseChapter }) {
  return (
    <aside className="chapter-rail">
      <section className="rail-card rail-assembly-card">
        <span className="rail-label">Robot Upgrade</span>
        <h3>{currentChapter.assembly.title}</h3>
        <p>{currentChapter.assembly.summary}</p>
        <div className="rail-assembly-meta">
          <span>{currentChapter.assembly.schematic}</span>
          <strong>{currentChapter.assembly.reward}</strong>
        </div>
      </section>
    </aside>
  )
}

function ChapterPage() {
  const { id } = useParams()
  const chapter = chapters.find((entry) => entry.id === id) ?? chapters[0]
  const chapterIndex = chapters.findIndex((entry) => entry.id === chapter.id)
  const unlockedParts = chapters.slice(0, chapterIndex + 1).map((entry) => entry.assembly.part)
  const previousChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : null
  const nextChapter = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [chapter.id])

  return (
    <div
      className={`course-shell chapter-theme-${chapter.themeKey}`}
      style={{ '--chapter-accent': chapter.accentColor } as CSSProperties}
    >
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="hero-kicker">
            {chapter.moduleLabel} · Chapter {chapter.id}
          </span>
          <h1>{chapter.title}</h1>
          <p className="hero-subtitle">{getHeroSubtitle(chapter)}</p>
          <div className="hero-actions">
            <a href={`#topic-${chapter.tabs[0]?.id ?? 'overview'}`} className="hero-primary-link">
              Start lab scan
              <span aria-hidden="true">→</span>
            </a>
            {nextChapter && (
              <Link to={`/${nextChapter.id}`} className="hero-secondary-link">
                Next chapter
              </Link>
            )}
          </div>
        </div>

        <ScrapRobot accentColor={chapter.accentColor} unlockedParts={unlockedParts} />
      </section>

      <div className="chapter-layout">
        <ChapterRail currentChapter={chapter} />

        <main className="chapter-stage">
          <ChapterBriefing chapter={chapter} />

          <section className="topic-jump-card">
            <span className="rail-label">Chapter Sections</span>
            <div className="topic-jump-links">
              {chapter.tabs.map((tab) => (
                <a key={tab.id} href={`#topic-${tab.id}`} className="topic-jump-link">
                  <span>{tab.navLabel}</span>
                  <strong>{tab.title}</strong>
                </a>
              ))}
            </div>
          </section>

          {chapter.tabs.map((tab) => (
            <TopicPanel key={tab.id} tab={tab} layout={chapter.layout} />
          ))}

          <section className="chapter-pager">
            {previousChapter ? (
              <Link to={`/${previousChapter.id}`} className="chapter-nav-link">
                <span>Previous</span>
                <strong>{previousChapter.title}</strong>
              </Link>
            ) : (
              <div className="chapter-nav-link chapter-nav-link-placeholder">
                <span>Previous</span>
                <strong>Orientation hub is the first stop</strong>
              </div>
            )}
            {nextChapter ? (
              <Link to={`/${nextChapter.id}`} className="chapter-nav-link">
                <span>Next</span>
                <strong>{nextChapter.title}</strong>
              </Link>
            ) : (
              <div className="chapter-nav-link chapter-nav-link-placeholder">
                <span>Course complete</span>
                <strong>Move the final project into the real world</strong>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
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

function App() {
  return (
    <Router>
      <main className="page-shell">
        <FullscreenButton />
        <div className="page-background" aria-hidden="true">
          <div className="page-background-tint" />
          <div className="page-background-scene">
            <Suspense fallback={<div className="hero-scene-fallback">Loading salvage lab...</div>}>
              <EWasteBackground />
            </Suspense>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Navigate to="/1-0" replace />} />
          <Route path="/chapter/:id" element={<ChapterPage />} />
          <Route path="/:id" element={<ChapterPage />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
