import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  if (!user) {
    // Giriş yapmamış kullanıcıyı login sayfasına yönlendir
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
