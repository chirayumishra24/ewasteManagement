import React, { useState } from 'react'
import './ComicComponents.css'

export interface BattleMeterCardProps {
  title: string
  heroLabel: string
  villainLabel: string
  heroDesc: string
  villainDesc: string
  initialValue?: number // 0 to 100, where 100 is pure hero and 0 is pure villain
}

export function BattleMeterCard({
  title,
  heroLabel,
  villainLabel,
  heroDesc,
  villainDesc,
  initialValue = 50
}: BattleMeterCardProps) {
  const [value, setValue] = useState(initialValue)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value))
  }

  const isHeroVictory = value >= 80

  return (
    <div className="battle-meter-card">
      <h3 className="battle-header">{title}</h3>
      
      <div className="battle-labels">
        <span className="battle-label hero">{heroLabel} ({value}%)</span>
        <span className="battle-label villain">{villainLabel} ({100 - value}%)</span>
      </div>
      
      <div className="battle-bar-container">
        <div 
          className="battle-bar-fill hero" 
          style={{ width: `${value}%` }}
        ></div>
        <div 
          className="battle-bar-fill villain" 
          style={{ width: `${100 - value}%` }}
        ></div>
      </div>
      
      {isHeroVictory ? (
        <div className="wanted-banner" style={{ background: 'var(--hero-green)', width: '100%', textAlign: 'center', marginBottom: '1.25rem', transform: 'skewX(-4deg)' }}>
          Victory! Toxin Suppressed! 💥
        </div>
      ) : value <= 30 ? (
        <div className="wanted-banner" style={{ background: 'var(--villain-red)', width: '100%', textAlign: 'center', marginBottom: '1.25rem', transform: 'skewX(-4deg)' }}>
          Alert! Toxin Overload! ☠️
        </div>
      ) : null}

      <div className="battle-controls">
        <div className="battle-slider-group">
          <label className="battle-slider-label">Hero Balance Control</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={value} 
            onChange={handleSliderChange} 
            className="battle-slider"
          />
        </div>
        <div style={{ fontSize: '1.25rem', color: 'var(--ink-dark)', fontWeight: 700, display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <div style={{ flex: 1, opacity: value >= 50 ? 1 : 0.5 }}>
            <strong>Hero Impact:</strong> {heroDesc}
          </div>
          <div style={{ flex: 1, opacity: value < 50 ? 1 : 0.5 }}>
            <strong>Villain Impact:</strong> {villainDesc}
          </div>
        </div>
      </div>
    </div>
  )
}
