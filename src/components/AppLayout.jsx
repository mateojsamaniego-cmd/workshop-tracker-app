import { Link, Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Marco de las pantallas del personal: encabezado con inicio y cierre de sesión
export default function AppLayout() {
  return (
    <>
      <header className="sticky top-0 z-10 border-b border-black/[0.08] bg-paper-warmth">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between px-6">
          <Link to="/orders" className="text-lg font-bold tracking-tight">
            Taller App
          </Link>
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="h-10 rounded-lg px-3 text-sm font-medium text-black/60 transition-colors duration-200 hover:text-black"
          >
            Cerrar sesión
          </button>
        </div>
      </header>
      <Outlet />
    </>
  )
}
