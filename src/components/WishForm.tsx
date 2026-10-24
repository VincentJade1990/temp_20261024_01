import { useState } from 'react'
import type { LevelId, LearningDirection, WishConfig } from '../types'
import { LEVELS, MINUTE_OPTIONS } from '../data/learningPaths'
import { todayISO } from '../lib/date'

interface WishFormProps {
  direction: LearningDirection
  onSubmit: (config: WishConfig) => void
  onChangeDirection: () => void
  onBack: () => void
}

export function WishForm({ direction, onSubmit, onChangeDirection, onBack }: WishFormProps) {
  const [wish, setWish] = useState(direction.defaultWish)
  const [level, setLevel] = useState<LevelId>('some')
  const [minutes, setMinutes] = useState(30)
  const [startDate, setStartDate] = useState(todayISO())

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit({
      directionId: direction.id,
      wish: wish.trim() || direction.defaultWish,
      level,
      minutes,
      startDate: startDate || todayISO(),
    })
  }

  return (
    <form className="book-page book-page--flow wish-form" onSubmit={handleSubmit}>
      <header className="flow-head flow-head--compact">
        <span className="kicker">第 三 步 · 许 一 个 七 日 之 愿</span>
        <h2 className="flow-title">
          今日开历，七日后验收
        </h2>
        <p className="flow-desc">愿望写得越具体，日历越知道该怎么带你走。</p>
      </header>

      <div className="field">
        <div className="field__label">
          <span>学习方向</span>
          <button type="button" className="link-button link-button--inline" onClick={onChangeDirection}>
            更换
          </button>
        </div>
        <div className="direction-picked">
          <span className="direction-seal direction-seal--sm" aria-hidden="true">
            {direction.seal}
          </span>
          <div>
            <strong>{direction.name}</strong>
            <span>{direction.ornaments.join(' · ')}</span>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="wish-text">
          学习愿望
        </label>
        <textarea
          id="wish-text"
          className="paper-input paper-input--area"
          value={wish}
          rows={2}
          onChange={(event) => setWish(event.target.value)}
          placeholder="7天，你想完成一件什么事？"
        />
      </div>

      <fieldset className="field">
        <legend className="field__label">当前基础</legend>
        <div className="chip-row">
          {LEVELS.map((option) => (
            <button
              type="button"
              key={option.id}
              className={`chip ${level === option.id ? 'is-active' : ''}`}
              onClick={() => setLevel(option.id)}
              title={option.hint}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend className="field__label">每日投入</legend>
        <div className="chip-row">
          {MINUTE_OPTIONS.map((option) => (
            <button
              type="button"
              key={option}
              className={`chip ${minutes === option ? 'is-active' : ''}`}
              onClick={() => setMinutes(option)}
            >
              {option} 分钟
            </button>
          ))}
        </div>
      </fieldset>

      <div className="field field--inline">
        <label className="field__label" htmlFor="start-date">
          开始日期
        </label>
        <input
          id="start-date"
          type="date"
          className="paper-input paper-input--date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
        />
      </div>

      <div className="expect-note">
        <span className="expect-note__label">七日后所得</span>
        <span className="expect-note__text">{direction.finalOutcome}</span>
      </div>

      <div className="flow-actions">
        <button type="submit" className="seal-button seal-button--lg">
          为我开历
        </button>
        <button type="button" className="link-button" onClick={onBack}>
          ← 另择方向
        </button>
      </div>
    </form>
  )
}
