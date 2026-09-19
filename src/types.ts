export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  notes?: string
  date: string // 'yyyy-MM-dd'
  time?: string // 'HH:mm', optional (all-day if absent)
  completed: boolean
  priority: Priority
  reminderMinutesBefore?: number // e.g. 10, 30, 60; undefined = no reminder
  reminderFiredFor?: string // ISO timestamp key of last fired reminder, to avoid re-firing
  createdAt: string
}
