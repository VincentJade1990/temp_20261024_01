interface SubmissionAreaProps {
  value: string
  deliverable: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export function SubmissionArea({ value, deliverable, onChange, onSubmit }: SubmissionAreaProps) {
  const empty = value.trim().length === 0

  return (
    <section className="submission" aria-label="今日成果">
      <div className="section-label">
        <span>今日成果</span>
        <span className="submission__deliverable">应交 · {deliverable}</span>
      </div>

      <textarea
        className="submission__input"
        value={value}
        rows={3}
        placeholder="在这里留下今天的学习成果……"
        onChange={(event) => onChange(event.target.value)}
      />

      <div className="submission__actions">
        <span className="submission__hint">写下来，才算今天来过。</span>
        <button
          type="button"
          className="tag-button tag-button--primary"
          onClick={onSubmit}
          disabled={empty}
        >
          提交今日功课
        </button>
      </div>
    </section>
  )
}
