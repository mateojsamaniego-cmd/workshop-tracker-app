import { Outlet } from 'react-router-dom'

// Cada pantalla del personal arma su propia barra superior (como en la app de Notion)
export default function AppLayout() {
  return <Outlet />
}
