import './ComicComponents.css'

export interface VillainProfileCardProps {
  name: string
  chemical: string
  dangerLevel: string
  hideouts: string
  weakness: string
  bounty: number
  emoji: string
  description: string
}

export function VillainProfileCard({
  name,
  chemical,
  dangerLevel,
  hideouts,
  weakness,
  bounty,
  emoji,
  description
}: VillainProfileCardProps) {
  return (
    <div className="villain-profile-card">
      <div className="wanted-banner">Wanted</div>
      <div className="villain-avatar-frame">
        <span>{emoji}</span>
      </div>
      <h3 className="villain-name">{name}</h3>
      <div className="villain-chemical">{chemical}</div>
      
      <p className="villain-description">{description}</p>
      
      <div className="villain-stats-grid">
        <div className="villain-stat-row">
          <span className="villain-stat-label">Danger Level</span>
          <span className="villain-stat-value">{dangerLevel}</span>
        </div>
        <div className="villain-stat-row">
          <span className="villain-stat-label">Known Hideouts</span>
          <span className="villain-stat-value">{hideouts}</span>
        </div>
        <div className="villain-stat-row">
          <span className="villain-stat-label">Weakness</span>
          <span className="villain-stat-value">{weakness}</span>
        </div>
      </div>
      
      <div className="villain-bounty-badge">
        Bounty: +{bounty} HP
      </div>
    </div>
  )
}
