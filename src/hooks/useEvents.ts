import { useCallback } from 'react'
import { v4 as uuid } from 'uuid'
import { useLocalStorage } from './useLocalStorage'
import type { Event } from '../types'

const STORAGE_KEY = 'todocal.events.v1'

export function useEvents() {
  const [events, setEvents] = useLocalStorage<Event[]>(STORAGE_KEY, [])

  const addEvent = useCallback(
    (input: Omit<Event, 'id' | 'createdAt'>) => {
      const event: Event = {
        ...input,
        id: uuid(),
        createdAt: new Date().toISOString(),
      }
      setEvents((prev) => [...prev, event])
      return event
    },
    [setEvents],
  )

  const deleteEvent = useCallback(
    (id: string) => {
      setEvents((prev) => prev.filter((e) => e.id !== id))
    },
    [setEvents],
  )

  return { events, addEvent, deleteEvent }
}
