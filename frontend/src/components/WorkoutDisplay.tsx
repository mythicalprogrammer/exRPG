import type { Workout } from '../types'
import { BODY_PART_COLORS } from '../types'

interface WorkoutDisplayProps {
  workout: Workout | null
  isLoading?: boolean
}

export default function WorkoutDisplay({ workout, isLoading }: WorkoutDisplayProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (!workout) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400">
        <p>No workout selected</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Today's Workout</h2>
        {workout.prompt && (
          <p className="text-gray-400 text-sm mb-4">
            Goal: {workout.prompt}
          </p>
        )}
        <p className="text-gray-500 text-xs">
          {new Date(workout.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      <div className="space-y-4">
        {workout.exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="bg-gray-700 rounded-lg p-4 border-l-4"
            style={{ borderLeftColor: BODY_PART_COLORS[exercise.bodyPart] }}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{exercise.name}</h3>
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor: BODY_PART_COLORS[exercise.bodyPart] + '20',
                  color: BODY_PART_COLORS[exercise.bodyPart]
                }}
              >
                {exercise.bodyPart}
              </span>
            </div>

            <div className="flex gap-4 text-sm text-gray-300">
              {exercise.sets && exercise.reps && (
                <span>
                  {exercise.sets} sets × {exercise.reps} reps
                </span>
              )}
              {exercise.weight && (
                <span>
                  {exercise.weight} lbs
                </span>
              )}
              {exercise.duration && (
                <span>
                  {exercise.duration} min
                </span>
              )}
            </div>

            {exercise.notes && (
              <p className="mt-2 text-sm text-gray-400">
                {exercise.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
