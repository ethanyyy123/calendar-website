import { AnimatePresence, motion } from 'framer-motion'
import type { Event, Task } from '../types'
import { DayColumn } from './DayColumn'

interface Props {
  days: string[]
  direction: 1 | -1
  tasksByDay: Record<string, Task[]>
  eventsByDay: Record<string, Event[]>
  onAdd: (input: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onLogTime: (id: string, minutes: number) => void
  onAddEvent: (input: Omit<Event, 'id' | 'createdAt'>) => void
  onDeleteEvent: (id: string) => void
}

export function WeekBoard({
  days,
  direction,
  tasksByDay,
  eventsByDay,
  onAdd,
  onToggle,
  onDelete,
  onLogTime,
  onAddEvent,
  onDeleteEvent,
}: Props) {
  return (
    <div className="relative flex-1 overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={days.join(',')}
          custom={direction}
          initial={{ x: direction * 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction * -60, opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="absolute inset-0 flex"
        >
          {days.map((date) => (
            <DayColumn
              key={date}
              date={date}
              tasks={tasksByDay[date] ?? []}
              events={eventsByDay[date] ?? []}
              onAdd={onAdd}
              onToggle={onToggle}
              onDelete={onDelete}
              onLogTime={onLogTime}
              onAddEvent={onAddEvent}
              onDeleteEvent={onDeleteEvent}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
