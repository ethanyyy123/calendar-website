import { useState } from 'react'
import type { Task } from '../types'
import { formatDayHeader, formatMinutes, isToday } from '../dateUtils'
import { TaskItem } from './TaskItem'
import { QuickAddForm } from './QuickAddForm'

interface Props {
  date: string
  tasks: Task[]
  onAdd: (input: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onLogTime: (id: string, minutes: number) => void
}

export function DayColumn({ date, tasks, onAdd, onToggle, onDelete, onLogTime }: Props) {
  const [adding, setAdding] = useState(false)
  const { weekday, dayNum, month } = formatDayHeader(date)
  const today = isToday(date)

  const sorted = [...tasks].sort((a, b) => {
    if (!a.time && !b.time) return 0
    if (!a.time) return 1
    if (!b.time) return -1
    return a.time.localeCompare(b.time)
  })

  const pending = sorted.filter((t) => !t.completed)
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

      <div className="flex-1 space-y-1.5 overflow-y-auto px-2 py-2">
        {sorted.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onLogTime={onLogTime}
          />
        ))}

        {adding ? (
          <QuickAddForm date={date} onAdd={onAdd} onCancel={() => setAdding(false)} />
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full rounded-lg border border-dashed border-slate-700 px-2 py-1.5 text-xs text-slate-500 hover:border-slate-500 hover:text-slate-300"
          >
            + Add task
          </button>
        )}
      </div>
    </div>
  )
}
