import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './i18n'

// Pages
import { TripsListPage } from './pages/TripsListPage'
import { TripFormPage } from './pages/TripFormPage'
import { PlannerPage } from './pages/PlannerPage'

// Modals
import { AddPlaceModal } from './components/features/AddPlaceModal'
import { AIOptimizationPanel } from './components/features/AIOptimizationPanel'

function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    // Set initial language (could be from user preferences)
    const savedLang = localStorage.getItem('language') || 'en'
    i18n.changeLanguage(savedLang)
  }, [i18n])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={<Navigate to="/trips" replace />} />
          <Route path="/trips" element={<TripsListPage />} />
          <Route path="/trips/new" element={<TripFormPage />} />
          <Route path="/planner/:tripId" element={<PlannerPage />} />
        </Routes>

        {/* Global Modals */}
        <AddPlaceModal />
        <AIOptimizationPanel />
      </div>
    </BrowserRouter>
  )
}

export default App
