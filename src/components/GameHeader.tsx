
import { Link } from 'react-router-dom';
import { chapters } from '../courseData';
import './GameHeader.css';

interface GameHeaderProps {
  xp: number;
  level: number;
  currentChapterId: string;
  streakDays: number;
  onOpenCodeEntry: () => void;
}

export default function GameHeader({ xp, level, currentChapterId, streakDays, onOpenCodeEntry }: GameHeaderProps) {
  // Map chapter icons for Kodeclubs styled nav
  const getChapterIcon = (id: string) => {
    switch (id) {
      case '1-0': return '🌐';
      case '2-0': return '⚠️';
      case '3-0': return '🔧';
      case '4-0': return '♻️';
      case '5-0': return '🛠️';
      case '6-0': return '💡';
      case '7-0': return '🗺️';
      case '8-0': return '🔒';
      default: return '📖';
    }
  };

  return (
    <header className="game-header">
      <div className="game-header-logo-container">
        <Link to="/" className="game-header-logo">
          SKILIZEE
          <span className="game-header-logo-sub">Academy</span>
        </Link>
      </div>

      <nav className="game-header-nav">
        <div className="game-header-chapters">
          {chapters.map((ch) => {
            const isActive = currentChapterId === ch.id;
            return (
              <Link
                key={ch.id}
                to={`/${ch.id}`}
                className={`chapter-dot ${isActive ? 'active' : ''}`}
                title={ch.title}
              >
                <span className="chapter-dot-icon">{getChapterIcon(ch.id)}</span>
                <span className="chapter-dot-tooltip">{ch.navLabel || ch.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="game-header-actions">
        <div className="game-header-badge streak-badge" title={`${streakDays} Day Streak!`}>
          <span className="badge-icon">🔥</span>
          <span className="badge-value">{streakDays}d</span>
        </div>

        <div className="game-header-badge xp-badge" title="Total Experience Points">
          <span className="badge-icon">⚡</span>
          <span className="badge-value">{xp} <span className="xp-unit">HERO XP</span></span>
        </div>

        <div className="game-header-badge level-badge" title="Your Academy Level">
          <span className="level-label">RANK</span>
          <span className="level-value">{level}</span>
        </div>

        <button
          onClick={onOpenCodeEntry}
          className="game-header-btn code-btn"
          title="Enter Secret Code"
          style={{ background: 'rgba(79, 70, 229, 0.05)', border: 'none', padding: '0.45rem', fontSize: '1rem', borderRadius: '50%' }}
        >
          🔑
        </button>

        <Link to="/dashboard" className="game-header-btn dashboard-btn" title="Open Trophies & Robot Builder">
          🏆
          <span className="dashboard-btn-text">Dashboard</span>
        </Link>
      </div>
    </header>
  );
}
