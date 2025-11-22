import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import PromptPage from './pages/PromptPage'
import WorkoutPage from './pages/WorkoutPage'
import { initializeSettings } from './services/db'

function App() {
  useEffect(() => {
    // Initialize database settings on app start
    initializeSettings()
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PromptPage />} />
        <Route path="/workout" element={<WorkoutPage />} />
      </Routes>
    </Router>
  )
}

export default App
