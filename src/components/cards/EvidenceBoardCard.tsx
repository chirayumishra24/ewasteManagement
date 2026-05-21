import { useState } from 'react'
import { useGameEngine } from '../../gameEngine'
import './ComicComponents.css'

export interface ClueItem {
  id: string
  title: string
  icon: string
  description: string
}

export interface EvidenceBoardCardProps {
  title: string
  clues: ClueItem[]
}

export function EvidenceBoardCard({ title, clues }: EvidenceBoardCardProps) {
  const { state, collectEvidence } = useGameEngine()
  const [selectedClue, setSelectedClue] = useState<ClueItem | null>(null)

  const handleClueClick = (clue: ClueItem) => {
    // If already collected, show details
    if (state.collectedEvidence.includes(clue.id)) {
      setSelectedClue(clue)
    } else {
      // Collect it and reward 40 HP
      collectEvidence(clue.id, 40)
      setSelectedClue(clue)
    }
  }

  const collectedCount = clues.filter(c => state.collectedEvidence.includes(c.id)).length

  return (
    <div className="evidence-board-card">
      <div className="evidence-header">{title} ({collectedCount}/{clues.length} Discovered)</div>
      
      <div className="evidence-grid">
        {clues.map((clue) => {
          const isCollected = state.collectedEvidence.includes(clue.id)
          return (
            <div 
              key={clue.id} 
              className={`evidence-pin ${isCollected ? 'collected' : 'locked'}`}
              onClick={() => handleClueClick(clue)}
            >
              <div className="evidence-icon">
                {isCollected ? clue.icon : '❓'}
              </div>
              <div className="evidence-title">
                {isCollected ? clue.title : 'Pin Locked'}
              </div>
            </div>
          )
        })}
      </div>

      {selectedClue && (
        <div className="evidence-overlay-details">
          <div className="evidence-detail-header">
            <h4 className="evidence-detail-title">
              {selectedClue.icon} {selectedClue.title}
            </h4>
            <button 
              className="evidence-detail-close"
              onClick={() => setSelectedClue(null)}
            >
              ✕ CLOSE
            </button>
          </div>
          <p className="evidence-detail-body">
            {selectedClue.description}
          </p>
        </div>
      )}
    </div>
  )
}
