interface StampAnimationProps {
  animate: boolean
  day: number
}

export function StampAnimation({ animate, day }: StampAnimationProps) {
  return (
    <div
      className={`stamp ${animate ? 'stamp--drop' : 'stamp--settled'}`}
      role="img"
      aria-label={`今日有成，第${day}日落印`}
    >
      <span className="stamp__inner">
        <span className="stamp__top">一 愿 一 历</span>
        <span className="stamp__main">今日有成</span>
        <span className="stamp__bottom">第 {day} 日 · 落印</span>
      </span>
    </div>
  )
}
