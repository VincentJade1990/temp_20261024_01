import { useState } from 'react'
import type { LearningDirection, Progress } from '../types'
import { completedCount } from '../lib/storage'
import { formatShortDate } from '../lib/date'
import { getLevelLabel } from '../data/learningPaths'

interface ProgressPanelProps {
  direction: LearningDirection
  progress: Progress
  overview: boolean
  onToggleOverview: () => void
  onHome: () => void
  onReset: () => void
}

export function ProgressPanel({
  direction,
  progress,
  overview,
  onToggleOverview,
  onHome,
  onReset,
}: ProgressPanelProps) {
  const [confirmReset, setConfirmReset] = useState(false)
  const done = completedCount(progress)

  return (
    <aside className="wish-panel" aria-label="愿望信息">
      <span className="kicker">我 的 学 习 愿 望</span>
      <p className="wish-panel__wish">“{progress.wish}”</p>

      <div className="wish-panel__progress">
        <div className="wish-panel__progress-head">
          <span>当前进度</span>
          <span className="wish-panel__score">
            <strong>{done}</strong>/7
          </span>
        </div>
        <div className="progress-track" aria-hidden="true">
          <span style={{ width: `${(done / 7) * 100}%` }} />
        </div>
      </div>

      <dl className="wish-panel__meta">
        <div>
          <dt>最终成果</dt>
          <dd>{direction.finalOutcome}</dd>
        </div>
        <div>
          <dt>每日投入</dt>
          <dd>{progress.minutes} 分钟</dd>
        </div>
        <div>
          <dt>开历之日</dt>
          <dd>{formatShortDate(progress.startDate)}</dd>
        </div>
        <div>
          <dt>当前基础</dt>
          <dd>{getLevelLabel(progress.level)}</dd>
        </div>
      </dl>

      <button type="button" className="tag-button" onClick={onToggleOverview}>
        {overview ? '回到今日功课' : '返回七日总览'}
      </button>

      <button type="button" className="link-button" onClick={onHome}>
        回到封面
      </button>

      <button
        type="button"
        className={`link-button link-button--danger ${confirmReset ? 'is-confirming' : ''}`}
        onClick={() => {
          if (!confirmReset) {
            setConfirmReset(true)
            return
          }
          onReset()
        }}
        onBlur={() => setConfirmReset(false)}
      >
        {confirmReset ? '确认清空，重新开历' : '重新开历'}
      </button>
    </aside>
  )
}
