import type { LearningDirection, Progress } from '../types'
import { isDayUnlocked } from '../lib/storage'
import { dateOfDay, formatMonthDay } from '../lib/date'

interface SevenDayOverviewProps {
  direction: LearningDirection
  progress: Progress
  onOpenDay: (day: number) => void
}

export function SevenDayOverview({ direction, progress, onOpenDay }: SevenDayOverviewProps) {
  return (
    <article className="sheet overview">
      <header className="overview__head">
        <span className="kicker">七 日 功 课 总 览</span>
        <h2 className="overview__title">{direction.name}历</h2>
        <p className="overview__wish">“{progress.wish}”</p>
      </header>

      <ol className="overview__list">
        {direction.days.map((task) => {
          const isDone = progress.completedDays.includes(task.day)
          const unlocked = isDayUnlocked(progress, task.day)
          const date = dateOfDay(progress.startDate, task.day)

          return (
            <li key={task.day} className="overview__item">
              <button
                type="button"
                className={`overview__row ${isDone ? 'is-done' : ''} ${
                  !unlocked ? 'is-locked' : ''
                }`}
                disabled={!unlocked}
                onClick={() => onOpenDay(task.day)}
              >
                <span className="overview__day">第{task.day}日</span>
                <span className="overview__body">
                  <span className="overview__theme">{task.theme}</span>
                  <span className="overview__deliverable">{task.deliverable}</span>
                </span>
                <span className="overview__side">
                  <span>{formatMonthDay(date)}</span>
                  <span className="overview__status">
                    {isDone ? '已成' : unlocked ? '可开' : '未解锁'}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <p className="overview__note">已完成 {progress.completedDays.length} / 7 · 最终成果：{direction.finalOutcomeShort}</p>

      <footer className="sheet-foot">
        <span>一愿一历 · 七日成愿</span>
        <span>总览</span>
      </footer>
    </article>
  )
}
