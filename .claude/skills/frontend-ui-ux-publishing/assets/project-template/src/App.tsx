import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PageLayout } from './components/common'

function App() {
  return (
    <BrowserRouter>
      <PageLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </PageLayout>
    </BrowserRouter>
  )
}

function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title font-semibold">Welcome</h1>
        <p className="text-muted-foreground mt-2">
          This is a frontend application built with the UI/UX Publishing Skill.
        </p>
      </div>

      <div className="flex gap-4">
        <img src="/logo.png" alt="Logo" className="w-16 h-16" />
      </div>
    </div>
  )
}

export default App
