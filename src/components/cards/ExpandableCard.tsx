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
      setMaxHeight('180px')
    }
  }, [isExpanded, children])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div 
      className={`comic-panel-card cursor-pointer select-none transition-all duration-300 relative ${isExpanded ? 'expanded' : ''}`}
      onClick={() => setIsExpanded(!isExpanded)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      style={{ 
        borderLeftColor: accentColor || '#10b981',
        '--accent-color': accentColor || '#10b981'
      } as React.CSSProperties}
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="comic-badge-flat">{subtitle || 'BIOME ANALYSIS'}</span>
            <span className="comic-status-badge">
              {isExpanded ? 'EXPANDED' : 'COLLAPSED'}
            </span>
          </div>

          {heroImage && !isExpanded && (
            <div className="relative h-[150px] w-full border-2 border-ink-dark overflow-hidden mb-4">
              <img src={heroImage} alt={title} className="w-full h-full object-cover" />
            </div>
          )}

          <h3 className="comic-title mb-4">{title}</h3>

          <div 
            ref={contentRef}
            className="overflow-hidden transition-all duration-500 ease-out text-[#1a1a2e]" 
            style={{ 
              maxHeight: maxHeight,
              position: 'relative'
            }}
          >
            {children}
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 pt-4 mt-4 border-t border-slate-100 text-slate-500 font-bold text-sm">
          <span>{isExpanded ? 'Collapse analysis details' : 'Expand for full analysis'}</span>
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

