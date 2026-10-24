import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type {
  DirectionId,
  FeedbackResult,
  Progress,
  WishConfig,
} from './types'
import { DIRECTIONS, getDirection } from './data/learningPaths'
import {
  clearProgress,
  createProgress,
  isDayUnlocked,
  loadProgress,
  saveProgress,
} from './lib/storage'
import { CalendarShell } from './components/CalendarShell'
import { CalendarCover } from './components/CalendarCover'
import { DirectionSelector } from './components/DirectionSelector'
import { WishForm } from './components/WishForm'
import { GeneratingState } from './components/GeneratingState'
import { SevenDayRoute } from './components/SevenDayRoute'
import { SevenDayOverview } from './components/SevenDayOverview'
import { PageFlip } from './components/PageFlip'
import { CalendarPage } from './components/CalendarPage'
import { ProgressPanel } from './components/ProgressPanel'

type Stage = 'cover' | 'direction' | 'wish' | 'generating' | 'calendar'

const GENERATE_DURATION = 1500
const FLIP_DURATION = 840

const initialProgress = loadProgress()

export default function App() {
  const [saved, setSaved] = useState<Progress | null>(initialProgress)
  const [progress, setProgress] = useState<Progress | null>(initialProgress)
  const [stage, setStage] = useState<Stage>(initialProgress ? 'calendar' : 'cover')
  const [draftDirection, setDraftDirection] = useState<DirectionId | null>(null)
  const [pendingWish, setPendingWish] = useState('')

  const [day, setDay] = useState(initialProgress?.currentDay ?? 1)
  const [underDay, setUnderDay] = useState<number | null>(null)
  const [flipping, setFlipping] = useState(false)

  const [stampingDay, setStampingDay] = useState<number | null>(null)
  const [overview, setOverview] = useState(false)

  const timers = useRef<number[]>([])
  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }, [])
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  useEffect(() => {
    if (progress) saveProgress(progress)
  }, [progress])

  const direction = useMemo(
    () => getDirection(progress?.directionId ?? draftDirection ?? 'english') ?? DIRECTIONS[0],
    [progress, draftDirection],
  )

  const startWishFlow = useCallback(() => {
    setDraftDirection(null)
    setStage('direction')
  }, [])

  const handleGenerate = useCallback((config: WishConfig) => {
    setPendingWish(config.wish)
    setStage('generating')
    later(() => {
      const next = createProgress(config)
      setProgress(next)
      setDay(1)
      setOverview(false)
      setStage('calendar')
    }, GENERATE_DURATION)
  }, [later])

  const handleSubmit = useCallback(
    (text: string, feedback: FeedbackResult) => {
      setProgress((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          submissions: { ...prev.submissions, [day]: text },
          feedbacks: { ...prev.feedbacks, [day]: feedback },
          updatedAt: new Date().toISOString(),
        }
      })
    },
    [day],
  )

  const handleStamp = useCallback(
    (targetDay: number) => {
      setStampingDay(targetDay)
      setProgress((prev) => {
        if (!prev || prev.completedDays.includes(targetDay)) return prev
        return {
          ...prev,
          completedDays: [...prev.completedDays, targetDay].sort((a, b) => a - b),
          updatedAt: new Date().toISOString(),
        }
      })
      later(() => setStampingDay(null), 1100)
    },
    [later],
  )

  const openDay = useCallback(
    (next: number) => {
      if (!progress) return
      if (next === day || !isDayUnlocked(progress, next)) return
      clearTimers()
      setOverview(false)
      setStampingDay(null)
      setUnderDay(next)
      setFlipping(true)
      later(() => {
        setProgress((prev) => (prev ? { ...prev, currentDay: next } : prev))
        setDay(next)
        setFlipping(false)
        setUnderDay(null)
      }, FLIP_DURATION)
    },
    [progress, day, clearTimers, later],
  )

  const handleReset = useCallback(() => {
    clearTimers()
    clearProgress()
    setProgress(null)
    setSaved(null)
    setDraftDirection(null)
    setDay(1)
    setOverview(false)
    setStampingDay(null)
    setFlipping(false)
    setUnderDay(null)
    setStage('cover')
  }, [clearTimers])

  const renderSheet = (targetDay: number, isPreview: boolean) => (
    <CalendarPage
      direction={direction}
      progress={progress!}
      day={targetDay}
      preview={isPreview}
      stamping={stampingDay === targetDay}
      onSubmit={handleSubmit}
      onStamp={handleStamp}
      onNext={() => openDay(targetDay + 1)}
      onRestart={handleReset}
    />
  )

  return (
    <CalendarShell parallax={stage === 'cover' || stage === 'direction'} dense={stage === 'calendar'}>
      {stage === 'cover' && (
        <CalendarCover
          hasSavedProgress={Boolean(saved)}
          onStart={startWishFlow}
          onResume={() => {
            if (!saved) return
            setProgress(saved)
            setDay(saved.currentDay)
            setStage('calendar')
            setOverview(false)
          }}
        />
      )}

      {stage === 'direction' && (
        <DirectionSelector
          selectedId={draftDirection}
          onSelect={(id) => {
            setDraftDirection(id)
            setStage('wish')
          }}
          onBack={() => setStage('cover')}
        />
      )}

      {stage === 'wish' && draftDirection && (
        <WishForm
          direction={direction}
          onSubmit={handleGenerate}
          onChangeDirection={() => setStage('direction')}
          onBack={() => setStage('direction')}
        />
      )}

      {stage === 'generating' && (
        <GeneratingState direction={direction} wish={pendingWish || direction.defaultWish} />
      )}

      {stage === 'calendar' && progress && (
        <div className="calendar-layout">
          <SevenDayRoute direction={direction} progress={progress} onSelect={openDay} />

          <PageFlip
            flipping={flipping}
            under={underDay ? renderSheet(underDay, true) : null}
          >
            <div className="sheet-stack">
              <div className="sheet-under" aria-hidden="true" />
              {overview || !isDayUnlocked(progress, day) ? (
                <SevenDayOverview
                  direction={direction}
                  progress={progress}
                  onOpenDay={openDay}
                />
              ) : (
                renderSheet(day, false)
              )}
            </div>
          </PageFlip>

          <ProgressPanel
            direction={direction}
            progress={progress}
            overview={overview}
            onToggleOverview={() => setOverview((prev) => !prev)}
            onHome={() => setStage('cover')}
            onReset={handleReset}
          />
        </div>
      )}
    </CalendarShell>
  )
}
