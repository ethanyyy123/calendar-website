import { useState } from 'react'
import type { Task } from '../types'
import { formatMinutes, formatTime12h, isPast } from '../dateUtils'

const PRIORITY_STYLE: Record<Task['priority'], { dot: string; text: string; label: string }> = {
  high: { dot: 'bg-rose-500', text: 'text-rose-400', label: 'High' },
  medium: { dot: 'bg-amber-500', text: 'text-amber-400', label: 'Med' },
  low: { dot: 'bg-sky-500', text: 'text-sky-400', label: 'Low' },
}

interface Props {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onLogTime: (id: string, minutes: number) => void
}

export function TaskItem({ task, onToggle, onDelete, onLogTime }: Props) {
  const [logging, setLogging] = useState(false)
  const [minutesInput, setMinutesInput] = useState('')
  const overdue = !task.completed && isPast(task.date, task.time)
  const priority = PRIORITY_STYLE[task.priority]

  const hasEstimate = typeof task.estimatedMinutes === 'number'
  const logged = task.loggedMinutes ?? 0
  const overBudget = hasEstimate && logged > (task.estimatedMinutes as number)

  const submitLog = () => {
    const val = Number(minutesInput)
    if (val > 0) onLogTime(task.id, val)
    setMinutesInput('')
    setLogging(false)
  }

  return (
    <div
      className={`group flex items-start gap-2 rounded-lg border px-2.5 py-2 transition-colors ${
        task.completed
          ? 'border-transparent bg-slate-800/40'
          : overdue
            ? 'border-rose-800/60 bg-rose-950/30'
            : 'border-slate-700/60 bg-slate-800/70 hover:border-slate-600'
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
          task.completed
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-500 text-transparent hover:border-emerald-400'
        }`}
        style={{ height: '18px', width: '18px' }}
      >
        ✓
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm leading-tight ${
            task.completed ? 'text-slate-500 line-through' : 'text-slate-100'
          }`}
          title={task.title}
        >
          {task.title}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
          {task.time && <span>{formatTime12h(task.time)}</span>}
          <span className={`flex items-center gap-1 ${priority.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
            {priority.label}
          </span>
          {hasEstimate && (
            <span
              title="Estimated vs. logged time"
              className={overBudget ? 'font-medium text-rose-400' : ''}
            >
              {logged > 0 ? `${formatMinutes(logged)} / ${formatMinutes(task.estimatedMinutes!)}` : formatMinutes(task.estimatedMinutes!)}
            </span>
          )}
          {task.reminderMinutesBefore && (
            <span title="Reminder set">🔔 {task.reminderMinutesBefore}m</span>
          )}
          {overdue && <span className="font-medium text-rose-400">overdue</span>}
        </div>

        {logging ? (
          <div className="mt-1.5 flex items-center gap-1">
            <input
              autoFocus
              type="number"
              min={1}
              value={minutesInput}
              onChange={(e) => setMinutesInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitLog()
                if (e.key === 'Escape') setLogging(false)
              }}
              placeholder="min worked"
              className="w-20 rounded-md border border-slate-600 bg-slate-900 px-1.5 py-0.5 text-[11px] text-slate-200"
            />
            <button
              onClick={submitLog}
              className="rounded-md bg-emerald-600 px-1.5 py-0.5 text-[11px] text-white hover:bg-emerald-500"
            >
              Add
            </button>
            <button
              onClick={() => setLogging(false)}
              className="rounded-md px-1.5 py-0.5 text-[11px] text-slate-400 hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        ) : (
          hasEstimate &&
          !task.completed && (
            <button
              onClick={() => setLogging(true)}
              className="mt-1 text-[11px] text-slate-500 opacity-0 transition-opacity hover:text-slate-300 group-hover:opacity-100"
            >
              + log time
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
        className="shrink-0 rounded p-1 text-slate-500 opacity-0 transition-opacity hover:bg-slate-700 hover:text-slate-200 group-hover:opacity-100"
      >
        ✕
      </button>
    </div>
  )
}
