import { useMemo, useState } from 'react'
import { useTasks } from './hooks/useTasks'
import { useEvents } from './hooks/useEvents'
import { Header } from './components/Header'
import { WeekBoard } from './components/WeekBoard'
import { TodaySummary } from './components/TodaySummary'
import {
  defaultWeekStart,
  dayColumns,
  formatRangeLabel,
  shiftDate,
  toDateKey,
  todayKey,
} from './dateUtils'
import type { Event, Task } from './types'

function getNotifStatus(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission
}

export default function App() {
  const { tasks, addTask, deleteTask, toggleComplete, logTime } = useTasks()
  const { events, addEvent, deleteEvent } = useEvents()
  const [windowSize, setWindowSize] = useState<5 | 7>(7)
  const [startKey, setStartKey] = useState(() => toDateKey(defaultWeekStart()))
  const [direction, setDirection] = useState<1 | -1>(1)
  const [notifStatus, setNotifStatus] = useState(getNotifStatus())

  const days = useMemo(() => dayColumns(startKey, windowSize), [startKey, windowSize])
  const rangeLabel = useMemo(() => formatRangeLabel(startKey, windowSize), [startKey, windowSize])

  const tasksByDay = useMemo(() => {
    const map: Record<string, Task[]> = {}
    for (const task of tasks) {
      if (!map[task.date]) map[task.date] = []
      map[task.date].push(task)
    }
    return map
  }, [tasks])

  const eventsByDay = useMemo(() => {
    const map: Record<string, Event[]> = {}
    for (const event of events) {
      if (!map[event.date]) map[event.date] = []
      map[event.date].push(event)
    }
    return map
  }, [events])

  const todaysTasks = useMemo(() => tasksByDay[todayKey()] ?? [], [tasksByDay])

  const nav = (deltaDays: number) => {
    setDirection(deltaDays > 0 ? 1 : -1)
    setStartKey((prev) => shiftDate(prev, deltaDays))
  }

  const goToday = () => {
    const today = toDateKey(defaultWeekStart())
    setDirection(today >= startKey ? 1 : -1)
    setStartKey(today)
  }

  const requestNotifications = async () => {
    if (!('Notification' in window)) return
    const perm = await Notification.requestPermission()
    setNotifStatus(perm)
  }

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-slate-100">
      <Header
        rangeLabel={rangeLabel}
        windowSize={windowSize}
        notifStatus={notifStatus}
        onPrevDay={() => nav(-1)}
        onNextDay={() => nav(1)}
        onPrevWeek={() => nav(-windowSize)}
        onNextWeek={() => nav(windowSize)}
        onToday={goToday}
        onSetWindow={setWindowSize}
        onRequestNotifications={requestNotifications}
      />
      <TodaySummary tasks={todaysTasks} />
      <WeekBoard
        days={days}
        direction={direction}
        tasksByDay={tasksByDay}
        eventsByDay={eventsByDay}
        onAdd={addTask}
        onToggle={toggleComplete}
        onDelete={deleteTask}
        onLogTime={logTime}
        onAddEvent={addEvent}
        onDeleteEvent={deleteEvent}
      />
    </div>
  )
}
