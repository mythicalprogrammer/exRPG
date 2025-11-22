import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateWorkoutPlan } from '../services/api'
import { saveWorkout, saveWorkoutHistory } from '../services/db'
import type { Workout, BodyPart } from '../types'

export default function PromptPage() {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim()) {
      setError('Please enter a workout description')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Call the API to generate workout plan
      const workoutPlan = await generateWorkoutPlan(prompt)

      // Create workout object
      const today = new Date().toISOString()
      const dateOnly = today.split('T')[0]

      const workout: Workout = {
        id: crypto.randomUUID(),
        date: today,
        prompt: prompt,
        exercises: workoutPlan.exercises,
        completed: false,
        createdAt: today,
        updatedAt: today
      }

      // Save to IndexedDB
      await saveWorkout(workout)

      // Extract unique body parts from exercises
      const bodyParts = [...new Set(workoutPlan.exercises.map(ex => ex.bodyPart))] as BodyPart[]

      // Save workout history for the heatmap
      await saveWorkoutHistory({
        id: crypto.randomUUID(),
        date: dateOnly,
        bodyParts,
        workoutIds: [workout.id]
      })

      // Navigate to workout page
      navigate('/workout', { state: { workoutId: workout.id } })
    } catch (err) {
      console.error('Error generating workout:', err)
      setError('Failed to generate workout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Workout Planner</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-2">
              Describe your workout goals
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., I want to build upper body strength, focusing on chest and arms..."
              className="w-full h-40 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            {isLoading ? 'Generating Workout...' : 'Generate Workout Plan'}
          </button>
        </form>

        <button
          onClick={() => navigate('/workout')}
          className="mt-4 w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
        >
          View Previous Workouts
        </button>
      </div>
    </div>
  )
}
