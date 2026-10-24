import type { DirectionId, FeedbackResult, LevelId, Progress, WishConfig } from '../types'
import { DIRECTIONS, getDirection } from '../data/learningPaths'

const STORAGE_KEY = 'yiyuan-yili:progress:v1'

const DIRECTION_IDS: DirectionId[] = ['english', 'coding', 'video']
const LEVEL_IDS: LevelId[] = ['zero', 'some', 'practice']

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function sanitizeProgress(value: unknown): Progress | null {
  if (!isPlainObject(value)) return null
  const { directionId, wish, level, minutes, startDate, currentDay, completedDays } = value

  if (!DIRECTION_IDS.includes(directionId as DirectionId)) return null
  if (typeof wish !== 'string' || typeof startDate !== 'string') return null
  if (!LEVEL_IDS.includes(level as LevelId)) return null
  if (typeof minutes !== 'number' || typeof currentDay !== 'number') return null

  const completed = Array.isArray(completedDays)
    ? completedDays.filter(
        (day): day is number => typeof day === 'number' && day >= 1 && day <= 7,
      )
    : []

  const submissions: Record<number, string> = {}
  if (isPlainObject(value.submissions)) {
    Object.entries(value.submissions).forEach(([key, submission]) => {
      if (typeof submission === 'string') submissions[Number(key)] = submission
    })
  }

  const feedbacks: Record<number, FeedbackResult> = {}
  if (isPlainObject(value.feedbacks)) {
    Object.entries(value.feedbacks).forEach(([key, feedback]) => {
      if (isPlainObject(feedback) && typeof feedback.message === 'string') {
        feedbacks[Number(key)] = feedback as unknown as FeedbackResult
      }
    })
  }

  return {
    directionId: directionId as DirectionId,
    wish,
    level: level as LevelId,
    minutes,
    startDate,
    currentDay: Math.min(7, Math.max(1, Math.round(currentDay))),
    completedDays: Array.from(new Set(completed)),
    submissions,
    feedbacks,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : new Date().toISOString(),
  }
}

export function loadProgress(): Progress | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = sanitizeProgress(JSON.parse(raw))
    if (parsed && !getDirection(parsed.directionId)) return null
    return parsed
  } catch {
    return null
  }
}

export function saveProgress(progress: Progress): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // 存储不可用时静默降级，不影响主流程
  }
}

export function clearProgress(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // 忽略
  }
}

export function createProgress(config: WishConfig): Progress {
  const direction = getDirection(config.directionId) ?? DIRECTIONS[0]
  return {
    directionId: direction.id,
    wish: config.wish.trim() || direction.defaultWish,
    level: config.level,
    minutes: config.minutes,
    startDate: config.startDate,
    currentDay: 1,
    completedDays: [],
    submissions: {},
    feedbacks: {},
    updatedAt: new Date().toISOString(),
  }
}

export function isDayUnlocked(progress: Progress, day: number): boolean {
  if (day < 1 || day > 7) return false
  if (day === 1) return true
  return progress.completedDays.includes(day - 1)
}

export function completedCount(progress: Progress): number {
  return progress.completedDays.length
}
