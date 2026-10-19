import { supabase } from '../lib/supabase'

// Pantalla provisional: la lista real de órdenes se construye en la Etapa 3.
export default function Orders() {
  return (
    <main className="mx-auto max-w-md p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Órdenes</h1>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="h-10 rounded-lg px-3 text-sm font-medium text-black/60 transition-colors duration-200 hover:text-black"
        >
          Cerrar sesión
        </button>
      </header>

      <section className="mt-6 rounded-xl border border-black/[0.08] bg-pure-white p-6 text-center text-graphite">
        Aún no hay órdenes.
      </section>
    </main>
  )
}
