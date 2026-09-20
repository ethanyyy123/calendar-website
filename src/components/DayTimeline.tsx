import type { Event, Task } from '../types'
import { formatTime12h, isToday, minutesSinceMidnight, nowMinutesSinceMidnight } from '../dateUtils'
import { layoutIntervals } from '../timelineLayout'

const START_HOUR = 6
const END_HOUR = 23
const HOUR_HEIGHT = 36
const TOTAL_MIN = (END_HOUR - START_HOUR) * 60
const TOTAL_HEIGHT = ((END_HOUR - START_HOUR) * HOUR_HEIGHT) + 1

const PRIORITY_BG: Record<Task['priority'], string> = {
  high: 'bg-rose-950/70 border-rose-700/70',
  medium: 'bg-amber-950/60 border-amber-700/60',
  low: 'bg-sky-950/60 border-sky-700/60',
}

function minutesToTop(min: number): number {
  const clamped = Math.min(Math.max(min, START_HOUR * 60), END_HOUR * 60)
  return ((clamped - START_HOUR * 60) / TOTAL_MIN) * (TOTAL_HEIGHT - 1)
}

interface Props {
  date: string
  events: Event[]
  scheduledTasks: Task[] // tasks with both a time and an estimatedMinutes
  onDeleteEvent: (id: string) => void
  onToggleTask: (id: string) => void
}

export function DayTimeline({ date, events, scheduledTasks, onDeleteEvent, onToggleTask }: Props) {
  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i)

  const intervals = [
    ...events.map((e) => ({
      id: `e:${e.id}`,
      startMin: minutesSinceMidnight(e.startTime),
      endMin: minutesSinceMidnight(e.endTime),
    })),
    ...scheduledTasks.map((t) => ({
      id: `t:${t.id}`,
      startMin: minutesSinceMidnight(t.time!),
      endMin: minutesSinceMidnight(t.time!) + Math.max(t.estimatedMinutes!, 15),
    })),
  ]
  const layout = layoutIntervals(intervals)

  const today = isToday(date)
  const nowMin = nowMinutesSinceMidnight()
  const showNowLine = today && nowMin >= START_HOUR * 60 && nowMin <= END_HOUR * 60

  return (
    <div className="relative flex px-1.5 pt-1" style={{ height: TOTAL_HEIGHT }}>
      <div className="relative w-9 shrink-0 select-none text-right">
        {hours.map((h) => (
          <div
            key={h}
            className="absolute right-1 -translate-y-1/2 text-[10px] text-slate-500"
            style={{ top: minutesToTop(h * 60) }}
          >
            {h % 12 === 0 ? 12 : h % 12}
            {h < 12 ? 'a' : 'p'}
          </div>
        ))}
      </div>

      <div className="relative flex-1 border-l border-slate-800">
        {hours.map((h) => (
          <div
            key={h}
            className="absolute left-0 right-0 border-t border-slate-800/70"
            style={{ top: minutesToTop(h * 60) }}
          />
        ))}

        {showNowLine && (
          <div
            className="absolute left-0 right-0 z-10 flex items-center"
            style={{ top: minutesToTop(nowMin) }}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            <div className="h-px flex-1 bg-rose-500" />
          </div>
        )}

        {events.map((e) => {
          const l = layout.get(`e:${e.id}`)!
          const start = minutesSinceMidnight(e.startTime)
          const end = minutesSinceMidnight(e.endTime)
          return (
            <div
              key={e.id}
              className="group absolute overflow-hidden rounded-md border border-violet-700/60 bg-violet-900/50 px-1.5 py-0.5"
              style={{
                top: minutesToTop(start),
                height: Math.max(minutesToTop(end) - minutesToTop(start), 16),
                left: `${(l.col / l.cols) * 100}%`,
                width: `${(1 / l.cols) * 100}%`,
              }}
              title={`${e.title} · ${formatTime12h(e.startTime)}–${formatTime12h(e.endTime)}`}
            >
              <p className="truncate text-[11px] font-medium leading-tight text-violet-100">
                {e.title}
              </p>
              <p className="truncate text-[10px] leading-tight text-violet-300">
                {formatTime12h(e.startTime)}
              </p>
              <button
                onClick={() => onDeleteEvent(e.id)}
                aria-label="Delete event"
                className="absolute right-0.5 top-0.5 rounded p-0.5 text-violet-300 opacity-0 hover:bg-violet-800 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          )
        })}

        {scheduledTasks.map((t) => {
          const l = layout.get(`t:${t.id}`)!
          const start = minutesSinceMidnight(t.time!)
          const end = start + Math.max(t.estimatedMinutes!, 15)
          return (
            <button
              key={t.id}
              onClick={() => onToggleTask(t.id)}
              className={`absolute overflow-hidden rounded-md border px-1.5 py-0.5 text-left transition-opacity ${
                PRIORITY_BG[t.priority]
              } ${t.completed ? 'opacity-40' : ''}`}
              style={{
                top: minutesToTop(start),
                height: Math.max(minutesToTop(end) - minutesToTop(start), 16),
                left: `${(l.col / l.cols) * 100}%`,
                width: `${(1 / l.cols) * 100}%`,
              }}
              title={`${t.title} · ${formatTime12h(t.time)}`}
            >
              <p
                className={`truncate text-[11px] font-medium leading-tight text-slate-100 ${
                  t.completed ? 'line-through' : ''
                }`}
              >
                {t.completed ? '✓ ' : ''}
                {t.title}
              </p>
              <p className="truncate text-[10px] leading-tight text-slate-400">
                {formatTime12h(t.time)}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
