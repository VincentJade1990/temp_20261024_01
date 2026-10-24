import { useState } from 'react'
import type { FeedbackResult, LearningDirection, Progress } from '../types'
import { dateOfDay, formatMonthDay, formatWeekday } from '../lib/date'
import { completedCount } from '../lib/storage'
import { evaluateSubmission } from '../lib/feedback'
import { LearningContent } from './LearningContent'
import { SubmissionArea } from './SubmissionArea'
import { FeedbackPanel } from './FeedbackPanel'
import { StampAnimation } from './StampAnimation'

interface CalendarPageProps {
  direction: LearningDirection
  progress: Progress
  day: number
  preview?: boolean
  stamping?: boolean
  onSubmit?: (text: string, feedback: FeedbackResult) => void
  onStamp?: (day: number) => void
  onNext?: () => void
  onRestart?: () => void
}

export function CalendarPage({
  direction,
  progress,
  day,
  preview = false,
  stamping = false,
  onSubmit,
  onStamp,
  onNext,
  onRestart,
}: CalendarPageProps) {
  const task = direction.days[day - 1]
  const date = dateOfDay(progress.startDate, day)
  const isCompleted = progress.completedDays.includes(day)
  const savedSubmission = progress.submissions[day] ?? ''
  const savedFeedback = progress.feedbacks[day]

  const [draft, setDraft] = useState(savedSubmission)
  const [editing, setEditing] = useState(false)

  const showFeedback = !preview && !isCompleted && Boolean(savedFeedback) && !editing
  const showSubmission = !preview && !isCompleted && !showFeedback

  const yesterdayText =
    day === 1
      ? '七日功课，从今天开始。'
      : progress.submissions[day - 1] || '昨日未留记录。今日补上，也不算迟。'

  const handleSubmit = () => {
    const text = draft.trim()
    if (!text || !onSubmit) return
    const feedback = evaluateSubmission(direction.id, day, text)
    onSubmit(text, feedback)
    setEditing(false)
  }

  return (
    <article
      key={day}
      className={[
        'sheet',
        'day-page',
        preview ? 'day-page--preview' : '',
        stamping ? 'day-page--stamping' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <header className="day-head">
        <div className="day-head__date">
          <span className="day-date">{formatMonthDay(date)}</span>
          <span className="day-week">{formatWeekday(date)}</span>
        </div>
        <div className="day-head__tail">
          <span className="day-head__meta">
            {direction.name}历 · 第{day}日 / 共7日
          </span>
          <h2 className="day-head__theme">{task.theme}</h2>
        </div>
      </header>

      <div className="day-yiji">
        <div className="day-yiji__row">
          <span className="day-yiji__seal day-yiji__seal--yi">宜</span>
          <p>{task.yi.join(' · ')}</p>
        </div>
        <div className="day-yiji__row">
          <span className="day-yiji__seal day-yiji__seal--ji">忌</span>
          <p>{task.ji.join(' · ')}</p>
        </div>
      </div>

      <section className="yesterday">
        <span className="yesterday__label">昨日所得</span>
        <p className="yesterday__text">{yesterdayText}</p>
      </section>

      <LearningContent task={task} />

      <section className="today-work">
        <div className="section-label">
          <span>今日功课</span>
          <span className="today-work__deliverable">成果 · {task.deliverable}</span>
        </div>
        <ol className="today-work__list">
          {task.actions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ol>
      </section>

      {preview && (
        <div className="preview-note">下页待启 · 完成今日即可翻开</div>
      )}

      {showSubmission && (
        <SubmissionArea
          value={draft}
          deliverable={task.deliverable}
          onChange={setDraft}
          onSubmit={handleSubmit}
        />
      )}

      {showFeedback && savedFeedback && (
        <FeedbackPanel
          feedback={savedFeedback}
          stamping={stamping}
          onRevise={() => setEditing(true)}
          onStamp={() => onStamp?.(day)}
        />
      )}

      {isCompleted && (
        <>
          {savedSubmission && (
            <section className="submission-done">
              <span className="submission-done__label">今日所交</span>
              <p>{savedSubmission}</p>
            </section>
          )}

          <section className="day-done">
            <p className="day-done__kicker">今 日 有 成</p>
            <p className="day-done__progress">
              已完成 {completedCount(progress)} / 7
            </p>
            <p className="day-done__next">
              {day < 7
                ? `明日功课：${direction.days[day].theme}`
                : '七日成愿，愿已落地。'}
            </p>
            {day < 7 ? (
              <button type="button" className="seal-button seal-button--sm" onClick={onNext}>
                翻开下一页
              </button>
            ) : (
              <div className="day-done__final">
                <span>{direction.finalOutcome}</span>
                <button type="button" className="seal-button seal-button--sm" onClick={onRestart}>
                  再许一愿
                </button>
              </div>
            )}
          </section>
        </>
      )}

      {!preview && (stamping || isCompleted) && (
        <StampAnimation animate={stamping} day={day} />
      )}

      <footer className="sheet-foot">
        <span>一愿一历 · 手作历册</span>
        <span>第 {day} / 7 页</span>
      </footer>
    </article>
  )
}
