export default function App() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold tracking-tight">Taller App</h1>
      <p className="mt-1 text-graphite">Proyecto base listo.</p>

      {/* Tarjeta de ejemplo según DESIGN.md: fondo blanco, borde fino, sin sombra, radio 12px */}
      <section className="mt-6 rounded-xl border border-black/[0.08] bg-pure-white p-6">
        <h2 className="text-lg font-semibold">Estilos listos</h2>
        <p className="mt-1 text-sm text-graphite">Tailwind está configurado con los colores del diseño.</p>
        <button
          type="button"
          className="mt-4 w-full rounded-lg bg-notion-blue px-4 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-signal-blue"
        >
          Acción principal
        </button>
      </section>
    </main>
  )
}
