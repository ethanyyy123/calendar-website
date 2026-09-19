import type { Task } from '../types'
import { formatTime12h, isPast } from '../dateUtils'

const PRIORITY_DOT: Record<Task['priority'], string> = {
  high: 'bg-rose-500',
  medium: 'bg-amber-500',
  low: 'bg-sky-500',
}

interface Props {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskItem({ task, onToggle, onDelete }: Props) {
  const overdue = !task.completed && isPast(task.date, task.time)

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
        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[task.priority]}`} />
          {task.time && <span>{formatTime12h(task.time)}</span>}
          {task.reminderMinutesBefore && (
            <span title="Reminder set">🔔 {task.reminderMinutesBefore}m</span>
          )}
          {overdue && <span className="font-medium text-rose-400">overdue</span>}
        </div>
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
