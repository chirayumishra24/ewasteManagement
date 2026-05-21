import { useState } from 'react';
import './OrbitalMap.css';

interface ChapterItem {
  id: string;
  title: string;
  moduleLabel: string;
  themeKey: string;
  accentColor: string;
  status: 'completed' | 'current' | 'locked';
}

interface OrbitalMapProps {
  chapters: ChapterItem[];
  planetHealth: number;
  onSelectChapter: (chapterId: string) => void;
  onNavigateObservatory: () => void;
}

export default function OrbitalMap({
  chapters,
  planetHealth,
  onSelectChapter,
  onNavigateObservatory,
}: OrbitalMapProps) {
  const [hoveredChapter, setHoveredChapter] = useState<ChapterItem | null>(null);

  return (
    <div className="orbital-map-container comic-grid-layout">
      {/* Comic Page Header */}
      <div className="comic-page-header">
        <div className="comic-logo-burst">
          <span className="comic-logo-tagline">EPIC LEARNING QUEST</span>
          <h1 className="comic-logo-title">SALVAGE QUEST</h1>
        </div>
        <div className="comic-speech-bubble">
          <p className="bubble-text">Save the world from toxic e-waste! Choose an issue to start your training!</p>
          <div className="bubble-tail"></div>
        </div>
      </div>

      {/* Grid of Comic Book Covers/Panels */}
      <div className="comic-grid">
        {chapters.map((ch, idx) => {
          const isActive = ch.status !== 'locked';
          const issueNum = idx + 1;
          
          return (
            <div
              key={ch.id}
              className={`comic-panel-card ${ch.status} ${hoveredChapter?.id === ch.id ? 'hovered' : ''}`}
              style={{
                '--panel-accent': ch.accentColor,
              } as React.CSSProperties}
              onClick={() => isActive && onSelectChapter(ch.id)}
              onMouseEnter={() => setHoveredChapter(ch)}
              onMouseLeave={() => setHoveredChapter(null)}
            >
              <div className="comic-panel-inner">
                {/* Comic Badge */}
                <div className="comic-badge-issue">ISSUE #{issueNum}</div>

                {/* Cover Art/Vibe Container */}
                <div className="comic-cover-art" style={{ backgroundColor: `${ch.accentColor}1A` }}>
                  {/* Subtle decorative grid overlay */}
                  <div className="cover-grid-dots"></div>
                  
                  {/* Big Stylized Emoji/Symbol for chapter visual vibe */}
                  <div className="cover-emoji-burst">
                    {idx === 0 && '⚡'}
                    {idx === 1 && '🧪'}
                    {idx === 2 && '📱'}
                    {idx === 3 && '♻️'}
                    {idx === 4 && '🔋'}
                    {idx === 5 && '⚙️'}
                    {idx === 6 && '🛠️'}
                    {idx > 6 && '✦'}
                  </div>
                </div>

                {/* Panel Description Info */}
                <div className="comic-panel-info">
                  <span className="chapter-eyebrow" style={{ color: ch.accentColor }}>{ch.moduleLabel}</span>
                  <h3 className="chapter-title">{ch.title}</h3>
                  
                  {/* Status Indicator */}
                  <div className="chapter-status-row">
                    <span className={`status-tag ${ch.status}`}>
                      {ch.status === 'completed' && 'PASSED ✓'}
                      {ch.status === 'current' && 'NEXT ISSUE! ⚡'}
                      {ch.status === 'locked' && 'LOCKED 🔒'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comic Page Footer Actions */}
      <div className="comic-page-footer">
        <div className="progress-dossier">
          <span className="dossier-label">WORLD RECLAMATION INDEX</span>
          <div className="dossier-bar-wrap">
            <div className="dossier-bar-fill" style={{ width: `${planetHealth}%` }}></div>
            <span className="dossier-bar-text">{planetHealth}% SAVED</span>
          </div>
        </div>

        <button className="comic-btn-observatory" onClick={onNavigateObservatory}>
          <span className="btn-inner-text">📖 ENTER HERO HQ</span>
        </button>
      </div>
    </div>
  );
}
