import { useState } from 'react'
import type { Event } from '../types'

interface Props {
  date: string
  defaultStartTime?: string
  onAdd: (input: Omit<Event, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

export function EventForm({ date, defaultStartTime, onAdd, onCancel }: Props) {
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState(defaultStartTime ?? '')
  const [endTime, setEndTime] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    if (!title.trim() || !startTime || !endTime) {
      setError('Give it a title, a start time, and an end time.')
      return
    }
    if (endTime <= startTime) {
      setError('End time needs to be after the start time.')
      return
    }
    onAdd({ title: title.trim(), date, startTime, endTime })
    setTitle('')
    setStartTime('')
    setEndTime('')
    setError('')
    onCancel()
  }

  return (
    <div className="rounded-lg border border-violet-700/60 bg-violet-950/30 p-2.5">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit()
          if (e.key === 'Escape') onCancel()
        }}
        placeholder="e.g. Clarinet class"
        className="w-full rounded-md border-none bg-transparent px-1 py-1 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
      />
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="rounded-md border border-slate-600 bg-slate-900 px-1.5 py-1 text-xs text-slate-200"
        />
        <span className="text-xs text-slate-500">to</span>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="rounded-md border border-slate-600 bg-slate-900 px-1.5 py-1 text-xs text-slate-200"
        />
      </div>
      {error && <p className="mt-1.5 text-[11px] text-rose-400">{error}</p>}
      <div className="mt-2 flex justify-end gap-1.5">
        <button
          onClick={onCancel}
          className="rounded-md px-2.5 py-1 text-xs text-slate-400 hover:bg-slate-700"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          className="rounded-md bg-violet-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-violet-500"
        >
          Add
        </button>
      </div>
    </div>
  )
}
