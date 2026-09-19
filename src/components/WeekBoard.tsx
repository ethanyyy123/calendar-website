import { AnimatePresence, motion } from 'framer-motion'
import type { Task } from '../types'
import { DayColumn } from './DayColumn'

interface Props {
  days: string[]
  direction: 1 | -1
  tasksByDay: Record<string, Task[]>
  onAdd: (input: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onLogTime: (id: string, minutes: number) => void
}

export function WeekBoard({
  days,
  direction,
  tasksByDay,
  onAdd,
  onToggle,
  onDelete,
  onLogTime,
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
              onAdd={onAdd}
              onToggle={onToggle}
              onDelete={onDelete}
              onLogTime={onLogTime}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
