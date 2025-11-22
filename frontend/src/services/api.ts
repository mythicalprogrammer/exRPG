import axios from 'axios'
import type { Exercise } from '../types'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30 seconds for LLM generation
  headers: {
    'Content-Type': 'application/json'
  }
})

export interface WorkoutPromptRequest {
  prompt: string
}

export interface WorkoutPlanResponse {
  exercises: Exercise[]
  notes?: string
}

// Request a workout plan from llama.cpp via FastAPI
export async function generateWorkoutPlan(prompt: string): Promise<WorkoutPlanResponse> {
  try {
    const response = await api.post<WorkoutPlanResponse>('/workout/generate', {
      prompt
    })
    return response.data
  } catch (error) {
    console.error('Error generating workout plan:', error)
    throw error
  }
}

// Health check endpoint
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await api.get('/health')
    return response.status === 200
  } catch (error) {
    console.error('API health check failed:', error)
    return false
  }
}

export default api
