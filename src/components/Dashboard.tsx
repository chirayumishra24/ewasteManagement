import { useGameEngine, ALL_ACHIEVEMENTS, LEVELS } from '../gameEngine';
import { chapters } from '../courseData';
import './Dashboard.css';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { state } = useGameEngine();
  const currentXP = state.xp;
  const currentLevel = state.level;
  const nextLevelXP = LEVELS[currentLevel] || currentXP;
  const prevLevelXP = LEVELS[currentLevel - 1] || 0;
  const levelProgress = nextLevelXP - prevLevelXP > 0
    ? ((currentXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100
    : 100;

  // Assembly parts status helper
  const isPartUnlocked = (part: string) => state.robotParts.includes(part);

  // Global planetary restoration percentage based on completed chapters
  const totalChaptersCount = chapters.length;
  const completedChaptersCount = chapters.filter(ch => state.unlockedChapters.includes(ch.id)).length;
  const planetHealth = Math.round((completedChaptersCount / totalChaptersCount) * 100) || 0;

  // Compute circular progress for dashboard gauge
  const radius = 64;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (planetHealth / 100) * circumference;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <Link to="/" className="back-link">
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Orbital Map
        </Link>
        <h2 className="dashboard-title text-shadow-pop">Terra Observatory</h2>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Planetary Health & Salvage Drone Upgrades */}
        <div className="dashboard-column">
          {/* Planet Health Panel */}
          <div className="comic-panel-card health-dossier-panel">
            <h3 className="panel-title">SECTOR ECO-RECOVERY</h3>
            
            <div className="gauge-display-wrapper">
              <div className="obs-gauge-container">
                <svg className="obs-svg" width="160" height="160">
                  <circle className="obs-svg-bg" cx="80" cy="80" r={radius} strokeWidth={strokeWidth} />
                  <circle
                    className="obs-svg-fill"
                    cx="80"
                    cy="80"
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform="rotate(-90 80 80)"
                  />
                </svg>
                <div className="obs-gauge-center">
                  <span className="obs-health-pct">{planetHealth}%</span>
                  <span className="obs-health-label">RESTORED</span>
                </div>
              </div>
              <div className="health-stats">
                <div className="health-stat-box">
                  <span className="stat-box-label">CLEANED SECTORS</span>
                  <span className="stat-box-val">{completedChaptersCount} / {totalChaptersCount}</span>
                </div>
                <div className="health-stat-box">
                  <span className="stat-box-label">STREAK DAYS</span>
                  <span className="stat-box-val">{state.streakDays} Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Level / Experience Panel */}
          <div className="comic-panel-card profile-panel">
            <div className="profile-header">
              <div className="obs-avatar">
                <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="profile-details">
                <h3>Guardian Rank {currentLevel}</h3>
                <div className="profile-streak">CHIEF SALVAGE OFFICER</div>
              </div>
            </div>
            
            <div className="profile-level-section">
              <div className="level-xp-details">
                <span>{currentXP} HERO XP</span>
                <span className="muted">/ {nextLevelXP} HERO XP</span>
              </div>
              <div className="profile-progress-bar">
                <div className="profile-progress-fill" style={{ width: `${Math.min(100, Math.max(0, levelProgress))}%` }} />
              </div>
            </div>
          </div>

          {/* Salvage Drone Panel */}
          <div className="comic-panel-card robot-panel">
            <h3 className="panel-title">Environmental Drone Salvage</h3>
            <p className="panel-desc">Reassemble the automated collector unit using salvaged parts from unlocked chapters.</p>
            <div className="robot-assembly-grid">
              <div className={`assembly-part-card ${isPartUnlocked('head') ? 'unlocked' : 'locked'}`}>
                <span className="part-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                </span>
                <div className="part-info">
                  <strong>Logic Core (Head)</strong>
                  <span>{isPartUnlocked('head') ? 'INTEGRATED' : 'OFFLINE - Complete Chapter 2'}</span>
                </div>
              </div>
              <div className={`assembly-part-card ${isPartUnlocked('torso') ? 'unlocked' : 'locked'}`}>
                <span className="part-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <path d="M12 2v9M8 5h8" />
                  </svg>
                </span>
                <div className="part-info">
                  <strong>Chassis Frame (Torso)</strong>
                  <span>{isPartUnlocked('torso') ? 'INTEGRATED' : 'OFFLINE - Complete Chapter 4'}</span>
                </div>
              </div>
              <div className={`assembly-part-card ${isPartUnlocked('mobility') ? 'unlocked' : 'locked'}`}>
                <span className="part-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </span>
                <div className="part-info">
                  <strong>Traction Wheels (Mobility)</strong>
                  <span>{isPartUnlocked('mobility') ? 'INTEGRATED' : 'OFFLINE - Complete Chapter 5'}</span>
                </div>
              </div>
              <div className={`assembly-part-card ${isPartUnlocked('arm_l') ? 'unlocked' : 'locked'}`}>
                <span className="part-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                    <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6M12 2v10M8 8l4 4 4-4" />
                  </svg>
                </span>
                <div className="part-info">
                  <strong>Robotic Gripper (Arm)</strong>
                  <span>{isPartUnlocked('arm_l') ? 'INTEGRATED' : 'OFFLINE - Complete Chapter 7'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Achievements */}
        <div className="dashboard-column">
          <div className="comic-panel-card trophies-panel">
            <h3 className="panel-title">Mission Achievements</h3>
            <div className="trophies-grid">
              {ALL_ACHIEVEMENTS.map((ach) => {
                const isUnlocked = state.achievements.includes(ach.id);
                return (
                  <div key={ach.id} className={`trophy-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                    <div className="trophy-icon-wrapper">
                      <span className="trophy-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                          <circle cx="12" cy="8" r="7" />
                          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                        </svg>
                      </span>
                      {!isUnlocked && (
                        <span className="trophy-lock">
                          <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <div className="trophy-info">
                      <h4>{ach.title}</h4>
                      <p>{ach.description}</p>
                      <span className="trophy-xp">+{ach.xp} HP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
