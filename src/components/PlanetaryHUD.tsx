import { useEffect, useState } from 'react';
import './PlanetaryHUD.css';

interface PlanetaryHUDProps {
  xp: number;
  level: number;
  planetHealth: number; // 0-100
  currentBiome: string;
  biomeColor: string;
  onNavigateHome: () => void;
  onNavigateObservatory: () => void;
  onOpenScanner?: () => void;
}

export default function PlanetaryHUD({
  xp,
  level,
  planetHealth,
  currentBiome,
  biomeColor,
  onNavigateHome,
  onNavigateObservatory,
  onOpenScanner,
}: PlanetaryHUDProps) {
  const [xpGlow, setXpGlow] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    setXpGlow(true);
    const timer = setTimeout(() => setXpGlow(false), 600);
    return () => clearTimeout(timer);
  }, [xp]);

  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      setIsScrolling(prev => {
        if (!prev) return true;
        return prev;
      });
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const mainContainer = document.querySelector('.terra-scroll-container');
    if (mainContainer) {
      mainContainer.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (mainContainer) {
        mainContainer.removeEventListener('scroll', handleScroll);
      }
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Compute circular progress

  return (
    <div className="planetary-hud" data-scrolling={isScrolling ? 'true' : 'false'}>
      <div className="hud-left">
        <div className="hud-badge" style={{ '--biome-active': biomeColor } as React.CSSProperties}>
          <span className="biome-dot"></span>
          <span className="biome-name">{currentBiome || 'Orbital View'}</span>
        </div>
      </div>

      <div className="hud-center">
        <button className="hud-btn" onClick={onNavigateHome} title="Orbital Map">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
          </svg>
          <span className="hud-btn-text">Map</span>
        </button>
        <button className="hud-btn" onClick={onNavigateObservatory} title="Observatory">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          <span className="hud-btn-text">Observatory</span>
        </button>
        {onOpenScanner && (
          <button className="hud-btn" onClick={onOpenScanner} title="Scanner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3M7 12h10M12 7v10" />
            </svg>
            <span className="hud-btn-text">Scanner</span>
          </button>
        )}
      </div>

      <div className="hud-right">
        <div className={`hud-stat xp-stat ${xpGlow ? 'glow' : ''}`}>
          <span className="stat-label">HERO XP</span>
          <span className="stat-value">{xp}</span>
        </div>

        <div className="hud-stat lvl-stat">
          <span className="stat-label">RANK</span>
          <span className="stat-value">{level}</span>
        </div>

        <div className="health-gauge-comic" title={`Sector Recovery: ${planetHealth}%`}>
          <span className="health-label-comic">RECOVERY</span>
          <div className="health-bar-container-comic">
            <div className="health-bar-fill-comic" style={{ width: `${planetHealth}%`, backgroundColor: biomeColor || '#10b981' }} />
          </div>
          <span className="health-text-comic">{planetHealth}%</span>
        </div>
      </div>
    </div>
  );
}
