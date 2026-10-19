import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import LoadingScreen from '../components/LoadingScreen'

const inputClass =
  'mt-1 h-12 w-full rounded-lg border border-black/[0.15] bg-pure-white px-3 text-base outline-none transition-colors duration-200 focus:border-notion-blue'

export default function Login() {
  const { session, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (loading) return <LoadingScreen />
  if (session) return <Navigate to="/orders" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Ingresa tu correo y tu contraseña.')
      return
    }

    setSubmitting(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setSubmitting(false)

    // Mensaje genérico a propósito: no revela si el correo existe
    if (signInError) setError('Correo o contraseña incorrectos.')
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">
      <h1 className="text-3xl font-bold tracking-tight">Taller App</h1>
      <p className="mt-1 text-graphite">Ingreso del personal</p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-xl border border-black/[0.08] bg-pure-white p-6"
        noValidate
      >
        <label className="block text-sm font-medium" htmlFor="email">
          Correo
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="mt-4 block text-sm font-medium" htmlFor="password">
          Contraseña
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </label>

        {error && (
          <p role="alert" className="mt-4 text-sm text-vermillion">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 h-12 w-full rounded-lg bg-notion-blue text-base font-medium text-white transition-colors duration-200 hover:bg-signal-blue disabled:opacity-60"
        >
          {submitting ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </main>
  )
}
