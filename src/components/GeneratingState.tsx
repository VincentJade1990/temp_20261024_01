import type { LearningDirection } from '../types'

interface GeneratingStateProps {
  direction: LearningDirection
  wish: string
}

export function GeneratingState({ direction, wish }: GeneratingStateProps) {
  return (
    <div className="book-page book-page--flow generating">
      <div className="generating__seal-wrap" aria-hidden="true">
        <span className="generating__seal">{direction.seal}</span>
      </div>
      <p className="generating__title">正在为你推算七日功课……</p>
      <p className="generating__wish">“{wish}”</p>
      <div className="generating__steps" aria-hidden="true">
        <span>定方向</span>
        <span>拆功课</span>
        <span>留印位</span>
      </div>
      <p className="generating__hint">一课一日，不多不少。</p>
    </div>
  )
}
