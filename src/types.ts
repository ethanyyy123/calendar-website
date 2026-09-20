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
  estimatedMinutes?: number // how long the user expects this to take
  loggedMinutes?: number // how long they've actually logged against it so far
  createdAt: string
}

export interface Event {
  id: string
  title: string
  date: string // 'yyyy-MM-dd'
  startTime: string // 'HH:mm'
  endTime: string // 'HH:mm'
  createdAt: string
}
