import type { LearningDirection, Progress } from '../types'
import { completedCount, isDayUnlocked } from '../lib/storage'

interface SevenDayRouteProps {
  direction: LearningDirection
  progress: Progress
  onSelect: (day: number) => void
}

export function SevenDayRoute({ direction, progress, onSelect }: SevenDayRouteProps) {
  const done = completedCount(progress)

  return (
    <aside className="route" aria-label="七日路线">
      <header className="route__head">
        <span className="kicker">七 日 路 线</span>
        <span className="route__count">
          <strong>{done}</strong> / 7 已成
        </span>
      </header>

      <ol className="route__list">
        {direction.days.map((task) => {
          const isDone = progress.completedDays.includes(task.day)
          const isToday = progress.currentDay === task.day
          const unlocked = isDayUnlocked(progress, task.day)
          const status = isDone ? '已完成' : isToday ? '今日' : unlocked ? '待启' : '未解锁'

          return (
            <li key={task.day} className="route__item">
              <button
                type="button"
                className={[
                  'route__node',
                  isDone ? 'is-done' : '',
                  isToday ? 'is-today' : '',
                  !unlocked ? 'is-locked' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                disabled={!unlocked}
                onClick={() => onSelect(task.day)}
              >
                <span className="route__badge" aria-hidden="true">
                  {isDone ? '成' : task.day}
                </span>
                <span className="route__main">
                  <span className="route__day">第{task.day}日 · {task.theme}</span>
                  <span className="route__status">{status}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <p className="route__note">完成今日，明日自开。</p>
    </aside>
  )
}
