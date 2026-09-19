import { useState } from 'react'
import type { Priority, Task } from '../types'

interface Props {
  date: string
  onAdd: (input: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void
  onCancel: () => void
}

const REMINDER_OPTIONS = [
  { label: 'No reminder', value: '' },
  { label: '10 min before', value: '10' },
  { label: '30 min before', value: '30' },
  { label: '1 hour before', value: '60' },
  { label: '1 day before', value: '1440' },
]

export function QuickAddForm({ date, onAdd, onCancel }: Props) {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [reminder, setReminder] = useState('')
  const [estimate, setEstimate] = useState('')

  const submit = () => {
    if (!title.trim()) return
    onAdd({
      title: title.trim(),
      date,
      time: time || undefined,
      priority,
      reminderMinutesBefore: reminder ? Number(reminder) : undefined,
      estimatedMinutes: estimate ? Number(estimate) : undefined,
    })
    setTitle('')
    setTime('')
    setReminder('')
    setEstimate('')
    onCancel()
  }

  return (
    <div className="rounded-lg border border-slate-600 bg-slate-800 p-2.5">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit()
          if (e.key === 'Escape') onCancel()
        }}
        placeholder="What needs to get done?"
        className="w-full rounded-md border-none bg-transparent px-1 py-1 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
      />
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="rounded-md border border-slate-600 bg-slate-900 px-1.5 py-1 text-xs text-slate-200"
        />
        <input
          type="number"
          min={0}
          step={5}
          value={estimate}
          onChange={(e) => setEstimate(e.target.value)}
          placeholder="Est. min"
          title="How many minutes you expect this to take"
          className="w-[76px] rounded-md border border-slate-600 bg-slate-900 px-1.5 py-1 text-xs text-slate-200 placeholder:text-slate-500"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="rounded-md border border-slate-600 bg-slate-900 px-1.5 py-1 text-xs text-slate-200"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
          disabled={!time}
          title={!time ? 'Set a time to enable reminders' : ''}
          className="rounded-md border border-slate-600 bg-slate-900 px-1.5 py-1 text-xs text-slate-200 disabled:opacity-40"
        >
          {REMINDER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-2 flex justify-end gap-1.5">
        <button
          onClick={onCancel}
          className="rounded-md px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-700"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-500"
        >
          Add
        </button>
      </div>
    </div>
  )
}
