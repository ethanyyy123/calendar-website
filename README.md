# TodoCal

A calendar-focused to-do app: a sliding week view of day columns where you add,
check off, and get reminded about tasks — without the clutter of a full calendar app.

## Features

- **Sliding week view** — see Monday–Sunday (or a 5-day work week), and page forward/backward
  one day or one week at a time with a smooth slide animation.
- **Fast task entry** — click "+ Add task" under any day, type a title, optionally set a
  time, priority, and reminder, and hit Enter.
- **Checkable to-dos** — tap the circle to mark a task done; it moves to a completed state
  with a strikethrough instead of disappearing.
- **Reminders** — enable browser notifications and get alerted a chosen number of minutes
  before a task is due. Overdue tasks are also highlighted in red.
- **Workload tracking** — give a task an estimated time and log actual minutes worked
  against it, so you can see estimate vs. reality.
- **Day timeline** — click "+ Add event" to block out fixed-time commitments (class,
  practice, a meeting) on an hour-by-hour timeline. Any task with both a time and an
  estimate shows up on the same timeline next to your events, so you can see your whole
  day planned out; a red line marks the current time.
- **Local-only storage** — everything is saved in your browser's `localStorage`. No account,
  no server, no data leaving your machine.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

## Build

```bash
npm run build
```

## Notes

- Data lives only in the browser you use — it won't sync across devices or browsers.
- Reminders require you to click "Enable reminders" once (browser notification permission)
  and to keep the tab open; browsers don't allow websites to send notifications when fully
  closed without a backend push service.
