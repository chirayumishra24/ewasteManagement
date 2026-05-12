
import { FlippableCard } from './FlippableCard'
import { ExpandableCard } from './ExpandableCard'
import { ImageCard } from './ImageCard'
import type { ChapterBlock, ChapterImage, ChapterTab } from '../../courseData'

const skillizeeAssetPrefix = 'https://login.skillizee.io'

interface CardRendererProps {
  tab: ChapterTab & {
    cardType?: 'image' | 'expand' | 'flip'
  }
}

export function CardRenderer({ tab }: CardRendererProps) {
  const { title, label, heroImage, cardType, accentColor, readingTime, blocks } = tab

  const renderBlocks = () => {
    return blocks.map((block: ChapterBlock, idx: number) => {
      switch (block.type) {
        case 'paragraph':
          return (
            <p key={idx} className={`mb-6 text-slate-300 leading-relaxed ${block.emphasis ? 'text-lg font-medium text-white border-l-4 border-teal-500 pl-4 py-2 bg-white/5 rounded-r-xl' : ''}`}>
              {block.content}
            </p>
          )
        case 'bulletList':
          if (block.items.length > 5) {
            return (
              <div key={idx} className="bento-grid">
                {block.items.map((item: string, i: number) => {
                  const [title, ...descParts] = item.split(': ')
                  const desc = descParts.join(': ')
                  return (
                    <div key={i} className="bento-item">
                      <div className="bento-icon">✦</div>
                      <div className="flex flex-col gap-1">
                        <div className="bento-title">{title}</div>
                        {desc && <div className="bento-desc">{desc}</div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }
          return (
            <ul key={idx} className="space-y-4 mb-8">
              {block.items.map((item: string, i: number) => (
                <li key={i} className="flex gap-3 items-start group">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0 group-hover:scale-150 transition-transform" />
                  <span className="text-slate-400 group-hover:text-white transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          )
        case 'numberedList':
          return (
            <ol key={idx} className="space-y-6 mb-8">
              {block.items.map((item: string, i: number) => (
                <li key={i} className="flex gap-4 items-start group">
                  <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-teal-400 shrink-0 group-hover:bg-teal-500 group-hover:text-white transition-all">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-slate-400 group-hover:text-white transition-colors leading-relaxed pt-1">{item}</span>
                </li>
              ))}
            </ol>
          )
        case 'quote':
          return (
            <blockquote key={idx} className="quote-block">
              <p className="text-xl italic font-medium text-slate-100 mb-2">{block.content}</p>
              {block.author && <footer className="text-sm uppercase tracking-widest text-teal-500/60 font-bold">— {block.author}</footer>}
            </blockquote>
          )
        case 'video': {
          const videoId = block.url.includes('youtu.be') 
            ? block.url.split('/').pop() 
            : block.url.split('v=').pop()?.split('&')[0]
          return (
            <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black mb-8 group">
              <iframe
                className="absolute inset-0 w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                title={block.title}
                src={`https://www.youtube.com/embed/${videoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              {block.note && (
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-lg border border-white/5 text-[10px] text-white/60 pointer-events-none">
                  {block.note}
                </div>
              )}
            </div>
          )
        }
        case 'imageGrid':
          return (
            <div key={idx} className={`grid gap-4 mb-8 ${block.columns === 'three' ? 'grid-cols-3' : block.columns === 'one' ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {block.images.map((img: ChapterImage, i: number) => (
                <figure key={i} className="group relative rounded-xl overflow-hidden border border-white/10">
                  <img 
                    className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-700"
                    src={img.src.startsWith('http') ? img.src : `${skillizeeAssetPrefix}${img.src}`} 
                    alt={img.alt} 
                  />
                  <figcaption className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {img.alt}
                  </figcaption>
                </figure>
              ))}
            </div>
          )
        default:
          return null
      }
    })
  }

  if (cardType === 'image') {
    return (
      <ImageCard 
        title={title} 
        subtitle={label} 
        heroImage={heroImage ?? ''} 
        accentColor={accentColor} 
        description={blocks.find((block) => block.type === 'paragraph')?.content}
      />
    )
  }

  if (cardType === 'expand') {
    return (
      <ExpandableCard 
        title={title} 
        subtitle={label} 
        heroImage={heroImage} 
        accentColor={accentColor}
      >
        <div className="p-8">
          {renderBlocks()}
        </div>
      </ExpandableCard>
    )
  }

  // Default to Flippable
  return (
    <FlippableCard 
      title={title} 
      subtitle={label} 
      heroImage={heroImage} 
      accentColor={accentColor}
      readingTime={readingTime}
    >
      <div className="p-8 h-full card-content-scrollable">
        {renderBlocks()}
      </div>
    </FlippableCard>
  )
}
