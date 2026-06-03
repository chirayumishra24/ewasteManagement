import React, { useRef, useState, useEffect } from 'react';
import './CustomVideoPlayer.css';

interface CustomVideoPlayerProps {
  src: string;
  title: string;
}

export default function CustomVideoPlayer({ src, title }: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  useEffect(() => {
    let timeoutId: number;

    const handleMouseMove = () => {
      setShowControls(true);
      window.clearTimeout(timeoutId);
      if (isPlaying) {
        timeoutId = window.setTimeout(() => {
          setShowControls(false);
          setShowSpeedMenu(false);
        }, 3000);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      window.clearTimeout(timeoutId);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Video playback failed:', err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const changePlaybackRate = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef} 
      className={`custom-video-player comic-panel ${isFullscreen ? 'fullscreen' : ''}`}
    >
      <video
        ref={videoRef}
        src={src}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        className="video-element"
      />

      {/* Large Pause Overlay Button */}
      {!isPlaying && (
        <div className="play-overlay" onClick={togglePlay}>
          <button className="play-overlay-btn" aria-label="Play video">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
              <polygon points="6 4 20 12 6 20 6 4" />
            </svg>
          </button>
        </div>
      )}

      {/* Title Bar */}
      <div className={`video-title-bar ${showControls ? 'visible' : 'hidden'}`}>
        <span className="title-text">{title}</span>
        <span className="live-tag">MISSION BRIEF</span>
      </div>

      {/* Video Control Bar */}
      <div className={`video-controls-bar ${showControls ? 'visible' : 'hidden'}`}>
        {/* Scrubber row */}
        <div className="scrubber-row">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="video-scrubber"
            style={{
              background: `linear-gradient(to right, var(--pow-yellow) ${(currentTime / (duration || 1)) * 100}%, var(--ink-dark) ${(currentTime / (duration || 1)) * 100}%)`
            }}
          />
        </div>

        {/* Controls action row */}
        <div className="controls-action-row">
          <div className="left-controls">
            <button 
              className="control-btn play-btn" 
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
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

            <div className="time-display">
              <span className="current-time">{formatTime(currentTime)}</span>
              <span className="time-divider">/</span>
              <span className="duration-time">{formatTime(duration)}</span>
            </div>

            <div className="volume-control">
              <button 
                className="control-btn mute-btn" 
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : volume < 0.5 ? (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="volume-slider"
                style={{
                  background: `linear-gradient(to right, var(--hero-blue) ${(isMuted ? 0 : volume) * 100}%, var(--ink-dark) ${(isMuted ? 0 : volume) * 100}%)`
                }}
              />
            </div>
          </div>

          <div className="right-controls">
            {/* Speed Control */}
            <div className="speed-control-wrapper">
              <button 
                className="control-btn speed-btn"
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              >
                <span className="btn-skew-text">{playbackRate}x</span>
              </button>
              {showSpeedMenu && (
                <div className="speed-dropdown comic-panel">
                  {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      className={`speed-option ${playbackRate === rate ? 'active' : ''}`}
                      onClick={() => changePlaybackRate(rate)}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button 
              className="control-btn fullscreen-btn" 
              onClick={toggleFullscreen}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 14h6v6" />
                  <path d="M20 10h-6V4" />
                  <path d="M14 10l7-7" />
                  <path d="M10 14l-7 7" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                  <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                  <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                  <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
