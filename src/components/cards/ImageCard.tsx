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
    <div 
      className="comic-panel-card overflow-hidden p-0 relative min-h-[540px] flex flex-col justify-end" 
      style={{ 
        borderLeftColor: accentColor || '#fbbf24',
        '--accent-color': accentColor || '#fbbf24'
      } as React.CSSProperties}
    >
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10" />
      
      <div className="relative z-20 p-8 flex flex-col gap-2">
        <span className="comic-badge-flat self-start">{subtitle || 'BIOME VISUAL'}</span>
        <h3 className="comic-title text-white leading-tight mb-2" style={{ textShadow: '2px 2px 0 var(--ink-dark)' }}>{title}</h3>
        {description && (
          <p className="text-slate-100 text-xl leading-relaxed max-w-[600px] mt-2 font-bold" style={{ textShadow: '1px 1px 0 var(--ink-dark)' }}>
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

