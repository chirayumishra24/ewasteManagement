import React, { useState, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { CourseChapter } from '../courseData';

import './ChapterShell.css';

interface ChapterShellProps {
  chapter: CourseChapter;
  previousChapter: CourseChapter | null;
  nextChapter: CourseChapter | null;
  children: ReactNode;
}

export default function ChapterShell({
  chapter,
  previousChapter,
  nextChapter,
  children,
}: ChapterShellProps) {
  const shellRef = useRef<HTMLDivElement>(null);

  // Custom Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio setup
  const getAudioUrl = (id: string) => {
    if (id === '1-0') return 'https://pa2-cmd.github.io/audio_chapters_Ewaste/ttsmaker-file.mp3';
    return `https://pa2-cmd.github.io/audio_chapters_Ewaste/ewaste${id}.mp3`;
  };

  const audioUrl = getAudioUrl(chapter.id);
  const hasAudio = chapter.id !== '1-1';

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Audio playback failed:', err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setAudioCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setAudioDuration(audioRef.current.duration);
  };

  const handleAudioSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setAudioCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={shellRef}
      className={`chapter-shell-container comic-book-issue theme-${chapter.themeKey}`}
      style={{
        '--biome-accent': chapter.accentColor,
        '--biome-accent-glow': `${chapter.accentColor}33`,
        '--biome-active': chapter.accentColor,
      } as CSSProperties}
    >


      {/* Chapter Viewport Hero */}
      <section className="chapter-hero-viewport comic-cover-header">
        <div className="comic-halftone-overlay" />
        <div className="hero-content-wrap comic-title-panel">
          <span className="hero-kicker-badge comic-badge">
            {chapter.moduleLabel}
          </span>
          <h1 className="hero-chapter-title comic-title">{chapter.title}</h1>
          <p className="hero-chapter-summary comic-narrative">{chapter.summary}</p>
          
          <div className="hero-cta-row">
            <a href={`#topic-${chapter.tabs[0]?.id ?? 'overview'}`} className="comic-btn-primary">
              <span className="btn-skew-text">START MISSION ⚡</span>
            </a>
            {nextChapter && (
              <Link to={`/${nextChapter.id}`} className="comic-btn-secondary">
                <span className="btn-skew-text">NEXT ISSUE &gt;</span>
              </Link>
            )}
          </div>
        </div>

        {/* Dynamic Salvage Schematic Preview */}
        <div className="drone-schematic-card comic-panel">
          <div className="schematic-header">
            <span className="schematic-label comic-alert-badge">HERO GEAR SCHEMATIC</span>
            <h3>{chapter.assembly.title}</h3>
          </div>
          <p className="schematic-desc">{chapter.assembly.summary}</p>
          <div className="schematic-meta-row">
            <div className="meta-badge comic-badge-flat">
              ⚡ {chapter.assembly.schematic}
            </div>
            <div className="meta-badge comic-badge-flat text-gold">
              ★ {chapter.assembly.reward.replace('XP', 'Hero Points')}
            </div>
          </div>
        </div>
      </section>

      {/* Custom Audio Control Bar */}
      {hasAudio && (
        <div className="audio-restoration-player comic-panel comic-audio-player">
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />
          <button className="audio-play-btn comic-btn-play" onClick={togglePlay} aria-label={isPlaying ? 'Pause Narration' : 'Play Narration'}>
            {isPlaying ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <polygon points="6 4 20 12 6 20 6 4" />
              </svg>
            )}
          </button>
          
          <div className="audio-scrubber-container">
            <span className="audio-time">{formatTime(audioCurrentTime)}</span>
            <input
              type="range"
              className="audio-scrubber"
              min={0}
              max={audioDuration || 100}
              value={audioCurrentTime}
              onChange={handleAudioSeek}
            />
            <span className="audio-time">{formatTime(audioDuration)}</span>
          </div>

          <div className="audio-status-label">
            <span className="live-badge">HQ DISPATCH</span>
            <span className="audio-title">Intel Transmission {chapter.id}</span>
          </div>
        </div>
      )}

      {/* Main Chapter Content Split Layout */}
      <div className="chapter-split-layout">
        <main className="chapter-content-stage">
          {children}

          {/* Biome Restoration Complete Pager */}
          <section className="chapter-completion-pager comic-panel-end">
            <div className="pager-header">
              <span className="pager-kicker comic-alert-badge">MISSION COMPLETE</span>
              <h3>Next Adventure Sequence</h3>
              <p>You have successfully gathered the intel and completed the training loops for this Sector. Gear up for your next quest!</p>
            </div>
            
            <div className="pager-links-row">
              {previousChapter ? (
                <Link to={`/${previousChapter.id}`} className="pager-nav-link prev comic-nav-link">
                  <div className="nav-link-inner">
                    <span className="label">&lt; PREVIOUS MISSION</span>
                    <strong>{previousChapter.title}</strong>
                  </div>
                </Link>
              ) : (
                <div className="pager-nav-link disabled comic-nav-link-disabled">
                  <div className="nav-link-inner">
                    <span className="label">FIRST SECTOR</span>
                    <strong>Orientation HQ</strong>
                  </div>
                </div>
              )}

              {nextChapter ? (
                <Link to={`/${nextChapter.id}`} className="pager-nav-link next comic-nav-link">
                  <div className="nav-link-inner">
                    <span className="label">NEXT MISSION &gt;</span>
                    <strong>{nextChapter.title}</strong>
                  </div>
                </Link>
              ) : (
                <Link to="/dashboard" className="pager-nav-link next complete comic-nav-link complete">
                  <div className="nav-link-inner">
                    <span className="label">ALL SECECTORS SAVED</span>
                    <strong>Return to HQ</strong>
                  </div>
                </Link>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
