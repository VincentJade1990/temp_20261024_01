import type { DayTask } from '../types'

export function LearningContent({ task }: { task: DayTask }) {
  return (
    <section className="lesson" aria-labelledby={`lesson-${task.day}`}>
      <div className="section-label">
        <span>今日一课</span>
        <span className="section-label__dot" aria-hidden="true">
          ❖
        </span>
      </div>

      <p className="lesson__intro">{task.intro}</p>
      <p id={`lesson-${task.day}`} className="lesson__knowledge">
        {task.knowledge}
      </p>

      {task.example && task.example.length > 0 && (
        <div className="lesson__example">
          {task.example.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}

      {task.mistake && (
        <div className="lesson__mistake">
          <span className="lesson__mistake-label">常见错误</span>
          <p>{task.mistake}</p>
        </div>
      )}
    </section>
  )
}
