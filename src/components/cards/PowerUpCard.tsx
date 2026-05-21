import { useState } from 'react'
import { useGameEngine } from '../../gameEngine'
import './ComicComponents.css'

export interface PowerUpCardProps {
  title: string
  superpower: string
  hpReward: number
  icon: string
  description: string
}

export function PowerUpCard({
  title,
  superpower,
  hpReward,
  icon,
  description
}: PowerUpCardProps) {
  const { addXP } = useGameEngine()
  const [claimed, setClaimed] = useState(false)

  const handleClaim = () => {
    if (!claimed) {
      addXP(hpReward, `Power-Up: ${superpower}`)
      setClaimed(true)
    }
  }

  return (
    <div className="powerup-card">
      <div className="powerup-glow-border"></div>
      <div className="powerup-header">Power-Up Unlocked!</div>
      <div className="powerup-icon-ring">
        <span>{icon}</span>
      </div>
      <h3 className="powerup-name">{superpower}</h3>
      <div className="powerup-sub">{title}</div>
      <p className="powerup-desc">{description}</p>
      
      <button 
        className="powerup-claim-btn"
        onClick={handleClaim}
        disabled={claimed}
      >
        {claimed ? 'Power Active! ✓' : `Equip Power (+${hpReward} HP)`}
      </button>
    </div>
  )
}
