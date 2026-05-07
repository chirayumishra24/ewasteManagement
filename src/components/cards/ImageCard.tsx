import './Cards.css'

interface ImageCardProps {
  title: string
  subtitle?: string
  heroImage: string
  accentColor?: string
  description?: string
}

export function ImageCard({ title, subtitle, heroImage, accentColor, description }: ImageCardProps) {
  return (
    <div className="image-card bezel-outer" style={{ borderLeft: `4px solid ${accentColor || '#fbbf24'}` }}>
      <div className="image-card-bg">
        <img src={heroImage} alt={title} className="card-hero-image" style={{ height: '100%', width: '100%' }} />
      </div>
      <div className="image-card-overlay" />
      
      <div className="image-card-content">
        <div className="card-header-telemetry" style={{ marginBottom: 'auto' }}>
          <span className="card-type-tag">[ DATA_PACK: VISUAL_REF ]</span>
        </div>
        
        <div className="card-title-group">
          <span className="card-subtitle" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{subtitle || 'MODULE_01_UNIT'}</span>
          <h3 className="card-title" style={{ fontSize: '2.2rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{title}</h3>
          {description && (
            <p className="card-description" style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              marginTop: '1rem',
              maxWidth: '600px',
              fontSize: '1rem'
            }}>
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="bezel-corner top-left" />
      <div className="bezel-corner top-right" />
      <div className="bezel-corner bottom-left" />
      <div className="bezel-corner bottom-right" />
    </div>
  )
}
