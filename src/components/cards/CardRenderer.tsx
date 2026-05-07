
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
            <p key={idx} className={`content-paragraph ${block.emphasis ? 'emphasis' : ''}`}>
              {block.content}
            </p>
          )
        case 'bulletList':
          return (
            <ul key={idx} className="content-list bullet">
              {block.items.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )
        case 'numberedList':
          return (
            <ol key={idx} className="content-list numbered">
              {block.items.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          )
        case 'quote':
          return (
            <blockquote key={idx} className="content-quote">
              <p>{block.content}</p>
              {block.author && <footer>- {block.author}</footer>}
            </blockquote>
          )
        case 'video': {
          const videoId = block.url.includes('youtu.be') 
            ? block.url.split('/').pop() 
            : block.url.split('v=').pop()?.split('&')[0]
          return (
            <div key={idx} className="content-video-container">
              <iframe
                title={block.title}
                src={`https://www.youtube.com/embed/${videoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              {block.note && <p className="video-note">{block.note}</p>}
            </div>
          )
        }
        case 'imageGrid':
          return (
            <div key={idx} className={`content-image-grid ${block.columns || 'two'}`}>
              {block.images.map((img: ChapterImage, i: number) => (
                <figure key={i}>
                  <img src={img.src.startsWith('http') ? img.src : `${skillizeeAssetPrefix}${img.src}`} alt={img.alt} />
                  <figcaption>{img.alt}</figcaption>
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
        {renderBlocks()}
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
      {renderBlocks()}
    </FlippableCard>
  )
}
