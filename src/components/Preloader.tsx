import { useEffect, useState } from 'react';
import './Preloader.css';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const duration = 2500; // 2.5 seconds total loading time
    const intervalTime = 25;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setIsDone(true);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 800); // matches CSS exit animation duration
  };

  return (
    <div className={`preloader-overlay ${isExiting ? 'preloader-exit' : ''}`}>
      {/* Space Background Starfield */}
      <div className="preloader-starfield">
        <div className="preloader-star pstar-1"></div>
        <div className="preloader-star pstar-2"></div>
        <div className="preloader-star pstar-3"></div>
      </div>

      <div className="preloader-content">
        <div className="preloader-visual">
          <div className="preloader-nebula"></div>
          {/* Assembling Planet Core */}
          <div className={`preloader-planet-sphere ${isDone ? 'formed' : ''}`} style={{ transform: `scale(${0.2 + (progress / 100) * 0.8})` }}></div>
          <div className="preloader-rings" style={{ transform: `scale(${0.3 + (progress / 100) * 0.7}) rotate(${progress * 1.8}deg)` }}></div>
        </div>

        <div className="preloader-text-group">
          <h1 className="preloader-main-title">SALVAGE QUEST</h1>
          <p className="preloader-subtitle">Recycling is your superpower. Defeat the toxins!</p>
        </div>

        <div className="preloader-progress-area">
          <div className="preloader-bar-outer">
            <div className="preloader-bar-inner" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="preloader-status">
            {!isDone ? (
              <span className="preloader-loading-label">
                {progress < 30 ? 'Tracking toxin villains...' :
                 progress < 60 ? 'Charging recycle power-ups...' :
                 progress < 90 ? 'Assembling Scrapbot armor...' :
                 'Readying Hero Points launcher...'}
              </span>
            ) : (
              <span className="preloader-loading-label success">HERO SCAN READY</span>
            )}
            <span className="preloader-pct-number">{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="preloader-enter-area">
          {isDone && (
            <div className="preloader-cta-box">
              <p className="preloader-quote">"Toxins are the villains, recycling is your superpower!"</p>
              <button className="terra-btn terra-btn--primary preloader-btn" onClick={handleEnter}>
                START QUEST
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
