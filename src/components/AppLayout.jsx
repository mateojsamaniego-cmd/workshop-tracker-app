import { Link, Outlet } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Barra superior fija de 64px con la sombra de "Nav (sticky)" de DESIGN.md
export default function AppLayout() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-paper-warmth shadow-[0px_0.7px_1.462px_0px_rgb(0_0_0/0.015),0px_3px_9px_0px_rgb(0_0_0/0.03)]">
        <div className="mx-auto flex h-16 max-w-md items-center justify-between px-6">
          <Link to="/orders" className="text-heading-sm font-bold">
            Taller App
          </Link>
          {/* Muted Nav Link: texto a 54 % de alpha, se oscurece al pasar el cursor */}
          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="rounded-lg px-4 py-3 text-body-sm font-medium text-black/[0.54] transition-colors duration-200 hover:text-black"
          >
            Cerrar sesión
          </button>
        </div>
      </header>
      <Outlet />
    </>
  )
}
