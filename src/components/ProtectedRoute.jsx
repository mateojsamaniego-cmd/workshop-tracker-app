import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingScreen from './LoadingScreen'

// Solo deja pasar al personal con sesión. Esto mejora la experiencia; la seguridad real
// la dan las policies RLS en la base de datos.
export default function ProtectedRoute() {
  const { session, loading } = useAuth()

  if (loading) return <LoadingScreen />
  if (!session) return <Navigate to="/login" replace />
  return <Outlet />
}
