import { useState, useRef, useEffect } from 'react'
import './Cards.css'

interface ExpandableCardProps {
  title: string
  subtitle?: string
  heroImage?: string
  accentColor?: string
  children: React.ReactNode
}

export function ExpandableCard({ title, subtitle, heroImage, accentColor, children }: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [maxHeight, setMaxHeight] = useState('200px')

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`)
    } else {
      setMaxHeight('300px')
    }
  }, [isExpanded, children])

  return (
    <div 
      className={`expandable-card bezel-outer ${isExpanded ? 'expanded' : ''}`}
      onClick={() => setIsExpanded(!isExpanded)}
      style={{ borderLeft: `4px solid ${accentColor || '#10b981'}` }}
    >
      <div className="bezel-inner">
        <div className="card-header-telemetry">
          <span className="card-type-tag">[ DATA_PACK: EXPANDABLE ]</span>
          <span className="status-indicator">{isExpanded ? 'EXPANDED' : 'COLLAPSED'}</span>
        </div>

        {heroImage && !isExpanded && (
          <div className="card-hero-container" style={{ height: '150px' }}>
            <img src={heroImage} alt={title} className="card-hero-image" />
            <div className="hero-overlay" />
          </div>
        )}

        <div className="card-title-group">
          <span className="card-subtitle">{subtitle || 'MODULE_01_UNIT'}</span>
          <h3 className="card-title">{title}</h3>
        </div>

        <div 
          ref={contentRef}
          className="expandable-content" 
          style={{ 
            maxHeight: maxHeight,
            position: 'relative'
          }}
        >
          {children}
          {!isExpanded && (
            <div className="content-fade-overlay" style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '80px',
              background: 'linear-gradient(to top, rgba(10, 10, 18, 0.9), transparent)',
              pointerEvents: 'none'
            }} />
          )}
        </div>

        <div className="expand-btn">
          <span>{isExpanded ? 'COLLAPSE_VIEW' : 'EXPAND_FOR_DETAILS'}</span>
          <span className="expand-icon">↓</span>
        </div>

        <div className="bezel-corner top-left" />
        <div className="bezel-corner top-right" />
        <div className="bezel-corner bottom-left" />
        <div className="bezel-corner bottom-right" />
      </div>
    </div>
  )
}
