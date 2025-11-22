import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getWorkouts, getWorkoutHistory } from '../services/db'
import WorkoutDisplay from '../components/WorkoutDisplay'
import BodyPartHeatmap from '../components/BodyPartHeatmap'
import type { Workout, WorkoutHistory } from '../types'

export default function WorkoutPage() {
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [history, setHistory] = useState<WorkoutHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)

      try {
        // Load workout history for heatmap
        const historyData = await getWorkoutHistory()
        setHistory(historyData)

        // Load specific workout if passed via state
        const workoutId = location.state?.workoutId
        if (workoutId) {
          const workouts = await getWorkouts()
          const foundWorkout = workouts.find(w => w.id === workoutId)
          if (foundWorkout) {
            setWorkout(foundWorkout)
          }
        } else {
          // Load most recent workout
          const workouts = await getWorkouts()
          if (workouts.length > 0) {
            setWorkout(workouts[0])
          }
        }
      } catch (error) {
        console.error('Error loading workout data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [location])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Workout Tracker</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            New Workout
          </button>
        </div>

        {/* Workout Display */}
        <WorkoutDisplay workout={workout} isLoading={isLoading} />

        {/* Heatmap */}
        <BodyPartHeatmap history={history} />
      </div>
    </div>
  )
}
