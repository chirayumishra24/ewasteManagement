import { Suspense, lazy, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { BrowserRouter as Router, Link, Navigate, Route, Routes, useParams } from 'react-router-dom'
import './App.css'
import { chapters, toSkillizeeImageUrl, toYouTubeEmbedUrl, type ChapterBlock, type ChapterTab } from './courseData'
import ActivityCanvas from './components/activities/ActivityCanvas'

const EWasteBackground = lazy(() => import('./components/background/EWasteBackground'))

function ScrapRobot({
  accentColor,
  unlockedParts,
}: {
  accentColor: string
  unlockedParts: Array<'head' | 'torso' | 'mobility'>
}) {
  const hasHead = unlockedParts.includes('head')
  const hasTorso = unlockedParts.includes('torso')
  const hasMobility = unlockedParts.includes('mobility')

  return (
    <div className="robot-stage" style={{ '--chapter-accent': accentColor } as CSSProperties} aria-hidden="true">
      <div className="robot-splash robot-splash-one" />
      <div className="robot-splash robot-splash-two" />
      <div className="robot-shadow" />
      <div className="robot-tag">SCRAP BOT</div>
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
        <div className={`robot-arm robot-arm-left ${hasTorso ? 'assembled' : 'hologram'}`}>
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
        <strong>R.U.S.T-01</strong>
        <span>Reassembled Unit for Salvage Training</span>
      </div>
    </div>
  )
}

function AssemblyBay({
  activeChapterId,
  chapterIndex,
}: {
  activeChapterId: string
  chapterIndex: number
}) {
  const activeChapter = chapters[chapterIndex]

  return (
    <div className="rail-card assembly-bay">
      <div className="assembly-bay-head">
        <span className="rail-label">Assembly Bay</span>
        <div className="assembly-percent">{Math.round(((chapterIndex + 1) / chapters.length) * 100)}%</div>
      </div>

      <article className="assembly-highlight">
        <div className="assembly-highlight-icon">{chapterIndex + 1}</div>
        <div>
          <span className="assembly-kicker">Unlocked this chapter</span>
          <h3>{activeChapter.assembly.title}</h3>
          <p>{activeChapter.assembly.summary}</p>
        </div>
      </article>

      <div className="assembly-track">
        {chapters.map((entry, index) => {
          const unlocked = index <= chapterIndex
          const active = entry.id === activeChapterId

          return (
            <Link
              key={entry.id}
              to={`/${entry.id}`}
              className={`assembly-link ${unlocked ? 'unlocked' : 'locked'} ${active ? 'active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <span className="assembly-link-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="assembly-link-copy">
                <strong>{entry.id}</strong>
                <small>{entry.assembly.schematic}</small>
              </span>
              <span className="assembly-link-status">
                {unlocked ? entry.assembly.reward : 'Locked'}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function renderChapterBlock(block: ChapterBlock) {
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
        <span className="quote-badge">Robot Memory</span>
        <p>{block.content}</p>
        {block.author && <cite>{block.author}</cite>}
      </section>
    )
  }

  if (block.type === 'bulletList' || block.type === 'numberedList') {
    const gridClassName = `scrap-grid scrap-grid-${block.items.length}`

    return (
      <section className={gridClassName}>
        {block.items.map((item, index) => (
          <article key={index} className="content-card scrap-card">
            <div className="scrap-card-index">{String(index + 1).padStart(2, '0')}</div>
            <p>{item}</p>
          </article>
        ))}
      </section>
    )
  }

  if (block.type === 'video') {
    return (
      <section className="content-card media-card">
        <div className="media-card-head">
          <span className="media-pill">Signal Feed</span>
          <h4>{block.title}</h4>
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
        {block.note && <p className="media-note">{block.note}</p>}
      </section>
    )
  }

  if (block.type === 'interactive3d') {
    return (
      <section className="content-card interactive-card">
        <div className="media-card-head">
          <span className="media-pill">Active Simulation</span>
          <h4>{block.title}</h4>
        </div>
        <div className="interactive-viewport">
          <ActivityCanvas activityId={block.activityId} />
        </div>
      </section>
    )
  }

  return (
    <section className={`image-grid ${block.columns ?? 'two'}`}>
      {block.images.map((image, index) => (
        <figure key={index} className="content-card image-card">
          <img src={toSkillizeeImageUrl(image.src)} alt={image.alt} loading="lazy" />
          <figcaption>{image.alt}</figcaption>
        </figure>
      ))}
    </section>
  )
}

function TopicPanel({ tab }: { tab: ChapterTab }) {
  return (
    <article
      id={`topic-${tab.id}`}
      className="topic-panel"
      style={{ '--topic-accent': tab.accentColor ?? '#f26b3a' } as CSSProperties}
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
          <img src={tab.heroImage} alt={tab.title} />
        </div>
      )}

      <div className="pulse-strip">
        {tab.pulses.map((pulse) => (
          <div key={pulse.label} className="pulse-card">
            <span>{pulse.label}</span>
            <strong>{pulse.value}</strong>
          </div>
        ))}
      </div>

      <div className="topic-blocks">
        {tab.blocks.map((block, index) => (
          <div key={index}>{renderChapterBlock(block)}</div>
        ))}
      </div>
    </article>
  )
}

function ChapterPage() {
  const { id } = useParams()
  const chapter = chapters.find((entry) => entry.id === id) ?? chapters[0]
  const chapterIndex = chapters.findIndex((entry) => entry.id === chapter.id)
  const progress = Math.round(((chapterIndex + 1) / chapters.length) * 100)
  const unlockedParts = chapters.slice(0, chapterIndex + 1).map((entry) => entry.assembly.part)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [chapter.id])

  return (
    <div className="course-shell">
      <header className="course-topbar">
        <div className="course-brand">
          <span className="brand-stamp">Skilizee E-Waste</span>
          <strong>Broken Robot Lab</strong>
        </div>
        <div className="course-progress">
          <span>Module progress</span>
          <strong>{progress}%</strong>
          <div className="course-progress-meter" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      <section className="hero-panel">
        <div className="hero-copy">
          <span className="hero-kicker">{chapter.moduleLabel} · Chapter {chapter.id}</span>
          <h1>{chapter.title}</h1>
          <p className="hero-summary">{chapter.summary}</p>
          <div className="hero-callouts">
            <div className="hero-callout">
              <span>Status</span>
              <strong>{chapter.robotStatus}</strong>
            </div>
            <div className="hero-callout">
              <span>Scrap fact</span>
              <strong>{chapter.scrapFact}</strong>
            </div>
          </div>
          <p className="hero-strapline">{chapter.strapline}</p>
          <div className="hero-actions" aria-label="Chapter shortcuts">
            <a href={`#topic-${chapter.tabs[0]?.id ?? 'overview'}`} className="hero-primary-link">
              Start lab scan
              <span aria-hidden="true">→</span>
            </a>
            <a href="#assembly-bay" className="hero-secondary-link">
              View robot build
            </a>
          </div>
        </div>

        <ScrapRobot accentColor={chapter.accentColor} unlockedParts={unlockedParts} />
      </section>

      <div className="chapter-layout">
        <aside className="chapter-rail">
          <div id="assembly-bay">
            <AssemblyBay activeChapterId={chapter.id} chapterIndex={chapterIndex} />
          </div>

          <div className="rail-card">
            <span className="rail-label">Learning Missions</span>
            <div className="rail-text-nav">
              {chapter.tabs.map((tab) => (
              <a key={tab.id} href={`#topic-${tab.id}`} className="rail-text-link">
                  <span className="rail-text-link-mark" aria-hidden="true">↳</span>
                  <span className="rail-text-link-copy">
                    <strong>{tab.label}</strong>
                    <small>{tab.title}</small>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </aside>

        <main className="chapter-stage">
          {chapter.tabs.map((tab) => (
            <TopicPanel key={tab.id} tab={tab} />
          ))}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <main className="page-shell">
        <div className="page-background" aria-hidden="true">
          <div className="page-background-tint" />
          <div className="page-background-scene">
            <Suspense fallback={<div className="hero-scene-fallback">Loading scrapyard scene...</div>}>
              <EWasteBackground />
            </Suspense>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Navigate to="/1-1" replace />} />
          <Route path="/chapter/:id" element={<ChapterPage />} />
          <Route path="/:id" element={<ChapterPage />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
