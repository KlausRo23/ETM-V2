import { Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="etm-board etm-hero">
        <p className="etm-loading-state">Loading...</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return children
}