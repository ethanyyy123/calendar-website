import type { Task } from '../types'
import { formatMinutes } from '../dateUtils'

interface Props {
  tasks: Task[]
}

export function TodaySummary({ tasks }: Props) {
  if (tasks.length === 0) return null

  const done = tasks.filter((t) => t.completed).length
  const remaining = tasks.length - done
  const plannedMinutes = tasks.reduce((sum, t) => sum + (t.estimatedMinutes ?? 0), 0)
  const loggedMinutes = tasks.reduce((sum, t) => sum + (t.loggedMinutes ?? 0), 0)

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-slate-800 bg-slate-900/60 px-4 py-2 text-xs text-slate-300">
      <span className="font-medium text-emerald-400">Today</span>
      <span>
        {tasks.length} task{tasks.length === 1 ? '' : 's'}
      </span>
      {plannedMinutes > 0 && <span>{formatMinutes(plannedMinutes)} planned</span>}
      {loggedMinutes > 0 && <span>{formatMinutes(loggedMinutes)} logged</span>}
      <span className="text-rose-400">{remaining} remaining</span>
      {done > 0 && <span className="text-emerald-500">{done} done</span>}
    </div>
  )
}
