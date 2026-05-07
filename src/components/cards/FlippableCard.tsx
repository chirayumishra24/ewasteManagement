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

  return (
    <div 
      className={`flip-card ${isFlipped ? 'flipped' : ''}`} 
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flip-card-inner">
        {/* Front Side */}
        <div className="flip-card-front bezel-outer" style={{ borderLeft: `4px solid ${accentColor || '#3b82f6'}` }}>
          <div className="bezel-inner">
            <div className="card-header-telemetry">
              <span className="card-type-tag">[ DATA_PACK: SUMMARY ]</span>
              {readingTime && <span className="reading-time">⏱ {readingTime} min read</span>}
            </div>
            
            {heroImage && (
              <div className="card-hero-container">
                <img src={heroImage} alt={title} className="card-hero-image" />
                <div className="hero-overlay" />
              </div>
            )}
            
            <div className="card-title-group">
              <span className="card-subtitle">{subtitle || 'MODULE_01_UNIT'}</span>
              <h3 className="card-title">{title}</h3>
            </div>
            
            <div className="flip-hint">
              <span className="hint-text">CLICK_TO_DECRYPT_FULL_DATA</span>
              <div className="hint-icon">→</div>
            </div>
            
            <div className="bezel-corner top-left" />
            <div className="bezel-corner top-right" />
            <div className="bezel-corner bottom-left" />
            <div className="bezel-corner bottom-right" />
          </div>
        </div>

        {/* Back Side */}
        <div className="flip-card-back bezel-outer">
          <div className="bezel-inner">
            <div className="card-header-telemetry">
              <span className="card-type-tag">[ DATA_PACK: FULL_CONTENT ]</span>
              <span className="flip-back-btn">← BACK</span>
            </div>
            
            <div className="card-content-scrollable">
              <h4 className="back-title">{title}</h4>
              <div className="content-divider" />
              {children}
            </div>

            <div className="bezel-corner top-left" />
            <div className="bezel-corner top-right" />
            <div className="bezel-corner bottom-left" />
            <div className="bezel-corner bottom-right" />
          </div>
        </div>
      </div>
    </div>
  )
}
