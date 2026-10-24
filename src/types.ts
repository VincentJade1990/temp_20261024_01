export type DirectionId = 'english' | 'coding' | 'video'

export type LevelId = 'zero' | 'some' | 'practice'

export type FeedbackVerdict = 'pass' | 'revise'

export interface DayTask {
  day: number
  theme: string
  intro: string
  knowledge: string
  example?: string[]
  mistake?: string
  actions: string[]
  deliverable: string
  yi: string[]
  ji: string[]
}

export interface LearningDirection {
  id: DirectionId
  name: string
  /** 单字印章，用于封面与方向选择 */
  seal: string
  tagline: string
  ornaments: string[]
  defaultWish: string
  finalOutcome: string
  finalOutcomeShort: string
  days: DayTask[]
}

export interface FeedbackResult {
  verdict: FeedbackVerdict
  title: string
  message: string
  suggestion?: string
}

export interface Progress {
  directionId: DirectionId
  wish: string
  level: LevelId
  minutes: number
  /** YYYY-MM-DD，第一日的日期 */
  startDate: string
  /** 当前打开的第几日 */
  currentDay: number
  completedDays: number[]
  submissions: Record<number, string>
  feedbacks: Record<number, FeedbackResult>
  updatedAt: string
}

export interface WishConfig {
  directionId: DirectionId
  wish: string
  level: LevelId
  minutes: number
  startDate: string
}
