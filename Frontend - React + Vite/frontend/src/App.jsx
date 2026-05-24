import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Layouts
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ActivitiesPage from './pages/ActivitiesPage'
import AddActivityPage from './pages/AddActivityPage'
import EditActivityPage from './pages/EditActivityPage'
import StatisticsPage from './pages/StatisticsPage'
import GoalsPage from './pages/GoalsPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminActivitiesPage from './pages/AdminActivitiesPage'
import NotFoundPage from './pages/NotFoundPage'

const App = () => {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Pages */}
      <Route path="/login" element={
        <AuthLayout><LoginPage /></AuthLayout>
      } />
      <Route path="/register" element={
        <AuthLayout><RegisterPage /></AuthLayout>
      } />

      {/* User Protected */}
      <Route path="/dashboard" element={
        <MainLayout><DashboardPage /></MainLayout>
      } />
      <Route path="/activities" element={
        <MainLayout><ActivitiesPage /></MainLayout>
      } />
      <Route path="/activities/add" element={
        <MainLayout><AddActivityPage /></MainLayout>
      } />
      <Route path="/activities/edit/:id" element={
        <MainLayout><EditActivityPage /></MainLayout>
      } />
      <Route path="/statistics" element={
        <MainLayout><StatisticsPage /></MainLayout>
      } />
      <Route path="/goals" element={
        <MainLayout><GoalsPage /></MainLayout>
      } />
      <Route path="/profile" element={
        <MainLayout><ProfilePage /></MainLayout>
      } />
      <Route path="/settings" element={
        <MainLayout><SettingsPage /></MainLayout>
      } />

      {/* Admin Protected */}
      <Route path="/admin" element={
        <MainLayout adminOnly><AdminDashboardPage /></MainLayout>
      } />
      <Route path="/admin/users" element={
        <MainLayout adminOnly><AdminUsersPage /></MainLayout>
      } />
      <Route path="/admin/activities" element={
        <MainLayout adminOnly><AdminActivitiesPage /></MainLayout>
      } />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App