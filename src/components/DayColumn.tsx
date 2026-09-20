import { useState } from 'react'
import type { Event, Task } from '../types'
import { formatDayHeader, formatMinutes, isToday } from '../dateUtils'
import { TaskItem } from './TaskItem'
import { QuickAddForm } from './QuickAddForm'
import { EventForm } from './EventForm'
import { DayTimeline } from './DayTimeline'

interface Props {
  date: string
  tasks: Task[]
  events: Event[]
  onAdd: (input: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onLogTime: (id: string, minutes: number) => void
  onAddEvent: (input: Omit<Event, 'id' | 'createdAt'>) => void
  onDeleteEvent: (id: string) => void
}

export function DayColumn({
  date,
  tasks,
  events,
  onAdd,
  onToggle,
  onDelete,
  onLogTime,
  onAddEvent,
  onDeleteEvent,
}: Props) {
  const [adding, setAdding] = useState<'task' | 'event' | null>(null)
  const { weekday, dayNum, month } = formatDayHeader(date)
  const today = isToday(date)

  const scheduled = tasks.filter((t) => t.time && t.estimatedMinutes)
  const unscheduled = tasks
    .filter((t) => !(t.time && t.estimatedMinutes))
    .sort((a, b) => {
      if (!a.time && !b.time) return 0
      if (!a.time) return 1
      if (!b.time) return -1
      return a.time.localeCompare(b.time)
    })

  const pending = tasks.filter((t) => !t.completed)
  const remaining = pending.length
  const remainingMinutes = pending.reduce((sum, t) => sum + (t.estimatedMinutes ?? 0), 0)

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col border-r border-slate-800 last:border-r-0">
      <div
        className={`flex shrink-0 flex-col items-center gap-0.5 border-b border-slate-800 px-2 py-3 ${
          today ? 'bg-emerald-950/40' : ''
        }`}
      >
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {weekday}
        </span>
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
            today ? 'bg-emerald-500 text-white' : 'text-slate-200'
          }`}
        >
          {dayNum}
        </span>
        <span className="text-[10px] text-slate-500">{month}</span>
        {remaining > 0 && (
          <span className="mt-0.5 rounded-full bg-slate-700 px-1.5 py-0.5 text-[10px] text-slate-300">
            {remaining} left{remainingMinutes > 0 ? ` · ${formatMinutes(remainingMinutes)}` : ''}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <DayTimeline
          date={date}
          events={events}
          scheduledTasks={scheduled}
          onDeleteEvent={onDeleteEvent}
          onToggleTask={onToggle}
        />

        <div className="space-y-1.5 border-t border-slate-800 px-2 py-2">
          {unscheduled.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onLogTime={onLogTime}
            />
          ))}

          {adding === 'task' && (
            <QuickAddForm date={date} onAdd={onAdd} onCancel={() => setAdding(null)} />
          )}
          {adding === 'event' && (
            <EventForm date={date} onAdd={onAddEvent} onCancel={() => setAdding(null)} />
          )}

          {adding === null && (
            <div className="flex gap-1.5">
              <button
                onClick={() => setAdding('task')}
                className="flex-1 rounded-lg border border-dashed border-slate-700 px-2 py-1.5 text-xs text-slate-500 hover:border-slate-500 hover:text-slate-300"
              >
                + Add task
              </button>
              <button
                onClick={() => setAdding('event')}
                className="flex-1 rounded-lg border border-dashed border-violet-800 px-2 py-1.5 text-xs text-violet-400 hover:border-violet-600 hover:text-violet-300"
              >
                + Add event
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
