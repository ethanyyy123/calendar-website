import { addDays, format, isSameDay, parseISO, startOfWeek } from 'date-fns'

export const DATE_FMT = 'yyyy-MM-dd'

export function toDateKey(date: Date): string {
  return format(date, DATE_FMT)
}

export function fromDateKey(key: string): Date {
  return parseISO(key)
}

export function todayKey(): string {
  return toDateKey(new Date())
}

export function isToday(key: string): boolean {
  return isSameDay(fromDateKey(key), new Date())
}

export function isPast(key: string, time?: string): boolean {
  const d = fromDateKey(key)
  if (time) {
    const [h, m] = time.split(':').map(Number)
    d.setHours(h, m, 0, 0)
    return d.getTime() < Date.now()
  }
  return d.getTime() < new Date().setHours(0, 0, 0, 0)
}

export function defaultWeekStart(): Date {
  return startOfWeek(new Date(), { weekStartsOn: 1 })
}

export function shiftDate(key: string, days: number): string {
  return toDateKey(addDays(fromDateKey(key), days))
}

export function dayColumns(startKey: string, count: number): string[] {
  const start = fromDateKey(startKey)
  return Array.from({ length: count }, (_, i) => toDateKey(addDays(start, i)))
}

export function formatRangeLabel(startKey: string, count: number): string {
  const start = fromDateKey(startKey)
  const end = addDays(start, count - 1)
  const sameMonth = format(start, 'MMM') === format(end, 'MMM')
  const sameYear = format(start, 'yyyy') === format(end, 'yyyy')
  if (sameMonth) {
    return `${format(start, 'MMM d')} – ${format(end, 'd, yyyy')}`
  }
  if (sameYear) {
    return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`
  }
  return `${format(start, 'MMM d, yyyy')} – ${format(end, 'MMM d, yyyy')}`
}

export function formatDayHeader(key: string) {
  const d = fromDateKey(key)
  return {
    weekday: format(d, 'EEE'),
    dayNum: format(d, 'd'),
    month: format(d, 'MMM'),
  }
}

export function formatMinutes(totalMinutes: number): string {
  if (totalMinutes <= 0) return '0m'
  const h = Math.floor(totalMinutes / 60)
  const m = Math.round(totalMinutes % 60)
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function formatTime12h(time?: string): string {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}
