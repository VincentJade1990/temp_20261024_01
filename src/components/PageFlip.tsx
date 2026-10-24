import type { ReactNode } from 'react'

interface PageFlipProps {
  flipping: boolean
  under: ReactNode
  children: ReactNode
}

export function PageFlip({ flipping, under, children }: PageFlipProps) {
  return (
    <div className={`flip-stage ${flipping ? 'is-flipping' : ''}`}>
      {flipping && (
        <div className="flip-under" aria-hidden="true">
          {under}
        </div>
      )}
      <div className="flip-over">{children}</div>
    </div>
  )
}
