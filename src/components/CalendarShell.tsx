import { useCallback, useRef, useState, type ReactNode } from 'react'

interface CalendarShellProps {
  children: ReactNode
  /** 是否启用鼠标视差 */
  parallax?: boolean
  /** 日历状态使用更紧凑的纸张内边距 */
  dense?: boolean
}

export function CalendarShell({ children, parallax = true, dense = false }: CalendarShellProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const frameRef = useRef<number | null>(null)

  const handleMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!parallax) return
      const rect = event.currentTarget.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width - 0.5
      const py = (event.clientY - rect.top) / rect.height - 0.5
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(() => {
        setTilt({ x: px * 5, y: py * -4 })
      })
    },
    [parallax],
  )

  const handleLeave = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    setTilt({ x: 0, y: 0 })
  }, [])

  return (
    <div className="wall" onMouseMove={handleMove} onMouseLeave={handleLeave}>
      <div className="wall__grain" aria-hidden="true" />
      <div
        className="calendar-stage"
        style={{
          transform: `rotateX(${tilt.y.toFixed(2)}deg) rotateY(${tilt.x.toFixed(2)}deg)`,
        }}
      >
        <div className="calendar-stack" aria-hidden="true">
          <span className="stack-sheet stack-sheet--3" />
          <span className="stack-sheet stack-sheet--2" />
          <span className="stack-sheet stack-sheet--1" />
        </div>

        <div className="calendar">
          <div className="calendar__hanger" aria-hidden="true">
            <span className="hanger__ring" />
          </div>
          <div className="calendar__board" aria-hidden="true">
            <span className="rivet rivet--left" />
            <span className="rivet rivet--right" />
          </div>
          <div className={`calendar__body ${dense ? 'calendar__body--dense' : ''}`}>
            <span className="paper-grain" aria-hidden="true" />
            <span className="paper-edge paper-edge--right" aria-hidden="true" />
            <span className="paper-edge paper-edge--bottom" aria-hidden="true" />
            {children}
          </div>
        </div>

        <div className="calendar-shadow" aria-hidden="true" />
      </div>
    </div>
  )
}
