export type BodyPart =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'arms'
  | 'legs'
  | 'core'
  | 'cardio'
  | 'full-body'

export interface Exercise {
  id: string
  name: string
  sets?: number
  reps?: number
  weight?: number
  duration?: number
  notes?: string
  bodyPart: BodyPart
}

export interface Workout {
  id: string
  date: string // ISO date string
  prompt?: string // Original user prompt
  exercises: Exercise[]
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface WorkoutHistory {
  id: string
  date: string // ISO date string (YYYY-MM-DD)
  bodyParts: BodyPart[] // Multiple body parts can be worked in one day
  workoutIds: string[] // References to workouts completed that day
}

export interface UserSettings {
  id: string
  theme: 'light' | 'dark'
  apiEndpoint: string
}

// Body part color mapping for the heatmap
export const BODY_PART_COLORS: Record<BodyPart, string> = {
  'chest': '#ef4444',      // red
  'back': '#3b82f6',       // blue
  'shoulders': '#f59e0b',  // amber
  'arms': '#8b5cf6',       // violet
  'legs': '#10b981',       // emerald
  'core': '#ec4899',       // pink
  'cardio': '#06b6d4',     // cyan
  'full-body': '#6366f1'   // indigo
}
