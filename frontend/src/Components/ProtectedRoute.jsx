import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Sends visitors without a demo session back to the login page
function ProtectedRoute({ children }) {
  const { session } = useAuth()
  if (!session) return <Navigate to="/login" replace />
  return children
}

export default ProtectedRoute
