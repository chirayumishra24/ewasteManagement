import './ComicComponents.css'

export interface ComicPanelData {
  illustration: string // emoji or short graphic text
  caption: string
  speechBubble?: string
}

export interface ComicStripCardProps {
  title: string
  panels: ComicPanelData[]
}

export function ComicStripCard({ title, panels }: ComicStripCardProps) {
  return (
    <div className="comic-strip-container">
      <div className="comic-strip-header">{title}</div>
      <div className="comic-strip-scroller">
        {panels.map((panel, index) => (
          <div className="comic-strip-panel" key={index}>
            <div className="comic-panel-num">{index + 1}</div>
            <div className="comic-panel-visual">
              <div className="comic-panel-halftone"></div>
              <span>{panel.illustration}</span>
              {panel.speechBubble && (
                <div className="comic-panel-bubble">
                  {panel.speechBubble}
                </div>
              )}
            </div>
            <div className="comic-panel-caption">
              {panel.caption}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
