import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import LoadingScreen from '../components/LoadingScreen'
import { cardClass, inputClass, primaryButtonClass } from '../lib/styles'

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
      {/* Titular con la píldora de resaltado, el recurso tipográfico característico de DESIGN.md */}
      <h1 className="text-heading font-medium">
        Tu taller,
        <br />
        <span className="inline-block rounded-full bg-peach px-6 py-2">al día</span>
      </h1>
      <p className="mt-4 text-body text-graphite">Ingreso del personal</p>

      <form onSubmit={handleSubmit} className={`mt-6 ${cardClass}`} noValidate>
        <label className="block text-body-sm font-medium" htmlFor="email">
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

        <label className="mt-4 block text-body-sm font-medium" htmlFor="password">
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
          <p role="alert" className="mt-4 text-body-sm text-vermillion">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className={`mt-6 ${primaryButtonClass}`}>
          {submitting ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </main>
  )
}
