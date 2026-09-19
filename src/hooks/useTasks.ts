import { useCallback, useEffect, useRef } from 'react'
import { v4 as uuid } from 'uuid'
import { useLocalStorage } from './useLocalStorage'
import type { Task } from '../types'

const STORAGE_KEY = 'todocal.tasks.v1'

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEY, [])
  const firedRef = useRef<Set<string>>(new Set())

  const addTask = useCallback(
    (input: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
      const task: Task = {
        ...input,
        id: uuid(),
        completed: false,
        createdAt: new Date().toISOString(),
      }
      setTasks((prev) => [...prev, task])
      return task
    },
    [setTasks],
  )

  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
    },
    [setTasks],
  )

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id))
    },
    [setTasks],
  )

  const toggleComplete = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      )
    },
    [setTasks],
  )

  // Reminder polling: checks every 20s whether any task's reminder time has arrived.
  useEffect(() => {
    if (!('Notification' in window)) return

    const checkReminders = () => {
      const now = Date.now()
      tasks.forEach((task) => {
        if (task.completed || !task.time || !task.reminderMinutesBefore) return
        const fireKey = `${task.id}:${task.date}:${task.time}`
        if (firedRef.current.has(fireKey)) return

        const due = new Date(`${task.date}T${task.time}:00`)
        const fireAt = due.getTime() - task.reminderMinutesBefore * 60_000

        if (now >= fireAt && now < due.getTime() + 60_000) {
          firedRef.current.add(fireKey)
          if (Notification.permission === 'granted') {
            new Notification(`Upcoming: ${task.title}`, {
              body: `Due ${task.time} today${task.notes ? ` — ${task.notes}` : ''}`,
              tag: fireKey,
            })
          }
        }
      })
    }

    checkReminders()
    const interval = setInterval(checkReminders, 20_000)
    return () => clearInterval(interval)
  }, [tasks])

  return { tasks, addTask, updateTask, deleteTask, toggleComplete }
}
