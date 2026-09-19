interface Props {
  rangeLabel: string
  windowSize: 5 | 7
  notifStatus: NotificationPermission | 'unsupported'
  onPrevDay: () => void
  onNextDay: () => void
  onPrevWeek: () => void
  onNextWeek: () => void
  onToday: () => void
  onSetWindow: (size: 5 | 7) => void
  onRequestNotifications: () => void
}

export function Header({
  rangeLabel,
  windowSize,
  notifStatus,
  onPrevDay,
  onNextDay,
  onPrevWeek,
  onNextWeek,
  onToday,
  onSetWindow,
  onRequestNotifications,
}: Props) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex items-baseline gap-2">
          <h1 className="text-lg font-semibold text-slate-100">📋 TodoCal</h1>
          <span className="hidden text-[11px] text-slate-500 sm:inline">Plan less. Do more.</span>
        </div>
        <span className="text-sm text-slate-400">{rangeLabel}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg border border-slate-700 bg-slate-800 p-0.5">
          <button
            onClick={() => onSetWindow(5)}
            className={`rounded-md px-2 py-1 text-xs ${
              windowSize === 5 ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            5-day
          </button>
          <button
            onClick={() => onSetWindow(7)}
            className={`rounded-md px-2 py-1 text-xs ${
              windowSize === 7 ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            7-day
          </button>
        </div>

        <button
          onClick={onPrevWeek}
          title="Previous week"
          className="rounded-md border border-slate-700 px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
        >
          «
        </button>
        <button
          onClick={onPrevDay}
          title="Previous day"
          className="rounded-md border border-slate-700 px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
        >
          ‹
        </button>
        <button
          onClick={onToday}
          title="Jump to today"
          className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800"
        >
          Today
        </button>
        <button
          onClick={onNextDay}
          title="Next day"
          className="rounded-md border border-slate-700 px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
        >
          ›
        </button>
        <button
          onClick={onNextWeek}
          title="Next week"
          className="rounded-md border border-slate-700 px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
        >
          »
        </button>

        {notifStatus !== 'unsupported' && notifStatus !== 'granted' && (
          <button
            onClick={onRequestNotifications}
            className="rounded-md border border-amber-700 bg-amber-950/40 px-2.5 py-1.5 text-xs text-amber-300 hover:bg-amber-900/40"
          >
            🔔 Enable reminders
          </button>
        )}
      </div>
    </header>
  )
}
