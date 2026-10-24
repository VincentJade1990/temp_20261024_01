import type { FeedbackResult } from '../types'

interface FeedbackPanelProps {
  feedback: FeedbackResult
  stamping: boolean
  onRevise: () => void
  onStamp: () => void
}

export function FeedbackPanel({ feedback, stamping, onRevise, onStamp }: FeedbackPanelProps) {
  const isPass = feedback.verdict === 'pass'

  return (
    <section
      className={`feedback feedback--${feedback.verdict}`}
      aria-live="polite"
      aria-label="今日批注"
    >
      <div className="feedback__head">
        <span className="feedback__stamp" aria-hidden="true">
          {isPass ? '可' : '改'}
        </span>
        <div>
          <span className="feedback__kicker">先生批注</span>
          <p className="feedback__message">{feedback.message}</p>
        </div>
      </div>

      {feedback.suggestion && (
        <p className="feedback__suggestion">{feedback.suggestion}</p>
      )}

      <div className="feedback__actions">
        <button type="button" className="tag-button" onClick={onRevise} disabled={stamping}>
          返回修改
        </button>
        <button
          type="button"
          className="seal-button seal-button--sm"
          onClick={onStamp}
          disabled={stamping}
        >
          {stamping ? '正在落印……' : '修改完成，请印'}
        </button>
      </div>
    </section>
  )
}
