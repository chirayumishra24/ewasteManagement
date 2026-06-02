import React, { useState, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
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

  const getAssemblyPartImage = (chapterId: string) => {
    return `https://login.skillizee.io/s/articles/6a1eb6edbb3c5fc28037e32e/images/robot_part_${chapterId.replace('-', '_')}.png`;
  };

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
          </div>
        </div>

        {/* Dynamic Salvage Schematic Preview Image */}
        <div className="drone-schematic-card comic-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper-warm)' }}>
          <img
            src={getAssemblyPartImage(chapter.id)}
            alt={chapter.assembly.title}
            style={{ width: '100%', height: 'auto', maxHeight: '280px', objectFit: 'contain', border: '3px solid var(--ink-dark)' }}
          />
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


        </main>
      </div>
    </div>
  );
}
