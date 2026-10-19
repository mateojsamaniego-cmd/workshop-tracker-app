import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AuthProvider from './context/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Orders from './pages/Orders'
import Tracking from './pages/Tracking'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/t/:token" element={<Tracking />} />

          {/* Solo personal con sesión */}
          <Route element={<ProtectedRoute />}>
            <Route path="/orders" element={<Orders />} />
          </Route>

          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
