import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
      <h1 className="text-2xl font-bold tracking-tight">Página no encontrada</h1>
      <p className="mt-1 text-graphite">El enlace no existe o ya no está disponible.</p>
      <Link to="/" className="mt-4 text-sm font-medium text-notion-blue">
        Ir al inicio
      </Link>
    </main>
  )
}
