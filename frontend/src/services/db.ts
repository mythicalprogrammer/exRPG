import Dexie, { type Table } from 'dexie'
import type { Workout, WorkoutHistory, UserSettings } from '../types'

export class WorkoutDatabase extends Dexie {
  workouts!: Table<Workout>
  history!: Table<WorkoutHistory>
  settings!: Table<UserSettings>

  constructor() {
    super('WorkoutDatabase')

    this.version(1).stores({
      workouts: 'id, date, completed, createdAt',
      history: 'id, date',
      settings: 'id'
    })
  }
}

export const db = new WorkoutDatabase()

// Initialize default settings
export async function initializeSettings() {
  const existingSettings = await db.settings.count()
  if (existingSettings === 0) {
    await db.settings.add({
      id: 'default',
      theme: 'dark',
      apiEndpoint: '/api'
    })
  }
}

// Helper functions for common operations
export async function saveWorkout(workout: Workout) {
  return await db.workouts.put(workout)
}

export async function getWorkouts() {
  return await db.workouts.orderBy('date').reverse().toArray()
}

export async function getWorkoutsByDateRange(startDate: string, endDate: string) {
  return await db.workouts
    .where('date')
    .between(startDate, endDate, true, true)
    .toArray()
}

export async function saveWorkoutHistory(history: WorkoutHistory) {
  return await db.history.put(history)
}

export async function getWorkoutHistory() {
  return await db.history.orderBy('date').reverse().toArray()
}

export async function getHistoryByDateRange(startDate: string, endDate: string) {
  return await db.history
    .where('date')
    .between(startDate, endDate, true, true)
    .toArray()
}
