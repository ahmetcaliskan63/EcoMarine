import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AuthProvider from './components/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import TasksPage from './pages/TasksPage'
import TaskDetailPage from './pages/TaskDetailPage'
import ReportsPage from './pages/ReportsPage'
import ProfilePage from './pages/ProfilePage'
import MapPage from './pages/MapPage'
import SatelliteMonitoringPage from './pages/SatelliteMonitoringPage'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Layout olmadan sayfalar */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Korumalı sayfalar - Layout ile */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><DashboardPage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/tasks" element={
              <ProtectedRoute>
                <Layout><TasksPage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/tasks/:id" element={
              <ProtectedRoute>
                <Layout><TaskDetailPage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Layout><ReportsPage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout><ProfilePage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/map" element={
              <ProtectedRoute>
                <Layout><MapPage /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/satellite-monitoring" element={
              <ProtectedRoute>
                <Layout><SatelliteMonitoringPage /></Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

// Ana sayfa bileşeni
const HomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="mx-auto w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center mb-8">
          <span className="text-white font-bold text-4xl">E</span>
        </div>
        <h1 className="text-5xl font-bold text-primary-500 mb-6">
          EcoMarineAI
        </h1>
        <h2 className="text-2xl text-gray-600 mb-4">
          Saha Personeli Yönetim Sistemi
        </h2>
        <p className="text-lg text-gray-500 mb-8 leading-relaxed">
          Deniz kirliliği izleme ve saha personeli yönetimi için geliştirilmiş
          kurumsal web uygulaması. Çevresel verileri takip edin, görevleri
          yönetin ve raporları analiz edin.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/login" className="btn-primary text-center">
            Giriş Yap
          </a>
          <button className="btn-secondary">
            Hakkında
          </button>
        </div>
      </div>
    </div>
  )
}

// DashboardPage artık ayrı dosyada

// TasksPage artık ayrı dosyada

// ReportsPage artık ayrı dosyada

// ProfilePage artık ayrı dosyada

// MapPage artık ayrı dosyada


export default App
