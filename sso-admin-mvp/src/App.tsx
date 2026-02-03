import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'
import { UsersListPage } from './pages/UsersListPage'
import { UserDetailPage } from './pages/UserDetailPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersListPage />} />
        <Route path="/users/:userId" element={<UserDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
