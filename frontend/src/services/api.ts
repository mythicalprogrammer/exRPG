import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export interface AIRequest {
  name: string
  prompt?: string
}

export interface AIResponse {
  Hello: string
}

export async function sendToAI(name: string, prompt?: string): Promise<AIResponse> {
  try {
    const response = await api.post<AIResponse>('/ai/', {
      name,
      prompt
    })
    return response.data
  } catch (error) {
    console.error('Error calling AI endpoint:', error)
    throw error
  }
}

export default api
