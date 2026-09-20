export interface TimelineInterval {
  id: string
  startMin: number
  endMin: number
}

export interface TimelineLayout {
  col: number
  cols: number
}

/**
 * Assigns each overlapping interval a column + total-column-count so a caller
 * can render side-by-side blocks (left: col/cols * 100%, width: 1/cols * 100%).
 * Non-overlapping intervals each get cols = 1 (full width).
 */
export function layoutIntervals(items: TimelineInterval[]): Map<string, TimelineLayout> {
  const layout = new Map<string, TimelineLayout>()
  const sorted = [...items].sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin)

  let cluster: typeof sorted = []
  let clusterEnd = -Infinity

  const flushCluster = () => {
    if (cluster.length === 0) return
    const colEndTimes: number[] = []
    const assignedCol = new Map<string, number>()
    for (const item of cluster) {
      let col = colEndTimes.findIndex((end) => end <= item.startMin)
      if (col === -1) {
        col = colEndTimes.length
        colEndTimes.push(item.endMin)
      } else {
        colEndTimes[col] = item.endMin
      }
      assignedCol.set(item.id, col)
    }
    const cols = colEndTimes.length
    for (const item of cluster) {
      layout.set(item.id, { col: assignedCol.get(item.id)!, cols })
    }
    cluster = []
  }

  for (const item of sorted) {
    if (cluster.length > 0 && item.startMin >= clusterEnd) {
      flushCluster()
      clusterEnd = -Infinity
    }
    cluster.push(item)
    clusterEnd = Math.max(clusterEnd, item.endMin)
  }
  flushCluster()

  return layout
}
