import { useState } from 'react'
import './Cards.css'

interface FlippableCardProps {
  title: string
  subtitle?: string
  heroImage?: string
  accentColor?: string
  readingTime?: number
  children: React.ReactNode
}

export function FlippableCard({ title, subtitle, heroImage, accentColor, readingTime, children }: FlippableCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsFlipped(!isFlipped)
    }
  }

  return (
    <div 
      className={`flip-card-container comic-panel-card ${isFlipped ? 'flipped' : ''}`} 
      onClick={() => setIsFlipped(!isFlipped)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      style={{ '--accent-color': accentColor || '#3b82f6' } as React.CSSProperties}
    >
      <div className="flip-card-inner">
        {/* Front Side */}
        <div className="flip-card-front">
          {heroImage && (
            <div className="flip-visual">
              <img src={heroImage} alt={title} />
            </div>
          )}
          
          <div className="flip-front-copy">
            <span className="flip-badge comic-badge-flat">{subtitle || 'BIOME MODULE'}</span>
            <h3 className="flip-label comic-title">{title}</h3>
          </div>
          
          <div className="flip-hint">
            <span className="flip-hint-arrow">→</span>
            <span>Tap to read mission details</span>
          </div>
        </div>

        {/* Back Side */}
        <div className="flip-card-back">
          <div className="flip-back-topline">
            {readingTime && (
              <span className="flip-back-badge comic-badge-flat">INTEL: {readingTime} MIN READ</span>
            )}
            <h4 className="comic-title">{title}</h4>
          </div>
          
          <div className="card-content-scrollable flex-1 overflow-y-auto mt-4 pr-1">
            {children}
          </div>

          <div className="flip-hint mt-auto pt-4 border-t border-slate-100">
            <span className="flip-hint-arrow">←</span>
            <span>Tap to flip back</span>
          </div>
        </div>
      </div>
    </div>
  )
}

