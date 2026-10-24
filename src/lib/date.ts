const MONTH_NAMES = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
]

const DAY_NAMES = [
  '初一',
  '初二',
  '初三',
  '初四',
  '初五',
  '初六',
  '初七',
  '初八',
  '初九',
  '初十',
  '十一',
  '十二',
  '十三',
  '十四',
  '十五',
  '十六',
  '十七',
  '十八',
  '十九',
  '二十',
  '廿一',
  '廿二',
  '廿三',
  '廿四',
  '廿五',
  '廿六',
  '廿七',
  '廿八',
  '廿九',
  '三十',
  '三十一',
]

const WEEK_NAMES = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

function pad(value: number): string {
  return value.toString().padStart(2, '0')
}

export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayISO(): string {
  return toISODate(new Date())
}

export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, (month || 1) - 1, day || 1)
}

export function dateOfDay(startISO: string, day: number): Date {
  const date = parseISODate(startISO)
  date.setDate(date.getDate() + day - 1)
  return date
}

export function formatMonthDay(date: Date): string {
  return `${MONTH_NAMES[date.getMonth()]}${DAY_NAMES[date.getDate() - 1]}`
}

export function formatWeekday(date: Date): string {
  return WEEK_NAMES[date.getDay()]
}

export function formatShortDate(iso: string): string {
  const date = parseISODate(iso)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}
