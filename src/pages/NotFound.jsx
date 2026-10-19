import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
      <h1 className="text-heading-sm font-bold">Página no encontrada</h1>
      <p className="mt-2 text-body text-graphite">El enlace no existe o ya no está disponible.</p>
      {/* Ghost Text Button: sin relleno, texto negro a 95 % */}
      <Link to="/" className="mt-4 self-start rounded-lg px-4 py-3 text-body-sm font-medium text-black/95 hover:bg-black/5">
        Ir al inicio
      </Link>
    </main>
  )
}
