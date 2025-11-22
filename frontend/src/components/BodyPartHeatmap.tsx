import { useMemo } from 'react'
import type { WorkoutHistory } from '../types'
import { BODY_PART_COLORS } from '../types'

interface BodyPartHeatmapProps {
  history: WorkoutHistory[]
}

export default function BodyPartHeatmap({ history }: BodyPartHeatmapProps) {
  // Generate the last 365 days
  const dates = useMemo(() => {
    const today = new Date()
    const days: Date[] = []

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      days.push(date)
    }

    return days
  }, [])

  // Create a map of date -> workout history
  const historyMap = useMemo(() => {
    const map = new Map<string, WorkoutHistory>()
    history.forEach(h => {
      map.set(h.date, h)
    })
    return map
  }, [history])

  // Group dates by weeks
  const weeks = useMemo(() => {
    const result: Date[][] = []
    let currentWeek: Date[] = []

    dates.forEach((date, index) => {
      currentWeek.push(date)

      // Sunday is 0, so we push when we hit Saturday (6) or last day
      if (date.getDay() === 6 || index === dates.length - 1) {
        result.push([...currentWeek])
        currentWeek = []
      }
    })

    return result
  }, [dates])

  const getDateColor = (date: Date): string => {
    const dateStr = date.toISOString().split('T')[0]
    const workoutHistory = historyMap.get(dateStr)

    if (!workoutHistory || workoutHistory.bodyParts.length === 0) {
      return '#1f2937' // gray-800 - no workout
    }

    // Use the first body part's color if there's a workout
    // For multiple body parts, we could blend or create a gradient
    const primaryBodyPart = workoutHistory.bodyParts[0]
    return BODY_PART_COLORS[primaryBodyPart]
  }

  const getTooltip = (date: Date): string => {
    const dateStr = date.toISOString().split('T')[0]
    const workoutHistory = historyMap.get(dateStr)

    if (!workoutHistory || workoutHistory.bodyParts.length === 0) {
      return `${dateStr}: No workout`
    }

    const bodyPartsStr = workoutHistory.bodyParts.join(', ')
    return `${dateStr}: ${bodyPartsStr}`
  }

  const monthLabels = useMemo(() => {
    const labels: { month: string; offset: number }[] = []
    let currentMonth = -1

    dates.forEach((date, index) => {
      const month = date.getMonth()
      if (month !== currentMonth && date.getDate() <= 7) {
        currentMonth = month
        labels.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          offset: Math.floor(index / 7)
        })
      }
    })

    return labels
  }, [dates])

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Workout History</h2>

      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1">
          {/* Month labels */}
          <div className="flex gap-1 mb-1 ml-6">
            {monthLabels.map((label, idx) => (
              <div
                key={idx}
                className="text-xs text-gray-400"
                style={{ marginLeft: label.offset * 12 }}
              >
                {label.month}
              </div>
            ))}
          </div>

          {/* Day labels */}
          <div className="flex gap-1">
            <div className="flex flex-col gap-1 text-xs text-gray-400 justify-around pr-2">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Heatmap grid */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {/* Pad beginning if needed */}
                  {weekIndex === 0 && week[0].getDay() !== 0 && (
                    Array(week[0].getDay())
                      .fill(null)
                      .map((_, i) => (
                        <div
                          key={`pad-${i}`}
                          className="w-3 h-3 rounded-sm"
                        />
                      ))
                  )}

                  {week.map((date, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className="w-3 h-3 rounded-sm hover:ring-2 hover:ring-white transition-all cursor-pointer"
                      style={{ backgroundColor: getDateColor(date) }}
                      title={getTooltip(date)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-400 mb-2">Body Parts</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(BODY_PART_COLORS).map(([bodyPart, color]) => (
            <div key={bodyPart} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-300 capitalize">
                {bodyPart}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
