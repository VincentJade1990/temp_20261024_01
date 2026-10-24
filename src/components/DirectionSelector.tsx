import type { DirectionId } from '../types'
import { DIRECTIONS } from '../data/learningPaths'

interface DirectionSelectorProps {
  selectedId: DirectionId | null
  onSelect: (id: DirectionId) => void
  onBack: () => void
}

export function DirectionSelector({ selectedId, onSelect, onBack }: DirectionSelectorProps) {
  return (
    <div className="book-page book-page--flow">
      <header className="flow-head">
        <span className="kicker">第 二 步 · 择 一 门 功 课</span>
        <h2 className="flow-title">你想学什么</h2>
        <p className="flow-desc">三个方向，各备七日功课。选一个最想完成的，其余先放下。</p>
      </header>

      <div className="direction-list">
        {DIRECTIONS.map((direction) => (
          <button
            type="button"
            key={direction.id}
            className={`direction-card ${selectedId === direction.id ? 'is-selected' : ''}`}
            onClick={() => onSelect(direction.id)}
          >
            <span className="direction-seal" aria-hidden="true">
              {direction.seal}
            </span>
            <span className="direction-main">
              <span className="direction-name">{direction.name}</span>
              <span className="direction-tagline">{direction.tagline}</span>
              <span className="direction-wish">{direction.defaultWish}</span>
              <span className="direction-ornaments">
                {direction.ornaments.map((ornament) => (
                  <span key={ornament}>{ornament}</span>
                ))}
              </span>
            </span>
            <span className="direction-go" aria-hidden="true">
              选此
              <span className="direction-go__arrow">→</span>
            </span>
          </button>
        ))}
      </div>

      <button type="button" className="link-button flow-back" onClick={onBack}>
        ← 回到封面
      </button>
    </div>
  )
}
