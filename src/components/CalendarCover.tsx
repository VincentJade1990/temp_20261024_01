import { CloudCorner, OrnamentRule } from './Ornaments'

interface CalendarCoverProps {
  onStart: () => void
  hasSavedProgress: boolean
  onResume: () => void
}

export function CalendarCover({ onStart, hasSavedProgress, onResume }: CalendarCoverProps) {
  return (
    <div className="cover">
      <div className="cover__frame">
        <CloudCorner className="cover__cloud cover__cloud--tl" />
        <CloudCorner className="cover__cloud cover__cloud--tr" />

        <div className="cover__eyebrow">手 作 学 习 历</div>

        <div className="cover__seal-stack" aria-hidden="true">
          <span className="cover__big-seal">愿</span>
        </div>

        <h1 className="cover__title">一愿一历</h1>
        <div className="cover__subtitle">一页一课，七日成愿</div>

        <OrnamentRule label="学 而 有 程" />

        <p className="cover__desc">
          把一个想学会的愿望，变成七天做得到的行动。
        </p>

        <div className="cover__art" data-slot="cover-art" aria-hidden="true">
          <span className="cover__knot" />
          <span className="cover__knot cover__knot--sm" />
        </div>

        <button type="button" className="seal-button seal-button--lg" onClick={onStart}>
          <span className="seal-button__text">开始许愿</span>
        </button>

        {hasSavedProgress && (
          <button type="button" className="link-button" onClick={onResume}>
            继续上一次的功课
          </button>
        )}

        <div className="cover__foot">丙午年 · 手作历册</div>
      </div>
    </div>
  )
}
