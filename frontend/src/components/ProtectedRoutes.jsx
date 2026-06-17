import React from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

function ProtectedRoutes({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoutes